import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Play,
  Pause,
  Layers,
  RotateCw,
  Focus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ComputerNodeId } from '../../data/computerTypes';
import { createProceduralComputerModel, type ProceduralComputerHandle } from './proceduralModels';
import { createContactShadowTexture, createFloorGridTexture } from './proceduralTextures';

interface Computer3DViewportProps {
  selectedId: ComputerNodeId;
  accentHex: string;
  label: string;
}

export function Computer3DViewport({
  selectedId,
  accentHex,
  label,
}: Computer3DViewportProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);

  // Refs synced to animation loop without re-initializing WebGLRenderer
  const stateRef = useRef({
    isPlaying: true,
    isExploded: false,
    autoRotate: true,
    resetRequested: false,
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    stateRef.current.isExploded = isExploded;
  }, [isExploded]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (resetSignal > 0) {
      stateRef.current.resetRequested = true;
    }
  }, [resetSignal]);

  // Ref holding active procedural model handle & camera goal
  const modelRef = useRef<ProceduralComputerHandle | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraGoalRef = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
    active: boolean;
  }>({
    pos: new THREE.Vector3(0.5, 2.2, 4.6),
    target: new THREE.Vector3(0, 0.9, 0),
    active: false,
  });
  const entranceScaleRef = useRef(0.15);

  // Initialize Three.js WebGLRenderer once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070d1f');
    scene.fog = new THREE.Fog('#070d1f', 7.5, 19);
    sceneRef.current = scene;

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 360);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(0.5, 2.2, 4.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });

    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '')
      : String(gl.getParameter(gl.RENDERER) || '');
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|ANGLE.*Direct3D.*Warp/i.test(rendererStr);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1.25 : 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Studio IBL Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // 3-Point Warm/Cool Studio Lighting
    const hemi = new THREE.HemisphereLight(0xcbd5e1, 0x0f172a, 0.55);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.1);
    keyLight.position.set(4.5, 7.5, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(isSoftwareGl ? 1024 : 2048, isSoftwareGl ? 1024 : 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fillLight.position.set(-5.5, 3.5, -3.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.75);
    rimLight.position.set(0, 4.5, -5.5);
    scene.add(rimLight);

    // Grounded Floor Grid + Contact Shadow
    const gridTex = createFloorGridTexture();
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshStandardMaterial({
        map: gridTex,
        roughness: 0.75,
        metalness: 0.25,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.002;
    floor.receiveShadow = true;
    scene.add(floor);

    const shadowTex = createContactShadowTexture();
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 5.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.002;
    scene.add(contactShadow);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0.9, 0);
    controls.update();

    // Stop camera glide if user grabs OrbitControls
    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    // ResizeObserver for crisp layout transitions
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(entry.contentRect.width, 280);
      const h = Math.max(entry.contentRect.height, 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation loop with software-GL pacing & smooth damping
    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let prevTime = performance.now();
    let elapsedSim = 0;
    let explodeSmooth = 0;

    const afterDraw = (nextTick: () => void) => {
      if (isSoftwareGl) {
        timerId = window.setTimeout(() => {
          if (!disposed) rafId = window.requestAnimationFrame(nextTick);
        }, 16);
      } else {
        rafId = window.requestAnimationFrame(nextTick);
      }
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      if (stateRef.current.isPlaying) {
        elapsedSim += delta;
      }

      // Smoothly damp explode & entrance scale
      const targetExplode = stateRef.current.isExploded ? 1 : 0;
      explodeSmooth = THREE.MathUtils.damp(explodeSmooth, targetExplode, 7, delta);
      entranceScaleRef.current = THREE.MathUtils.damp(entranceScaleRef.current, 1, 9, delta);

      const activeModel = modelRef.current;
      if (activeModel) {
        activeModel.group.scale.setScalar(entranceScaleRef.current);
        activeModel.animate(elapsedSim, delta, explodeSmooth);
      }

      // Smooth camera transition when switching tree nodes or clicking Reset Camera
      if (stateRef.current.resetRequested && activeModel) {
        cameraGoalRef.current.pos.set(...activeModel.recommendedCamera.position);
        cameraGoalRef.current.target.set(...activeModel.recommendedCamera.target);
        cameraGoalRef.current.active = true;
        stateRef.current.resetRequested = false;
      }

      if (cameraGoalRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          cameraGoalRef.current.pos.x,
          5.5,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          cameraGoalRef.current.pos.y,
          5.5,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          cameraGoalRef.current.pos.z,
          5.5,
          delta
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          cameraGoalRef.current.target.x,
          6.5,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          cameraGoalRef.current.target.y,
          6.5,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          cameraGoalRef.current.target.z,
          6.5,
          delta
        );

        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 0.03 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.03
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.autoRotate = stateRef.current.autoRotate;
      controls.autoRotateSpeed = 0.85;
      controls.update();

      renderer.render(scene, camera);
      afterDraw(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();

      if (modelRef.current) {
        scene.remove(modelRef.current.group);
        modelRef.current.dispose();
        modelRef.current = null;
      }

      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      gridTex.dispose();

      contactShadow.geometry.dispose();
      (contactShadow.material as THREE.Material).dispose();
      shadowTex.dispose();

      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  // Swap procedural 3D model whenever selectedId changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (modelRef.current) {
      scene.remove(modelRef.current.group);
      modelRef.current.dispose();
      modelRef.current = null;
    }

    const nextModel = createProceduralComputerModel(selectedId);
    entranceScaleRef.current = 0.25;
    nextModel.group.scale.setScalar(0.25);
    scene.add(nextModel.group);
    modelRef.current = nextModel;

    cameraGoalRef.current.pos.set(...nextModel.recommendedCamera.position);
    cameraGoalRef.current.target.set(...nextModel.recommendedCamera.target);
    cameraGoalRef.current.active = true;
  }, [selectedId]);

  return (
    <div className="relative w-full h-[420px] sm:h-[490px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070d1f] select-none">
      {/* Isolated WebGL Mount Point (must remain empty of React children) */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label={`Interactive 3D model of ${label}`}
      />

      {/* Minimal Top-Left Corner Caption (no backdrop-filter over WebGL) */}
      <div className="webgl-hud pointer-events-none absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b132b] border border-slate-700/80 text-xs font-semibold text-slate-100">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: accentHex }}
          aria-hidden="true"
        />
        <span>{label} · Drag to orbit · Scroll to zoom</span>
      </div>

      {/* Collapsible Bottom Control Dock (solid dark surface, no backdrop-filter over WebGL) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 max-w-[95%]">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="webgl-hud inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#0b132b] border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
        >
          {controlsVisible ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hide 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Show 3D Controls</span>
            </>
          )}
        </button>

        {controlsVisible && (
          <div className="webgl-hud flex flex-wrap items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#0b132b] border border-slate-700 shadow-lg">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExploded((e) => !e)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isExploded
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isExploded ? 'Assemble' : 'Explode Parts'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoRotate((r) => !r)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                autoRotate
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Orbit</span>
            </button>

            <button
              type="button"
              onClick={() => setResetSignal((n) => n + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Focus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset View</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
