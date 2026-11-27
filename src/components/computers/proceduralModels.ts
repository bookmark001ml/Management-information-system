import * as THREE from 'three';
import type { ComputerNodeId } from '../../data/computerTypes';
import {
  createAnalogDialTexture,
  createOscilloscopeTexture,
  createPCBTexture,
  createScreenTexture,
} from './proceduralTextures';

export interface ProceduralComputerHandle {
  group: THREE.Group;
  recommendedCamera: { position: [number, number, number]; target: [number, number, number] };
  animate: (elapsed: number, delta: number, explode: number) => void;
  dispose: () => void;
}

// Pre-allocated math helpers (zero per-frame allocations inside animate)
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3(1, 1, 1);
const _euler = new THREE.Euler();

function makeRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function makeBevelBox(
  w: number,
  h: number,
  d: number,
  radius: number,
  bevel = 0.03
): THREE.ExtrudeGeometry {
  const shape = makeRoundedRectShape(w, h, radius);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 12,
  });
  geo.center();
  return geo;
}

function setShadows(obj: THREE.Object3D, cast = true, receive = true) {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = cast;
      child.receiveShadow = receive;
    }
  });
}

function disposeGroup(group: THREE.Group) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      geometries.add(mesh.geometry);
    }
    const matOrArr = mesh.material;
    if (matOrArr) {
      const mats = Array.isArray(matOrArr) ? matOrArr : [matOrArr];
      mats.forEach((m) => {
        materials.add(m);
        const std = m as THREE.MeshStandardMaterial;
        if (std.map) textures.add(std.map);
        if (std.emissiveMap) textures.add(std.emissiveMap);
        if (std.roughnessMap) textures.add(std.roughnessMap);
      });
    }
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => t.dispose());
}

/* -------------------------------------------------------------------------- */
/* 1. ANALOG COMPUTER                                                         */
/* -------------------------------------------------------------------------- */
function buildAnalogModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.45,
    roughness: 0.42,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.25,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.7,
    roughness: 0.35,
  });

  // Base pedestal
  const base = new THREE.Mesh(makeBevelBox(3.4, 0.28, 2.1, 0.14, 0.03), darkMetalMat);
  base.position.y = 0.17;
  group.add(base);

  // Slanted laboratory console body
  const consoleBody = new THREE.Mesh(makeBevelBox(3.1, 1.85, 1.35, 0.16, 0.04), chassisMat);
  consoleBody.position.set(0, 1.25, -0.1);
  consoleBody.rotation.x = -0.12;
  group.add(consoleBody);

  // Analog circular gauge bezel + face
  const dialGroup = new THREE.Group();
  dialGroup.position.set(-0.72, 1.35, 0.61);
  dialGroup.rotation.x = -0.12;

  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.06, 16, 40), brassMat);
  dialGroup.add(bezel);

  const dialTex = createAnalogDialTexture();
  const dialFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.53, 40),
    new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.35, metalness: 0.05 })
  );
  dialFace.position.z = 0.01;
  dialGroup.add(dialFace);

  const needlePivot = new THREE.Group();
  needlePivot.position.z = 0.04;
  const needle = new THREE.Mesh(
    new THREE.BoxGeometry(0.032, 0.4, 0.02),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    })
  );
  needle.position.y = 0.16;
  needlePivot.add(needle);
  const needleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), brassMat);
  needleCap.rotation.x = Math.PI / 2;
  needlePivot.add(needleCap);
  dialGroup.add(needlePivot);
  group.add(dialGroup);

  // Oscilloscope screen
  const scopeTex = createOscilloscopeTexture();
  const scopeFrame = new THREE.Mesh(makeBevelBox(1.22, 0.88, 0.08, 0.08, 0.02), darkMetalMat);
  scopeFrame.position.set(0.74, 1.48, 0.61);
  scopeFrame.rotation.x = -0.12;
  group.add(scopeFrame);

  const scopeScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.06, 0.72),
    new THREE.MeshStandardMaterial({
      map: scopeTex,
      emissiveMap: scopeTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.55,
      roughness: 0.18,
    })
  );
  scopeScreen.position.set(0.74, 1.48, 0.675);
  scopeScreen.rotation.x = -0.12;
  group.add(scopeScreen);

  // Calibration knobs (3 rotating lathe-like cylinders)
  const knobs: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.14, 18), brassMat);
    knob.rotation.x = Math.PI / 2 - 0.12;
    knob.position.set(0.32 + i * 0.42, 0.75, 0.72);
    group.add(knob);
    knobs.push(knob);
  }

  // Continuous sensor cable + flowing wave beads
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.1, 0.35, 1.15),
    new THREE.Vector3(-1.6, 0.55, 0.95),
    new THREE.Vector3(-1.15, 0.45, 0.75),
    new THREE.Vector3(-0.72, 0.72, 0.62),
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 32, 0.04, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 })
  );
  group.add(cable);

  // Continuous sine-wave floating orbs above console showing smooth analog signal
  const orbCount = 16;
  const orbMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    }),
    orbCount
  );
  group.add(orbMesh);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [0.3, 2.3, 4.9], target: [0, 1.15, 0] },
    animate: (elapsed, _delta, explode) => {
      // Smooth continuous oscillation of needle and knobs
      needlePivot.rotation.z = Math.sin(elapsed * 1.45) * 0.85;
      knobs.forEach((k, idx) => {
        k.rotation.y = elapsed * (0.6 + idx * 0.35);
      });

      // Explode lifts dial and scope slightly forward for inspection
      dialGroup.position.z = 0.61 + explode * 0.45;
      scopeFrame.position.z = 0.61 + explode * 0.45;
      scopeScreen.position.z = 0.675 + explode * 0.45;
      consoleBody.position.z = -0.1 - explode * 0.25;

      for (let i = 0; i < orbCount; i++) {
        const t = i / (orbCount - 1);
        const x = -1.25 + t * 2.5;
        const y = 2.55 + Math.sin(elapsed * 3.0 - t * Math.PI * 2.5) * 0.24;
        const z = 0.1 + explode * 0.2;
        _dummyPos.set(x, y, z);
        _dummyScale.setScalar(0.85 + Math.sin(elapsed * 3.0 - t * 4) * 0.2);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        orbMesh.setMatrixAt(i, _dummyMatrix);
      }
      orbMesh.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 2. DIGITAL COMPUTER (PCB + CPU + BINARY PULSES)                            */
/* -------------------------------------------------------------------------- */
function buildDigitalModel(): ProceduralComputerHandle {
  const group = new THREE.Group();
  const pcbTex = createPCBTexture();

  const boardMat = new THREE.MeshStandardMaterial({
    map: pcbTex,
    roughness: 0.45,
    metalness: 0.15,
  });
  const siliconMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.75,
    roughness: 0.2,
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.22,
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });

  // Base standoffs
  const stand = new THREE.Mesh(makeBevelBox(3.5, 0.16, 2.7, 0.12, 0.02), siliconMat);
  stand.position.y = 0.1;
  group.add(stand);

  // Motherboard PCB
  const pcb = new THREE.Mesh(makeBevelBox(3.3, 0.12, 2.5, 0.1, 0.02), boardMat);
  pcb.position.y = 0.34;
  group.add(pcb);

  // Central CPU Socket & Silicon Die
  const cpuGroup = new THREE.Group();
  cpuGroup.position.set(0, 0.48, 0);
  const socket = new THREE.Mesh(makeBevelBox(1.05, 0.12, 1.05, 0.08, 0.02), copperMat);
  cpuGroup.add(socket);

  const cpuDie = new THREE.Mesh(makeBevelBox(0.82, 0.14, 0.82, 0.06, 0.02), siliconMat);
  cpuDie.position.y = 0.11;
  cpuGroup.add(cpuDie);

  const cpuCoreRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 12, 32), cyanGlowMat);
  cpuCoreRing.rotation.x = Math.PI / 2;
  cpuCoreRing.position.y = 0.21;
  cpuGroup.add(cpuCoreRing);
  group.add(cpuGroup);

  // 4 RAM sticks flanking CPU
  const ramGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const ram = new THREE.Mesh(makeBevelBox(0.08, 0.42, 1.25, 0.02, 0.01), siliconMat);
    ram.position.set(1.05 + i * 0.15, 0.62, 0);
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 1.2), cyanGlowMat);
    topStrip.position.y = 0.23;
    ram.add(topStrip);
    ramGroup.add(ram);
  }
  group.add(ramGroup);

  // Binary 0/1 discrete cubes racing across 4 bus lanes
  const packetCount = 16;
  const packetInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.11, 0.11, 0.11),
    cyanGlowMat,
    packetCount
  );
  group.add(packetInst);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [2.8, 2.8, 3.8], target: [0, 0.55, 0] },
    animate: (elapsed, _delta, explode) => {
      cpuGroup.position.y = 0.48 + explode * 0.65;
      ramGroup.position.y = explode * 0.45;
      ramGroup.position.x = explode * 0.35;
      cpuCoreRing.rotation.z = elapsed * 2.4;

      // Discrete stepped binary pulses snapping toward and away from CPU
      for (let i = 0; i < packetCount; i++) {
        const lane = i % 4;
        const progress = ((elapsed * 0.75 + i * 0.25) % 1);
        const stepped = Math.floor(progress * 8) / 8; // Visual discrete digital steps!
        const x = -1.45 + stepped * 2.4;
        const z = -0.75 + lane * 0.5;
        const y = 0.48 + (Math.abs(x) < 0.5 ? 0.28 + explode * 0.65 : 0);
        _dummyPos.set(x, y, z);
        _euler.set(0, elapsed * 2, 0);
        _dummyQuat.setFromEuler(_euler);
        const bitScale = i % 2 === 0 ? 1.15 : 0.75;
        _dummyScale.setScalar(bitScale);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        packetInst.setMatrixAt(i, _dummyMatrix);
      }
      packetInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 3. HYBRID COMPUTER (ANALOG SENSOR -> ADC CONVERTER -> DIGITAL MONITOR)     */
/* -------------------------------------------------------------------------- */
function buildHybridModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const whiteMedicalMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.15,
    roughness: 0.35,
  });
  const slateMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.5,
    roughness: 0.4,
  });
  const adcMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.65,
    metalness: 0.6,
    roughness: 0.25,
  });

  // Cart base
  const base = new THREE.Mesh(makeBevelBox(3.5, 0.2, 2.0, 0.12, 0.03), slateMat);
  base.position.y = 0.13;
  group.add(base);

  // Left: Analog Sensor Pad (Heartbeat probe)
  const sensorUnit = new THREE.Mesh(makeBevelBox(0.85, 0.42, 0.9, 0.1, 0.02), whiteMedicalMat);
  sensorUnit.position.set(-1.18, 0.44, 0.25);
  group.add(sensorUnit);

  const pulseSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 20, 20),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })
  );
  pulseSphere.position.set(-1.18, 0.78, 0.25);
  group.add(pulseSphere);

  // Center: ADC Converter Bridge Module
  const adcBridge = new THREE.Mesh(makeBevelBox(0.75, 0.55, 0.75, 0.08, 0.02), adcMat);
  adcBridge.position.set(-0.1, 0.52, 0.1);
  group.add(adcBridge);

  // Cable connecting sensor -> ADC -> monitor
  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.18, 0.45, 0.25),
    new THREE.Vector3(-0.65, 0.35, 0.18),
    new THREE.Vector3(-0.1, 0.52, 0.1),
    new THREE.Vector3(0.55, 0.65, 0.0),
    new THREE.Vector3(1.02, 1.05, -0.1),
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(pipeCurve, 36, 0.05, 10, false),
    slateMat
  );
  group.add(cable);

  // Right: Digital ICU Monitor
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(1.05, 1.35, -0.1);
  const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.9, 16), slateMat);
  monitorStand.position.y = -0.7;
  monitorGroup.add(monitorStand);

  const monitorBody = new THREE.Mesh(makeBevelBox(1.55, 1.05, 0.2, 0.1, 0.03), whiteMedicalMat);
  monitorGroup.add(monitorBody);

  const screenTex = createScreenTexture('HYBRID ICU MONITOR', '76 BPM', '#10b981', 'hybrid');
  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.36, 0.86),
    new THREE.MeshStandardMaterial({
      map: screenTex,
      emissiveMap: screenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      roughness: 0.15,
    })
  );
  monitorScreen.position.z = 0.135;
  monitorGroup.add(monitorScreen);
  group.add(monitorGroup);

  // Flowing particles along curve: warm analog before ADC, sharp green-cyan after ADC
  const flowCount = 10;
  const flowMesh = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(0.065, 0),
    new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    }),
    flowCount
  );
  group.add(flowMesh);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [0.3, 2.2, 4.7], target: [0, 0.95, 0] },
    animate: (elapsed, _delta, explode) => {
      const beat = 1 + Math.pow(Math.max(0, Math.sin(elapsed * 3.8)), 6) * 0.45;
      pulseSphere.scale.setScalar(beat);
      adcBridge.position.y = 0.52 + explode * 0.5;
      sensorUnit.position.x = -1.18 - explode * 0.3;
      monitorGroup.position.x = 1.05 + explode * 0.3;

      for (let i = 0; i < flowCount; i++) {
        const u = (elapsed * 0.35 + i / flowCount) % 1;
        pipeCurve.getPointAt(u, _dummyPos);
        _dummyPos.y += 0.14;
        _euler.set(elapsed * 2, elapsed * 3, 0);
        _dummyQuat.setFromEuler(_euler);
        _dummyScale.setScalar(u < 0.5 ? 1.0 : 0.85);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        flowMesh.setMatrixAt(i, _dummyMatrix);
      }
      flowMesh.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 4. SUPERCOMPUTER (CURVED LIQUID-COOLED RACKS + HOLOGRAPHIC CORE)           */
/* -------------------------------------------------------------------------- */
function buildSupercomputerModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const rackMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.78,
    roughness: 0.28,
  });
  const purpleGlowMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0xa855f7,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.25,
  });

  // Circular raised floor stage
  const stage = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.5, 0.18, 48),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.38 })
  );
  stage.position.y = 0.09;
  group.add(stage);

  // 5 Curved Racks in a semicircle
  const racks: THREE.Group[] = [];
  const turbines: THREE.Mesh[] = [];
  const radius = 1.6;
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI * 0.42 + (i / 4) * (Math.PI * 0.84);
    const rackGroup = new THREE.Group();
    rackGroup.position.set(Math.sin(angle) * radius, 0.18, -Math.cos(angle) * radius + 0.35);
    rackGroup.rotation.y = -angle;

    const body = new THREE.Mesh(makeBevelBox(0.76, 2.25, 0.65, 0.06, 0.02), rackMat);
    body.position.y = 1.15;
    rackGroup.add(body);

    // Copper liquid cooling pipe on top
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.72, 12), copperMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.y = 2.34;
    rackGroup.add(pipe);

    // Top turbine fan
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 6), purpleGlowMat);
    fan.position.y = 2.32;
    rackGroup.add(fan);
    turbines.push(fan);

    // Glowing vertical front strips
    for (let s = -1; s <= 1; s += 2) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.95, 0.03), purpleGlowMat);
      strip.position.set(s * 0.28, 1.15, 0.35);
      rackGroup.add(strip);
    }

    racks.push(rackGroup);
    group.add(rackGroup);
  }

  // Instanced LED compute blades across the 5 racks (5 racks * 8 blades = 40 LEDs)
  const ledCount = 40;
  const ledInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.42, 0.055, 0.04),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.95,
      roughness: 0.2,
    }),
    ledCount
  );
  group.add(ledInst);

  // Central levitating simulation sphere + rings
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 1.35, 0.55);
  const coreSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 1),
    new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.7,
      wireframe: true,
    })
  );
  coreGroup.add(coreSphere);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.02, 10, 40), purpleGlowMat);
  coreGroup.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.018, 10, 40), copperMat);
  ring2.rotation.x = Math.PI / 2;
  coreGroup.add(ring2);
  group.add(coreGroup);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [0.2, 2.6, 5.1], target: [0, 1.2, 0] },
    animate: (elapsed, _delta, explode) => {
      coreGroup.position.y = 1.35 + Math.sin(elapsed * 2) * 0.08 + explode * 0.45;
      coreSphere.rotation.y = elapsed * 1.4;
      coreSphere.rotation.x = elapsed * 0.7;
      ring1.rotation.x = elapsed * 1.6;
      ring1.rotation.y = elapsed * 0.9;
      ring2.rotation.y = -elapsed * 1.3;

      turbines.forEach((t, idx) => {
        t.rotation.y = elapsed * (5 + idx * 0.4);
      });

      let idx = 0;
      for (let r = 0; r < 5; r++) {
        const angle = -Math.PI * 0.42 + (r / 4) * (Math.PI * 0.84);
        const rad = radius + explode * 0.5;
        racks[r].position.set(Math.sin(angle) * rad, 0.18, -Math.cos(angle) * rad + 0.35);

        for (let b = 0; b < 8; b++) {
          const localZ = 0.36;
          const localY = 0.45 + b * 0.21;
          const wx = racks[r].position.x + Math.sin(-angle) * localZ;
          const wz = racks[r].position.z + Math.cos(-angle) * localZ;
          _dummyPos.set(wx, localY, wz);
          _euler.set(0, -angle, 0);
          _dummyQuat.setFromEuler(_euler);
          const pulse = 0.75 + 0.35 * Math.sin(elapsed * 6 + r * 1.3 + b * 0.8);
          _dummyScale.set(pulse, 1, 1);
          _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
          ledInst.setMatrixAt(idx++, _dummyMatrix);
        }
      }
      ledInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 5. MAINFRAME COMPUTER (DUAL-BAY ENTERPRISE VAULT + TRANSACTION STREAMS)    */
/* -------------------------------------------------------------------------- */
function buildMainframeModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const vaultMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.75,
    roughness: 0.3,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    roughness: 0.08,
    metalness: 0.1,
    transmission: 0.4,
  });
  const blueGlowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });

  // Heavy base plinth
  const plinth = new THREE.Mesh(makeBevelBox(3.4, 0.22, 1.8, 0.1, 0.03), vaultMat);
  plinth.position.y = 0.14;
  group.add(plinth);

  // Dual bays
  const bays: THREE.Group[] = [];
  for (let i = 0; i < 2; i++) {
    const bay = new THREE.Group();
    bay.position.set(i === 0 ? -0.82 : 0.82, 0.26, 0);

    const cabinet = new THREE.Mesh(makeBevelBox(1.38, 2.3, 1.35, 0.08, 0.03), vaultMat);
    cabinet.position.y = 1.15;
    bay.add(cabinet);

    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, 0.04), glassMat);
    doorGlass.position.set(0, 1.15, 0.72);
    bay.add(doorGlass);

    // Internal storage shelves
    for (let s = 0; s < 5; s++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.8), blueGlowMat);
      shelf.position.set(0, 0.45 + s * 0.38, 0.15);
      bay.add(shelf);
    }

    bays.push(bay);
    group.add(bay);
  }

  // Top bridge busbar connecting both bays
  const bridge = new THREE.Mesh(makeBevelBox(2.9, 0.18, 0.7, 0.06, 0.02), blueGlowMat);
  bridge.position.set(0, 2.66, 0);
  group.add(bridge);

  // Simultaneous multi-channel transaction cubes streaming into front bays
  const txCount = 18;
  const txInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.11, 0.11, 0.11),
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.95,
      roughness: 0.2,
    }),
    txCount
  );
  group.add(txInst);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [2.2, 2.4, 4.9], target: [0, 1.25, 0] },
    animate: (elapsed, _delta, explode) => {
      bays[0].position.x = -0.82 - explode * 0.35;
      bays[1].position.x = 0.82 + explode * 0.35;
      bridge.position.y = 2.66 + explode * 0.35;

      for (let i = 0; i < txCount; i++) {
        const bayIndex = i % 2;
        const lane = Math.floor(i / 2) % 3;
        const t = (elapsed * 0.9 + (i * 0.17)) % 1;
        const targetX = bayIndex === 0 ? -0.82 - explode * 0.35 : 0.82 + explode * 0.35;
        const x = targetX + (lane - 1) * 0.32;
        const z = 1.95 - t * 1.25;
        const y = 0.65 + (i % 3) * 0.48;
        _dummyPos.set(x, y, z);
        _euler.set(0, elapsed * 2, 0);
        _dummyQuat.setFromEuler(_euler);
        _dummyScale.setScalar(1 - t * 0.3);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        txInst.setMatrixAt(i, _dummyMatrix);
      }
      txInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 6. MINICOMPUTER (MIDRANGE SERVER + 4 CLIENT WORKSTATIONS)                  */
/* -------------------------------------------------------------------------- */
function buildMinicomputerModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const serverMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.6,
    roughness: 0.35,
  });
  const orangeGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfb923c,
    emissive: 0xea580c,
    emissiveIntensity: 0.85,
    roughness: 0.25,
  });

  // Central midrange cabinet
  const centerCabinet = new THREE.Mesh(makeBevelBox(1.15, 1.95, 1.05, 0.1, 0.03), serverMat);
  centerCabinet.position.y = 1.0;
  group.add(centerCabinet);

  // Cooling fan on front/top
  const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 6), orangeGlowMat);
  fan.rotation.x = Math.PI / 2;
  fan.position.set(0, 1.45, 0.56);
  group.add(fan);

  // 4 surrounding mini workstation terminals connected by curved network tubes
  const angles = [-Math.PI * 0.72, -Math.PI * 0.28, Math.PI * 0.28, Math.PI * 0.72];
  const curves: THREE.CatmullRomCurve3[] = [];
  const terminals: THREE.Group[] = [];

  angles.forEach((a) => {
    const dist = 1.95;
    const tx = Math.sin(a) * dist;
    const tz = Math.cos(a) * dist;

    const term = new THREE.Group();
    term.position.set(tx, 0, tz);
    term.lookAt(0, 0, 0);

    const desk = new THREE.Mesh(makeBevelBox(0.65, 0.1, 0.48, 0.04, 0.01), serverMat);
    desk.position.y = 0.07;
    term.add(desk);

    const screen = new THREE.Mesh(makeBevelBox(0.55, 0.4, 0.06, 0.04, 0.01), orangeGlowMat);
    screen.position.y = 0.36;
    term.add(screen);

    terminals.push(term);
    group.add(term);

    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(tx * 0.5, 0.14, tz * 0.5),
      new THREE.Vector3(tx, 0.16, tz),
    ]);
    curves.push(c);
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(c, 20, 0.03, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.45 })
    );
    group.add(cable);
  });

  // Bidirectional packet orbs traveling between server & terminals
  const pktCount = 8;
  const pktInst = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    orangeGlowMat,
    pktCount
  );
  group.add(pktInst);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [0.4, 2.7, 4.9], target: [0, 0.75, 0] },
    animate: (elapsed, _delta, explode) => {
      fan.rotation.y = elapsed * 5.0;
      centerCabinet.position.y = 1.0 + explode * 0.45;
      fan.position.y = 1.45 + explode * 0.45;

      for (let i = 0; i < pktCount; i++) {
        const curve = curves[i % 4];
        const rawT = (elapsed * 0.75 + i * 0.25) % 1;
        const u = i < 4 ? rawT : 1 - rawT;
        curve.getPointAt(u, _dummyPos);
        _dummyPos.y += 0.12;
        _dummyScale.setScalar(1.0);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        pktInst.setMatrixAt(i, _dummyMatrix);
      }
      pktInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 7. DESKTOP PC (EXPANDABLE TOWER + MONITOR + MECHANICAL KEYBOARD + MOUSE)   */
/* -------------------------------------------------------------------------- */
function buildDesktopModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.65,
    roughness: 0.35,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.24,
    roughness: 0.08,
    metalness: 0.1,
  });
  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.85,
    roughness: 0.25,
  });

  // Desk mat
  const mat = new THREE.Mesh(
    makeBevelBox(3.7, 0.06, 2.1, 0.1, 0.01),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
  );
  mat.position.y = 0.04;
  group.add(mat);

  // PC Tower (right side)
  const towerGroup = new THREE.Group();
  towerGroup.position.set(1.22, 0.08, -0.15);

  const towerFrame = new THREE.Mesh(makeBevelBox(0.74, 1.55, 1.35, 0.06, 0.02), caseMat);
  towerFrame.position.y = 0.78;
  towerGroup.add(towerFrame);

  // Internal CPU fan + GPU visible inside
  const cpuFan = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 6), cyanMat);
  cpuFan.rotation.z = Math.PI / 2;
  cpuFan.position.set(-0.15, 0.95, 0);
  towerGroup.add(cpuFan);

  const gpuCard = new THREE.Mesh(makeBevelBox(0.24, 0.08, 0.8, 0.02, 0.01), cyanMat);
  gpuCard.position.set(-0.14, 0.6, 0.05);
  towerGroup.add(gpuCard);

  // Transparent side panel (slides outward on explode)
  const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.38, 1.18), glassMat);
  sideGlass.position.set(-0.4, 0.78, 0);
  towerGroup.add(sideGlass);
  group.add(towerGroup);

  // Widescreen Monitor (left-center)
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(-0.45, 0.08, -0.35);

  const standBase = new THREE.Mesh(makeBevelBox(0.8, 0.06, 0.55, 0.04, 0.01), caseMat);
  standBase.position.y = 0.03;
  monitorGroup.add(standBase);

  const standNeck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.1), caseMat);
  standNeck.position.set(0, 0.36, -0.12);
  monitorGroup.add(standNeck);

  const panel = new THREE.Mesh(makeBevelBox(2.05, 1.18, 0.09, 0.06, 0.02), caseMat);
  panel.position.set(0, 0.98, 0);
  monitorGroup.add(panel);

  const screenTex = createScreenTexture('SMARTMART DESKTOP', 'PROFIT +18%', '#22d3ee', 'desktop');
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.88, 1.02),
    new THREE.MeshStandardMaterial({
      map: screenTex,
      emissiveMap: screenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      roughness: 0.15,
    })
  );
  screen.position.set(0, 0.98, 0.07);
  monitorGroup.add(screen);
  group.add(monitorGroup);

  // Mechanical Keyboard with InstancedMesh keycaps
  const kbBase = new THREE.Mesh(makeBevelBox(1.45, 0.07, 0.54, 0.04, 0.01), caseMat);
  kbBase.position.set(-0.55, 0.12, 0.56);
  group.add(kbBase);

  const keyCols = 11;
  const keyRows = 4;
  const keyInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.095, 0.045, 0.095),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45 }),
    keyCols * keyRows
  );
  let k = 0;
  for (let r = 0; r < keyRows; r++) {
    for (let c = 0; c < keyCols; c++) {
      _dummyPos.set(-1.14 + c * 0.118, 0.18, 0.39 + r * 0.115);
      _dummyScale.setScalar(1);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      keyInst.setMatrixAt(k++, _dummyMatrix);
    }
  }
  keyInst.instanceMatrix.needsUpdate = true;
  group.add(keyInst);

  // Ergonomic Mouse
  const mouse = new THREE.Mesh(makeBevelBox(0.24, 0.1, 0.4, 0.09, 0.02), caseMat);
  mouse.position.set(0.42, 0.14, 0.56);
  group.add(mouse);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [0.6, 2.1, 4.4], target: [0.1, 0.75, 0] },
    animate: (elapsed, _delta, explode) => {
      cpuFan.rotation.x = elapsed * 6.5;
      sideGlass.position.x = -0.4 - explode * 0.75;
      gpuCard.position.x = -0.14 - explode * 0.35;
      cpuFan.position.x = -0.15 - explode * 0.25;
      towerGroup.position.x = 1.22 + explode * 0.25;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 8. LAPTOP COMPUTER (UNIBODY BASE + HINGED LID + BACKLIT KEYS)              */
/* -------------------------------------------------------------------------- */
function buildLaptopModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const aluMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.24,
  });
  const darkKeyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.5,
  });
  const emeraldMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 0.75,
    roughness: 0.25,
  });

  // Laptop Base Chassis
  const baseChassis = new THREE.Mesh(makeBevelBox(2.45, 0.1, 1.72, 0.1, 0.02), aluMat);
  baseChassis.position.set(0, 0.08, 0.2);
  group.add(baseChassis);

  // Recessed glass trackpad
  const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.02, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.4, roughness: 0.2 })
  );
  trackpad.position.set(0, 0.145, 0.72);
  group.add(trackpad);

  // Backlit Keyboard keys
  const keyCols = 13;
  const keyRows = 5;
  const keyInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.135, 0.03, 0.125),
    darkKeyMat,
    keyCols * keyRows
  );
  let idx = 0;
  for (let r = 0; r < keyRows; r++) {
    for (let c = 0; c < keyCols; c++) {
      _dummyPos.set(-0.96 + c * 0.16, 0.148, -0.34 + r * 0.155);
      _dummyScale.setScalar(1);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      keyInst.setMatrixAt(idx++, _dummyMatrix);
    }
  }
  keyInst.instanceMatrix.needsUpdate = true;
  group.add(keyInst);

  // Internal battery + motherboard slab revealed when exploded
  const internalSlab = new THREE.Mesh(makeBevelBox(2.0, 0.05, 1.25, 0.06, 0.01), emeraldMat);
  internalSlab.position.set(0, 0.08, 0.2);
  group.add(internalSlab);

  // Hinged Screen Lid
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.15, -0.64);

  const lidBody = new THREE.Mesh(makeBevelBox(2.45, 1.56, 0.06, 0.1, 0.02), aluMat);
  lidBody.position.set(0, 0.78, 0);
  lidPivot.add(lidBody);

  const screenTex = createScreenTexture('PORTABLE WORKSPACE', 'BATTERY 96%', '#34d399', 'laptop');
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.24, 1.38),
    new THREE.MeshStandardMaterial({
      map: screenTex,
      emissiveMap: screenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.65,
      roughness: 0.15,
    })
  );
  screen.position.set(0, 0.78, 0.052);
  lidPivot.add(screen);
  group.add(lidPivot);

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [1.6, 1.9, 3.8], target: [0, 0.72, 0] },
    animate: (elapsed, _delta, explode) => {
      // Gentle precision hinge breathing + explode separation
      lidPivot.rotation.x = -0.22 + Math.sin(elapsed * 1.1) * 0.08;
      lidPivot.position.y = 0.15 + explode * 0.55;
      baseChassis.position.y = 0.08 - explode * 0.02;
      keyInst.position.y = explode * 0.35;
      internalSlab.position.y = 0.08 + explode * 0.18;
    },
    dispose: () => disposeGroup(group),
  };
}

/* -------------------------------------------------------------------------- */
/* 9. SMARTPHONE & TABLET (SLIM CHASSIS + CAMERAS + 5G SIGNAL WAVES)          */
/* -------------------------------------------------------------------------- */
function buildSmartphoneModel(): ProceduralComputerHandle {
  const group = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.22,
  });
  const pinkGlowMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xec4899,
    emissiveIntensity: 0.75,
    roughness: 0.25,
  });

  // Phone Stand / Dock base
  const dock = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.75, 0.14, 32),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.35 })
  );
  dock.position.y = 0.07;
  group.add(dock);

  // Handheld Chassis group (tilted nicely for front + camera edge view)
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(0, 1.38, 0);
  phoneGroup.rotation.x = -0.1;

  const chassis = new THREE.Mesh(makeBevelBox(1.12, 2.22, 0.12, 0.16, 0.025), frameMat);
  phoneGroup.add(chassis);

  const screenTex = createScreenTexture('MOBILE POCKET PC', '5G CONNECTED', '#f472b6', 'phone');
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.98, 2.02),
    new THREE.MeshStandardMaterial({
      map: screenTex,
      emissiveMap: screenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.7,
      roughness: 0.12,
    })
  );
  screen.position.z = 0.088;
  phoneGroup.add(screen);

  // Rear Camera Bump & 3 Lenses
  const camIsland = new THREE.Mesh(makeBevelBox(0.36, 0.42, 0.06, 0.06, 0.01), frameMat);
  camIsland.position.set(-0.26, 0.72, -0.09);
  phoneGroup.add(camIsland);

  for (let i = 0; i < 3; i++) {
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.04, 18),
      new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.1 })
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.set(i < 2 ? -0.34 : -0.18, i === 1 ? 0.62 : 0.82, -0.12);
    phoneGroup.add(lens);
  }

  // Internal mobile SoC chip shown on explode
  const socChip = new THREE.Mesh(makeBevelBox(0.55, 0.75, 0.04, 0.04, 0.01), pinkGlowMat);
  socChip.position.z = 0;
  phoneGroup.add(socChip);

  group.add(phoneGroup);

  // Radiating 5G/Wi-Fi wireless signal rings
  const signalRings: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.022, 10, 48),
      new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        emissive: 0xec4899,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.55,
      })
    );
    ring.position.set(0, 1.38, 0);
    signalRings.push(ring);
    group.add(ring);
  }

  setShadows(group);

  return {
    group,
    recommendedCamera: { position: [1.3, 1.9, 3.8], target: [0, 1.25, 0] },
    animate: (elapsed, _delta, explode) => {
      phoneGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.32;
      screen.position.z = 0.088 + explode * 0.42;
      chassis.position.z = -explode * 0.15;

      signalRings.forEach((ring, i) => {
        const phase = (elapsed * 0.55 + i / 3) % 1;
        const scale = 0.7 + phase * 1.1;
        ring.scale.setScalar(scale);
        const mat = ring.material as THREE.MeshStandardMaterial;
        mat.opacity = (1 - phase) * 0.6;
      });
    },
    dispose: () => disposeGroup(group),
  };
}

export function createProceduralComputerModel(id: ComputerNodeId): ProceduralComputerHandle {
  switch (id) {
    case 'analog':
      return buildAnalogModel();
    case 'digital':
      return buildDigitalModel();
    case 'hybrid':
      return buildHybridModel();
    case 'supercomputer':
      return buildSupercomputerModel();
    case 'mainframe':
      return buildMainframeModel();
    case 'minicomputer':
      return buildMinicomputerModel();
    case 'desktop':
      return buildDesktopModel();
    case 'laptop':
      return buildLaptopModel();
    case 'smartphone':
      return buildSmartphoneModel();
  }
}
