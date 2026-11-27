import * as THREE from 'three';

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 256);
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.58)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.22)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createFloorGridTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#091124';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.lineWidth = 2;
  const step = 64;
  for (let i = 0; i <= 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 32; i < 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}

export function createAnalogDialTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#f8f3e6';
  ctx.beginPath();
  ctx.arc(256, 256, 248, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 232, 0, Math.PI * 2);
  ctx.stroke();

  // Gauge ticks
  for (let i = 0; i <= 40; i++) {
    const angle = (-Math.PI * 0.75) + (i / 40) * (Math.PI * 1.5);
    const isMajor = i % 5 === 0;
    const rOut = 212;
    const rIn = isMajor ? 176 : 196;
    ctx.strokeStyle = i >= 32 ? '#dc2626' : '#0f172a';
    ctx.lineWidth = isMajor ? 5 : 2;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(angle - Math.PI / 2) * rIn, 256 + Math.sin(angle - Math.PI / 2) * rIn);
    ctx.lineTo(256 + Math.cos(angle - Math.PI / 2) * rOut, 256 + Math.sin(angle - Math.PI / 2) * rOut);
    ctx.stroke();
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ANALOG VOLTS', 256, 355);
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#b45309';
  ctx.fillText('CONTINUOUS', 256, 390);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createOscilloscopeTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 320);
  ctx.fillStyle = '#031c16';
  ctx.fillRect(0, 0, 512, 320);

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 320);
    ctx.stroke();
  }
  for (let y = 0; y <= 320; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Smooth analog sine wave
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let x = 0; x <= 512; x += 4) {
    const y = 160 + Math.sin((x / 512) * Math.PI * 4) * 78;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#a7f3d0';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('SIGNAL: 12.4V CONTINUOUS', 24, 36);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createScreenTexture(
  title: string,
  subtitle: string,
  accentColor: string,
  mode: 'desktop' | 'laptop' | 'phone' | 'hybrid'
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 320);
  ctx.fillStyle = '#071124';
  ctx.fillRect(0, 0, 512, 320);

  // Subtle top window bar
  ctx.fillStyle = '#0f1c3a';
  ctx.fillRect(0, 0, 512, 38);
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 36, 512, 3);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(title, 18, 25);

  if (mode === 'hybrid') {
    // ECG spike + digital BPM readout
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(20, 175);
    ctx.lineTo(120, 175);
    ctx.lineTo(145, 130);
    ctx.lineTo(165, 235);
    ctx.lineTo(190, 95);
    ctx.lineTo(215, 210);
    ctx.lineTo(240, 175);
    ctx.lineTo(360, 175);
    ctx.stroke();

    ctx.fillStyle = '#0f293a';
    ctx.fillRect(365, 70, 128, 210);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 46px monospace';
    ctx.fillText('76', 392, 145);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('BPM DIGITAL', 376, 175);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('98% SpO2', 385, 225);
  } else if (mode === 'phone') {
    // App icon tiles + wireless banner
    const colors = ['#22d3ee', '#a855f7', '#10b981', '#f59e0b', '#f472b6', '#38bdf8'];
    for (let i = 0; i < 6; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.roundRect(48 + col * 145, 68 + row * 108, 110, 84, 16);
      ctx.fill();
    }
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(subtitle, 48, 296);
  } else {
    // Business / MIS charts on screen
    ctx.fillStyle = '#0c1a36';
    ctx.fillRect(20, 56, 220, 235);
    ctx.fillRect(256, 56, 236, 235);

    const bars = [110, 165, 140, 195];
    bars.forEach((h, idx) => {
      ctx.fillStyle = idx === 3 ? accentColor : '#38bdf8';
      ctx.fillRect(42 + idx * 48, 270 - h, 30, h);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('MIS DASHBOARD', 34, 82);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(subtitle, 272, 92);
    ctx.fillStyle = accentColor;
    ctx.fillRect(272, 118, 190, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(272, 146, 165, 10);
    ctx.fillRect(272, 168, 180, 10);
    ctx.fillRect(272, 190, 140, 10);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPCBTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3;
  for (let i = 32; i < 480; i += 36) {
    ctx.beginPath();
    ctx.moveTo(24, i);
    ctx.lineTo(180, i);
    ctx.lineTo(220, i + 16);
    ctx.lineTo(488, i + 16);
    ctx.stroke();
  }

  ctx.fillStyle = '#fbbf24';
  for (let x = 40; x < 480; x += 64) {
    for (let y = 40; y < 480; y += 64) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
