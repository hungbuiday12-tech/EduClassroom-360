import * as THREE from 'three';
import { ApparatusLiveReading, PhysicsApparatusItem } from '../../data/physicsApparatusData';

export interface Apparatus3DInstance {
  group: THREE.Group;
  updateLive: (reading: ApparatusLiveReading, simTime: number, extraVal?: number) => void;
  dispose: () => void;
}

function parseLeadingNumber(text: string): number {
  const m = text.replace(/,/g, '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function wavelengthNmToHex(nm: number): number {
  if (nm < 440) return 0x8b5cf6;
  if (nm < 495) return 0x3b82f6;
  if (nm < 570) return 0x22c55e;
  if (nm < 605) return 0xf59e0b;
  return 0xef4444;
}

function createCanvasTex(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
): { texture: THREE.CanvasTexture | null; redraw: (fn: (ctx: CanvasRenderingContext2D, width: number, height: number) => void) => void } {
  if (typeof document === 'undefined') {
    return { texture: null, redraw: () => {} };
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return {
    texture,
    redraw: (fn) => {
      if (!ctx) return;
      fn(ctx, w, h);
      texture.needsUpdate = true;
    }
  };
}

function createHelixCurve(radius: number, height: number, turns: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const totalSteps = turns * 14;
  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps;
    const ang = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(ang) * radius, t * height, Math.sin(ang) * radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function disposeGroupResources(group: THREE.Group) {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const mat = mesh.material;
    const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
    for (const m of mats) {
      const anyMat = m as THREE.MeshStandardMaterial;
      if (anyMat.map) anyMat.map.dispose();
      m.dispose();
    }
  });
}

function buildDialTexture(symbol: string, unit: string, accentHex: string) {
  return createCanvasTex(256, 192, (ctx, w, h) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    const cx = w / 2;
    const cy = h * 0.72;
    const r = 74;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * (1.15 + (i / 10) * 0.7);
      const rIn = i % 2 === 0 ? r - 12 : r - 7;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = i >= 8 ? '#dc2626' : '#1e293b';
      ctx.lineWidth = i % 2 === 0 ? 2.8 : 1.5;
      ctx.stroke();
    }

    ctx.fillStyle = accentHex;
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(symbol, cx, 42);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(unit, cx, h - 18);
  });
}

export function create3DApparatusModel(
  toolId: string,
  spec: PhysicsApparatusItem
): Apparatus3DInstance {
  const group = new THREE.Group();
  group.name = `apparatus_${toolId}`;
  const accentColor = new THREE.Color(spec.accentHex);

  const metalDarkMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.42,
    metalness: 0.55
  });
  const metalChromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    roughness: 0.16,
    metalness: 0.88,
    clearcoat: 0.7
  });
  const brassMat = new THREE.MeshPhysicalMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.86,
    clearcoat: 0.6
  });
  const copperMat = new THREE.MeshPhysicalMaterial({
    color: 0xea580c,
    roughness: 0.2,
    metalness: 0.88,
    clearcoat: 0.65
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    roughness: 0.06,
    metalness: 0.05,
    transparent: true,
    opacity: 0.34,
    clearcoat: 1.0
  });
  const redTermMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35, metalness: 0.25 });
  const blkTermMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.25 });

  let updateLive: Apparatus3DInstance['updateLive'] = () => {};

  // -------------------------------------------------------------------------
  // 1. ANALOG / DIGITAL BENCH METERS & PROBE SENSORS
  // -------------------------------------------------------------------------
  if (
    toolId === 'ammeter_dc_ac' ||
    toolId === 'voltmeter_dc_ac' ||
    toolId === 'multimeter_pro' ||
    toolId === 'lux_photometer' ||
    toolId === 'decibel_meter' ||
    toolId === 'gaussmeter_hall' ||
    toolId === 'geiger_counter'
  ) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.2, 0.72), metalDarkMat);
    base.position.y = 0.1;

    const tiltedBody = new THREE.Group();
    tiltedBody.position.set(0, 0.42, -0.02);
    tiltedBody.rotation.x = -0.38;

    const housing = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.72, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.35 })
    );
    tiltedBody.add(housing);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.52, 0.06),
      new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35, metalness: 0.4 })
    );
    bezel.position.set(0, 0.06, 0.21);
    tiltedBody.add(bezel);

    const dialTex = buildDialTexture(spec.symbol, spec.unit, spec.accentHex);
    const dialPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.44),
      new THREE.MeshStandardMaterial({
        ...(dialTex.texture ? { map: dialTex.texture } : {}),
        color: dialTex.texture ? 0xffffff : 0xf1f5f9,
        roughness: 0.35
      })
    );
    dialPlate.position.set(0, 0.06, 0.245);
    tiltedBody.add(dialPlate);

    // Live analog needle pivot
    const needlePivot = new THREE.Group();
    needlePivot.position.set(0, -0.05, 0.255);
    const needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.26, 0.014),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x7f1d1d, emissiveIntensity: 0.35 })
    );
    needle.position.y = 0.12;
    needlePivot.add(needle);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.02, 16), brassMat);
    cap.rotation.x = Math.PI / 2;
    needlePivot.add(cap);
    tiltedBody.add(needlePivot);

    // Glass window over meter face
    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.46), glassMat);
    windowGlass.position.set(0, 0.06, 0.268);
    tiltedBody.add(windowGlass);

    // Binding posts (+ / -)
    [-0.24, 0.24].forEach((px, idx) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.12, 14),
        idx === 0 ? redTermMat : blkTermMat
      );
      post.rotation.x = Math.PI / 2;
      post.position.set(px, -0.26, 0.24);
      tiltedBody.add(post);
    });

    // Optional sensor wand for Hall / Geiger / Lux
    if (toolId === 'gaussmeter_hall' || toolId === 'geiger_counter' || toolId === 'lux_photometer') {
      const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.72, 14), metalChromeMat);
      wand.rotation.z = Math.PI / 2;
      wand.position.set(0.68, 0.18, 0.15);
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.14, 14),
        new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.4 })
      );
      tip.rotation.z = Math.PI / 2;
      tip.position.set(1.06, 0.18, 0.15);
      group.add(wand, tip);
    }

    group.add(base, tiltedBody);

    updateLive = (reading) => {
      const num = parseLeadingNumber(reading.valueText);
      const norm = Math.max(0, Math.min(1, Math.abs(num) / (toolId === 'decibel_meter' ? 120 : toolId === 'geiger_counter' ? 1000 : 25)));
      needlePivot.rotation.z = (0.5 - norm) * 1.35;
    };
  }

  // -------------------------------------------------------------------------
  // 2. CATHODE-RAY OSCILLOSCOPE (CRO)
  // -------------------------------------------------------------------------
  else if (toolId === 'oscilloscope_cro') {
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.82, 1.15), metalDarkMat);
    chassis.position.y = 0.44;
    const footMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    [
      [-0.55, -0.45],
      [0.55, -0.45],
      [-0.55, 0.45],
      [0.55, 0.45]
    ].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.06, 12), footMat);
      foot.position.set(fx, 0.03, fz);
      group.add(foot);
    });

    // Top handle
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.38, 0.85, 0),
      new THREE.Vector3(-0.34, 1.0, 0),
      new THREE.Vector3(0.34, 1.0, 0),
      new THREE.Vector3(0.38, 0.85, 0)
    ]);
    const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 20, 0.028, 10, false), metalChromeMat);

    // Phosphor Screen CanvasTexture
    const crtTex = createCanvasTex(256, 160, (ctx, w, h) => {
      ctx.fillStyle = '#022c22';
      ctx.fillRect(0, 0, w, h);
    });
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.54),
      new THREE.MeshBasicMaterial({
        ...(crtTex.texture ? { map: crtTex.texture } : {}),
        color: crtTex.texture ? 0xffffff : 0x10b981
      })
    );
    screen.position.set(-0.22, 0.48, 0.585);

    const crtBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.6, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    crtBezel.position.set(-0.22, 0.48, 0.568);

    // 4 Rotary Control Knobs + BNC Connector
    [0.24, 0.46].forEach((kx) => {
      [0.62, 0.42].forEach((ky) => {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.08, 16), metalChromeMat);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(kx, ky, 0.59);
        group.add(knob);
      });
    });
    const bnc = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.09, 14), brassMat);
    bnc.rotation.x = Math.PI / 2;
    bnc.position.set(0.35, 0.22, 0.59);

    group.add(chassis, handle, crtBezel, screen, bnc);

    let lastRedraw = -1;
    updateLive = (reading, simTime) => {
      if (Math.abs(simTime - lastRedraw) < 0.06 && lastRedraw >= 0) return;
      lastRedraw = simTime;
      const freq = reading.waveFreq ?? 2.2;
      const amp = reading.waveAmp ?? 0.7;
      crtTex.redraw((ctx, w, h) => {
        ctx.fillStyle = '#022c22';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 1;
        for (let gx = 0; gx <= w; gx += 32) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = 0; gy <= h; gy += 32) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
        ctx.beginPath();
        for (let px = 0; px < w; px += 3) {
          const y = h / 2 - Math.sin((px / w) * Math.PI * 2 * freq - simTime * 5.5) * (h * 0.36 * Math.min(1, amp));
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    };
  }

  // -------------------------------------------------------------------------
  // 3. SPRING DYNAMOMETER / COIL SPRING / HANGING MASS / PENDULUM BOB
  // -------------------------------------------------------------------------
  else if (
    toolId === 'dynamometer_spring' ||
    toolId === 'coil_spring_ref' ||
    toolId === 'mass_set' ||
    toolId === 'pendulum_bob_kit'
  ) {
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 0.6), metalDarkMat);
    standBase.position.y = 0.04;
    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.85, 14), metalChromeMat);
    standPole.position.set(-0.24, 0.96, 0);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 12), metalChromeMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(-0.04, 1.84, 0);

    // Helical Spring
    const springGeo = new THREE.TubeGeometry(createHelixCurve(0.11, 0.62, 7), 72, 0.02, 8, false);
    const springMesh = new THREE.Mesh(springGeo, metalChromeMat);
    springMesh.position.set(0.15, 1.8, 0);

    // Translucent Scale Barrel (for dynamometer)
    if (toolId === 'dynamometer_spring') {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.85, 20), glassMat);
      tube.position.set(0.15, 1.38, 0);
      const topCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.17, 0.08, 20),
        new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35 })
      );
      topCap.position.set(0.15, 1.82, 0);
      group.add(tube, topCap);
    }

    // Hanging Brass Load / Bob
    const loadGroup = new THREE.Group();
    loadGroup.position.set(0.15, 1.15, 0);
    if (toolId === 'pendulum_bob_kit') {
      const bob = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 20), brassMat);
      loadGroup.add(bob);
    } else {
      const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.24, 24), brassMat);
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 10, 20, Math.PI * 1.4), metalChromeMat);
      hook.position.y = 0.16;
      loadGroup.add(weight, hook);
    }

    group.add(standBase, standPole, arm, springMesh, loadGroup);

    updateLive = (reading, simTime, extraVal) => {
      const force = Math.max(0.5, parseLeadingNumber(reading.valueText) || (extraVal ? extraVal / 100 : 2));
      const stretch = Math.min(1.45, Math.max(0.75, 0.85 + (force / 20) * 0.4 + Math.sin(simTime * 3.5) * 0.06));
      springMesh.scale.y = stretch;
      springMesh.position.y = 1.8 - 0.62 * stretch;
      loadGroup.position.y = 1.8 - 0.62 * stretch - 0.14;
      if (toolId === 'pendulum_bob_kit') {
        loadGroup.position.x = 0.15 + Math.sin(simTime * 2.4) * 0.22;
      }
    };
  }

  // -------------------------------------------------------------------------
  // 4. ANALYTICAL BALANCE
  // -------------------------------------------------------------------------
  else if (toolId === 'analytical_balance') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.26, 0.95), metalDarkMat);
    body.position.y = 0.13;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.14, 18), metalChromeMat);
    stem.position.set(0, 0.31, -0.08);
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.04, 32), metalChromeMat);
    pan.position.set(0, 0.39, -0.08);

    const lcdTex = createCanvasTex(256, 80, (ctx, w, h) => {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 34px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('1.00 kg', w - 16, 52);
    });
    const lcd = new THREE.Mesh(
      new THREE.PlaneGeometry(0.64, 0.18),
      new THREE.MeshBasicMaterial({ ...(lcdTex.texture ? { map: lcdTex.texture } : {}), color: 0xffffff })
    );
    lcd.position.set(0, 0.18, 0.478);
    lcd.rotation.x = -0.28;
    group.add(body, stem, pan, lcd);

    let lastVal = '';
    updateLive = (reading) => {
      if (reading.valueText === lastVal) return;
      lastVal = reading.valueText;
      lcdTex.redraw((ctx, w, h) => {
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(reading.valueText.slice(0, 12), w - 16, 52);
      });
    };
  }

  // -------------------------------------------------------------------------
  // 5. THERMOMETER & CALORIMETER CUP
  // -------------------------------------------------------------------------
  else if (toolId === 'thermometer_probe') {
    const scalePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 1.55, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 })
    );
    scalePlate.position.y = 0.82;
    const glassStem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.38, 16), glassMat);
    glassStem.position.set(0, 0.85, 0.055);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 18),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.45, roughness: 0.18 })
    );
    bulb.position.set(0, 0.16, 0.055);
    const mercuryMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4
    });
    const mercuryCol = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.0, 12), mercuryMat);
    mercuryCol.position.set(0, 0.72, 0.055);
    const standFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 24), metalDarkMat);
    standFoot.position.y = 0.04;
    group.add(standFoot, scalePlate, glassStem, bulb, mercuryCol);

    updateLive = (reading) => {
      const temp = parseLeadingNumber(reading.valueText);
      const frac = Math.max(0.12, Math.min(1.0, (temp + 20) / 350));
      mercuryCol.scale.y = frac;
      mercuryCol.position.y = 0.22 + frac * 0.52;
    };
  } else if (toolId === 'calorimeter_cup') {
    const outerCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.46, 0.88, 32),
      new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.78, roughness: 0.22, clearcoat: 0.7 })
    );
    outerCup.position.y = 0.44;
    const innerRim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 12, 32), copperMat);
    innerRim.rotation.x = Math.PI / 2;
    innerRim.position.y = 0.89;
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.08, 32), metalDarkMat);
    lid.position.y = 0.91;
    const stirrer = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.52, 12), brassMat);
    stirrer.position.set(0.16, 1.15, 0);
    const ringHandle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.015, 10, 20), brassMat);
    ringHandle.position.set(0.16, 1.44, 0);
    group.add(outerCup, innerRim, lid, stirrer, ringHandle);

    updateLive = (_r, simTime) => {
      stirrer.position.y = 1.12 + Math.sin(simTime * 3.0) * 0.08;
      ringHandle.position.y = stirrer.position.y + 0.29;
    };
  }

  // -------------------------------------------------------------------------
  // 6. BOURDON PRESSURE MANOMETER
  // -------------------------------------------------------------------------
  else if (toolId === 'pressure_manometer') {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.1, 24), metalDarkMat);
    stand.position.y = 0.05;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.34, 16), brassMat);
    neck.position.y = 0.24;
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.18, 32), metalChromeMat);
    drum.rotation.x = Math.PI / 2;
    drum.position.y = 0.78;

    const dialTex = buildDialTexture('atm', 'p', spec.accentHex);
    const dialFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.38, 32),
      new THREE.MeshStandardMaterial({ ...(dialTex.texture ? { map: dialTex.texture } : {}), color: 0xffffff, roughness: 0.3 })
    );
    dialFace.position.set(0, 0.78, 0.095);

    const needlePivot = new THREE.Group();
    needlePivot.position.set(0, 0.72, 0.105);
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.28, 0.014), redTermMat);
    needle.position.y = 0.11;
    needlePivot.add(needle);

    const glassCover = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), glassMat);
    glassCover.position.set(0, 0.78, 0.12);
    group.add(stand, neck, drum, dialFace, needlePivot, glassCover);

    updateLive = (reading) => {
      const pVal = parseLeadingNumber(reading.valueText);
      const norm = Math.max(0, Math.min(1, pVal / 6));
      needlePivot.rotation.z = (0.5 - norm) * 2.1;
    };
  }

  // -------------------------------------------------------------------------
  // 7. OPTICS: LASER, LENS, MIRROR, PRISM
  // -------------------------------------------------------------------------
  else if (toolId === 'laser_pointer_rgb') {
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.46), metalDarkMat);
    saddle.position.y = 0.05;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.56, 16), metalChromeMat);
    post.position.y = 0.35;
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.78, 24), metalDarkMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.68, 0);
    const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 20), brassMat);
    muzzle.rotation.z = Math.PI / 2;
    muzzle.position.set(0.43, 0.68, 0);

    const beamMat = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.75 });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.2, 12), beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(1.56, 0.68, 0);
    group.add(saddle, post, barrel, muzzle, beam);

    updateLive = (reading) => {
      const nm = parseLeadingNumber(reading.valueText) || 550;
      beamMat.color.setHex(wavelengthNmToHex(nm));
    };
  } else if (toolId === 'convex_concave_lens') {
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), metalDarkMat);
    saddle.position.y = 0.05;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.42, 14), metalChromeMat);
    post.position.y = 0.28;
    const frameRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 14, 36), brassMat);
    frameRing.rotation.y = Math.PI / 2;
    frameRing.position.y = 0.94;
    const lensDisc = new THREE.Mesh(new THREE.SphereGeometry(0.47, 28, 20), glassMat);
    lensDisc.scale.set(0.24, 1, 1);
    lensDisc.position.y = 0.94;
    group.add(saddle, post, frameRing, lensDisc);
  } else if (toolId === 'optical_mirror') {
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), metalDarkMat);
    saddle.position.y = 0.05;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.4, 14), metalChromeMat);
    post.position.y = 0.26;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.96, 0.72), metalDarkMat);
    frame.position.y = 0.9;
    const mirrorSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.88),
      new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.04, clearcoat: 1.0 })
    );
    mirrorSurface.rotation.y = Math.PI / 2;
    mirrorSurface.position.set(0.044, 0.9, 0);
    group.add(saddle, post, frame, mirrorSurface);
  } else if (toolId === 'glass_prism_block') {
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.1, 32), metalDarkMat);
    pedestal.position.y = 0.05;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.24, 16), metalChromeMat);
    stem.position.y = 0.22;
    const tablePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 32), brassMat);
    tablePlate.position.y = 0.36;
    const shape = new THREE.Shape();
    const r = 0.38;
    shape.moveTo(0, r);
    shape.lineTo(-r * 0.866, -r * 0.5);
    shape.lineTo(r * 0.866, -r * 0.5);
    shape.closePath();
    const prismGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.68, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
    prismGeo.center();
    const prism = new THREE.Mesh(
      prismGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0xc4b5fd,
        transparent: true,
        opacity: 0.52,
        roughness: 0.05,
        metalness: 0.05,
        clearcoat: 1.0
      })
    );
    prism.rotation.x = Math.PI / 2;
    prism.position.y = 0.74;
    group.add(pedestal, stem, tablePlate, prism);
  }

  // -------------------------------------------------------------------------
  // 8. MAGNETS, COMPASS, SOLENOID, RHEOSTAT, CAPACITOR, RESISTOR, POWER SUPPLY
  // -------------------------------------------------------------------------
  else if (toolId === 'bar_magnet_ns') {
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 0.42), metalDarkMat);
    cradle.position.y = 0.04;
    const nHalf = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.24, 0.28),
      new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.24, metalness: 0.35, clearcoat: 0.7 })
    );
    nHalf.position.set(-0.3, 0.2, 0);
    const sHalf = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.24, 0.28),
      new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, roughness: 0.24, metalness: 0.35, clearcoat: 0.7 })
    );
    sHalf.position.set(0.3, 0.2, 0);
    group.add(cradle, nHalf, sHalf);
  } else if (toolId === 'magnetic_compass') {
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.14, 32), brassMat);
    bowl.position.y = 0.07;
    const roseTex = createCanvasTex(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 112, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('N', w / 2, 36);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('S', w / 2, h - 18);
    });
    const rose = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 32),
      new THREE.MeshStandardMaterial({ ...(roseTex.texture ? { map: roseTex.texture } : {}), color: 0xffffff })
    );
    rose.rotation.x = -Math.PI / 2;
    rose.position.y = 0.145;

    const needleGroup = new THREE.Group();
    needleGroup.position.y = 0.175;
    const northPtr = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 4), redTermMat);
    northPtr.rotation.x = -Math.PI / 2;
    northPtr.position.z = -0.16;
    const southPtr = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.32, 4),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 })
    );
    southPtr.rotation.x = Math.PI / 2;
    southPtr.position.z = 0.16;
    needleGroup.add(northPtr, southPtr);

    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.02, 32), glassMat);
    glass.position.y = 0.21;
    group.add(bowl, rose, needleGroup, glass);

    updateLive = (reading) => {
      needleGroup.rotation.y = -((reading.needleDeg ?? 0) * Math.PI) / 180;
    };
  } else if (toolId === 'inductor_solenoid') {
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.1, 0.65), metalDarkMat);
    base.position.y = 0.05;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.05, 24), metalChromeMat);
    core.rotation.z = Math.PI / 2;
    core.position.y = 0.38;
    const coilCurve = createHelixCurve(0.26, 0.98, 9);
    const coil = new THREE.Mesh(new THREE.TubeGeometry(coilCurve, 96, 0.032, 8, false), copperMat);
    coil.rotation.z = -Math.PI / 2;
    coil.position.set(-0.49, 0.38, 0);
    [-0.55, 0.55].forEach((tx, idx) => {
      const term = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 12), idx === 0 ? redTermMat : blkTermMat);
      term.position.set(tx, 0.16, 0.22);
      group.add(term);
    });
    group.add(base, core, coil);
  } else if (toolId === 'rheostat_slider') {
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.44), metalDarkMat);
    legL.position.set(-0.62, 0.21, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.44), metalDarkMat);
    legR.position.set(0.62, 0.21, 0);
    const ceramicDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 1.15, 24),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55 })
    );
    ceramicDrum.rotation.z = Math.PI / 2;
    ceramicDrum.position.y = 0.26;
    const slideRail = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.05, 0.05), metalChromeMat);
    slideRail.position.y = 0.54;
    const wiper = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), blkTermMat);
    wiper.position.set(0, 0.56, 0);
    group.add(legL, legR, ceramicDrum, slideRail, wiper);

    updateLive = (reading) => {
      const rVal = parseLeadingNumber(reading.valueText);
      const frac = Math.max(-0.45, Math.min(0.45, (rVal / 100 - 0.5) * 0.9));
      wiper.position.x = frac;
    };
  } else if (toolId === 'power_supply_unit') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.78, 0.92), metalDarkMat);
    body.position.y = 0.39;
    const faceTex = createCanvasTex(256, 128, (ctx, w, h) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#020617';
      ctx.fillRect(16, 16, 224, 52);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('12.0 V  DC', 28, 52);
    });
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 0.46),
      new THREE.MeshBasicMaterial({ ...(faceTex.texture ? { map: faceTex.texture } : {}), color: 0xffffff })
    );
    face.position.set(0, 0.46, 0.465);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 18), metalChromeMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(-0.34, 0.18, 0.48);
    [0.14, 0.38].forEach((tx, idx) => {
      const term = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 14), idx === 0 ? redTermMat : blkTermMat);
      term.rotation.x = Math.PI / 2;
      term.position.set(tx, 0.18, 0.48);
      group.add(term);
    });
    group.add(body, face, dial);
  } else if (toolId === 'capacitor_bank' || toolId === 'resistor_decade') {
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.1, 0.65),
      new THREE.MeshStandardMaterial({ color: toolId === 'capacitor_bank' ? 0x065f46 : 0x78350f, roughness: 0.55 })
    );
    board.position.y = 0.05;
    [-0.25, 0.25].forEach((cx) => {
      const can = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.52, 24),
        toolId === 'capacitor_bank'
          ? new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, metalness: 0.55, roughness: 0.25 })
          : brassMat
      );
      can.position.set(cx, 0.36, 0);
      group.add(can);
    });
    group.add(board);
  }

  // -------------------------------------------------------------------------
  // 9. MECHANICS & MEASUREMENT: RULER, CALIPER, PROTRACTOR, STOPWATCH, PHOTOGATE, FORK, CART, PULLEY
  // -------------------------------------------------------------------------
  else if (toolId === 'ruler_cm') {
    const rulerTex = createCanvasTex(512, 96, (ctx, w, h) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 40; i++) {
        const x = 16 + (i / 40) * (w - 32);
        const tickH = i % 5 === 0 ? 34 : 18;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tickH);
        ctx.stroke();
      }
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('0     cm     10     20     30', 22, h - 18);
    });
    const stick = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.06, 0.32),
      new THREE.MeshStandardMaterial({
        ...(rulerTex.texture ? { map: rulerTex.texture } : {}),
        color: 0xfde68a,
        roughness: 0.42
      })
    );
    stick.position.y = 0.03;
    const capL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.075, 0.34), brassMat);
    capL.position.set(-1.06, 0.035, 0);
    const capR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.075, 0.34), brassMat);
    capR.position.set(1.06, 0.035, 0);
    const cursor = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.36), glassMat);
    cursor.position.set(0.25, 0.045, 0);
    group.add(stick, capL, capR, cursor);
  } else if (toolId === 'vernier_caliper') {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.18), metalChromeMat);
    beam.position.y = 0.26;
    const fixedJaw = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.18), metalChromeMat);
    fixedJaw.position.set(-0.82, 0.16, 0);
    const slidingJaw = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.2), brassMat);
    slidingJaw.position.set(-0.18, 0.16, 0);
    const vernierSlide = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.09, 0.22), metalDarkMat);
    vernierSlide.position.set(-0.02, 0.26, 0);
    group.add(beam, fixedJaw, slidingJaw, vernierSlide);

    updateLive = (_r, simTime) => {
      const offset = Math.sin(simTime * 0.9) * 0.18;
      slidingJaw.position.x = -0.22 + offset;
      vernierSlide.position.x = -0.06 + offset;
    };
  } else if (toolId === 'protractor_360') {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.06, 10, 48), glassMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.07;
    const crossA = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    crossA.position.y = 0.07;
    const crossB = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 1.24), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    crossB.position.y = 0.07;
    group.add(ring, crossA, crossB);
  } else if (toolId === 'stopwatch_pro') {
    const watchBody = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 32), metalChromeMat);
    watchBody.rotation.x = Math.PI / 2;
    watchBody.position.y = 0.48;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 16), brassMat);
    crown.position.set(0, 0.95, 0);
    const faceTex = buildDialTexture('t', 's', spec.accentHex);
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 32),
      new THREE.MeshStandardMaterial({ ...(faceTex.texture ? { map: faceTex.texture } : {}), color: 0xffffff })
    );
    face.position.set(0, 0.48, 0.085);
    const handPivot = new THREE.Group();
    handPivot.position.set(0, 0.48, 0.095);
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.01), redTermMat);
    hand.position.y = 0.12;
    handPivot.add(hand);
    const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.08, 0.34), metalDarkMat);
    baseFoot.position.y = 0.04;
    group.add(baseFoot, watchBody, crown, face, handPivot);

    updateLive = (_r, simTime) => {
      handPivot.rotation.z = -(simTime * Math.PI) / 30;
    };
  } else if (toolId === 'photogate_timer') {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.42), metalDarkMat);
    foot.position.y = 0.05;
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.14), metalDarkMat);
    armL.position.set(-0.28, 0.52, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.14), metalDarkMat);
    armR.position.set(0.28, 0.52, 0);
    const topBridge = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.16), metalDarkMat);
    topBridge.position.set(0, 0.96, 0);
    const irBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    irBeam.rotation.z = Math.PI / 2;
    irBeam.position.set(0, 0.48, 0);
    group.add(foot, armL, armR, topBridge, irBeam);
  } else if (toolId === 'tuning_fork_ref') {
    const resBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.36, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 })
    );
    resBox.position.y = 0.18;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.24, 12), metalChromeMat);
    stem.position.y = 0.48;
    const forkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 1.25, 0),
      new THREE.Vector3(-0.16, 0.72, 0),
      new THREE.Vector3(0, 0.58, 0),
      new THREE.Vector3(0.16, 0.72, 0),
      new THREE.Vector3(0.16, 1.25, 0)
    ]);
    const fork = new THREE.Mesh(new THREE.TubeGeometry(forkCurve, 36, 0.036, 12, false), metalChromeMat);
    group.add(resBox, stem, fork);

    updateLive = (_r, simTime) => {
      fork.scale.x = 1 + Math.sin(simTime * 28) * 0.04;
    };
  } else if (toolId === 'pulley_wheel') {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 24), metalDarkMat);
    base.position.y = 0.04;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.85, 14), metalChromeMat);
    post.position.y = 0.46;
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 14, 32), brassMat);
    wheel.position.y = 0.92;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16), metalDarkMat);
    hub.rotation.x = Math.PI / 2;
    hub.position.y = 0.92;
    group.add(base, post, wheel, hub);

    updateLive = (_r, simTime) => {
      wheel.rotation.z = -simTime * 2.4;
    };
  } else {
    // Air-track cart & Wave vibrator & fallback procedural assembly
    const rail = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.45), metalDarkMat);
    rail.position.y = 0.04;
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.28, 0.38),
      new THREE.MeshPhysicalMaterial({ color: accentColor, roughness: 0.28, metalness: 0.55, clearcoat: 0.6 })
    );
    body.position.y = 0.22;
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.22), metalChromeMat);
    flag.position.set(0, 0.48, 0);
    group.add(rail, body, flag);

    updateLive = (_r, simTime) => {
      body.position.x = Math.sin(simTime * 1.8) * 0.28;
      flag.position.x = body.position.x;
    };
  }

  return {
    group,
    updateLive,
    dispose: () => disposeGroupResources(group)
  };
}
