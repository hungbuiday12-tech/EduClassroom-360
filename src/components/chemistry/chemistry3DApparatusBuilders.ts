import * as THREE from 'three';
import { ChemApparatusItem, ChemApparatusReading } from '../../data/chemistryApparatusData';

export interface ChemApparatus3DInstance {
  group: THREE.Group;
  updateLive: (reading: ChemApparatusReading, t: number, customValue?: number) => void;
  dispose: () => void;
}

function makeChemLcdTexture(
  bgHex: string,
  textHex: string,
  title: string,
  value: string,
  subLabel: string
): { texture: THREE.CanvasTexture; redraw: (v: string, sub: string) => void } {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  let lastKey = '';
  const redraw = (v: string, sub: string) => {
    const key = `${v}|${sub}`;
    if (key === lastKey) return;
    lastKey = key;

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 120);

    ctx.fillStyle = textHex;
    ctx.globalAlpha = 0.78;
    ctx.font = 'bold 17px monospace';
    ctx.fillText(title.slice(0, 18), 14, 28);

    ctx.globalAlpha = 1;
    ctx.font = 'bold 34px monospace';
    ctx.fillText(v.slice(0, 12), 14, 76);

    ctx.globalAlpha = 0.85;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(sub.slice(0, 22), 14, 108);
    texture.needsUpdate = true;
  };

  redraw(value, subLabel);
  return { texture, redraw };
}

function borosilicateGlass(opacity = 0.34, tint = 0xdbeafe) {
  return new THREE.MeshPhysicalMaterial({
    color: tint,
    transparent: true,
    opacity,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false
  });
}

export function createChem3DApparatusModel(
  toolId: string,
  spec: ChemApparatusItem
): ChemApparatus3DInstance {
  const group = new THREE.Group();
  group.name = `chem_apparatus_${toolId}`;

  const disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[]; textures: THREE.Texture[] } = {
    geometries: [],
    materials: [],
    textures: []
  };

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposables.geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposables.materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    disposables.textures.push(t);
    return t;
  };

  const glass = trackMat(borosilicateGlass(0.32));
  const steelMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.22 }));
  const darkBaseMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.4, roughness: 0.45 }));
  const ptfeMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.28 }));

  let updateHook: ((reading: ChemApparatusReading, t: number, customValue?: number) => void) | null = null;

  // 1. DIGITAL LCD METERS (pH Meter, Analytical Balance, Conductivity Probe, Galvanic Voltmeter, Colorimeter)
  if (
    toolId === 'ph_meter_digital' ||
    toolId === 'balance_analytical' ||
    toolId === 'conductivity_probe' ||
    toolId === 'voltmeter_galvanic' ||
    toolId === 'colorimeter_uv'
  ) {
    const casingColors: Record<string, number> = {
      ph_meter_digital: 0x0f766e,
      balance_analytical: 0x334155,
      conductivity_probe: 0x0369a1,
      voltmeter_galvanic: 0x4c1d95,
      colorimeter_uv: 0x1e293b
    };
    const lcdColors: Record<string, [string, string]> = {
      ph_meter_digital: ['#064e3b', '#6ee7b7'],
      balance_analytical: ['#0f172a', '#38bdf8'],
      conductivity_probe: ['#082f49', '#7dd3fc'],
      voltmeter_galvanic: ['#1e1b4b', '#e9d5ff'],
      colorimeter_uv: ['#1c1917', '#fde047']
    };
    const [bgHex, txtHex] = lcdColors[toolId] || ['#0f172a', '#34d399'];

    if (toolId === 'balance_analytical') {
      const base = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.5, 0.24, 1.55)), darkBaseMat);
      base.position.y = 0.12;
      group.add(base);

      const pan = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 0.06, 28)), steelMat);
      pan.position.set(0, 0.28, -0.1);
      group.add(pan);

      const shield = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(1.18, 0.72, 1.08)),
        trackMat(borosilicateGlass(0.18))
      );
      shield.position.set(0, 0.62, -0.1);
      group.add(shield);

      const lcd = makeChemLcdTexture(bgHex, txtHex, 'ANALYTICAL 0.001g', '4.820 g', 'Tare Ready');
      trackTex(lcd.texture);
      const screen = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(0.95, 0.28)),
        trackMat(new THREE.MeshBasicMaterial({ map: lcd.texture }))
      );
      screen.position.set(0, 0.17, 0.785);
      screen.rotation.x = -0.35;
      group.add(screen);
      updateHook = (r) => lcd.redraw(r.valueText, r.subLabel);
    } else {
      const bodyMat = trackMat(
        new THREE.MeshStandardMaterial({ color: casingColors[toolId] || 0x1e293b, roughness: 0.35, metalness: 0.25 })
      );
      const body = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.15, 0.55, 0.95)), bodyMat);
      body.position.y = 0.28;
      group.add(body);

      const lcd = makeChemLcdTexture(bgHex, txtHex, spec.enName, spec.symbol, spec.unit);
      trackTex(lcd.texture);
      const screen = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(0.92, 0.42)),
        trackMat(new THREE.MeshBasicMaterial({ map: lcd.texture }))
      );
      screen.position.set(0, 0.56, 0.12);
      screen.rotation.x = -Math.PI / 2.6;
      group.add(screen);

      if (toolId === 'ph_meter_digital' || toolId === 'conductivity_probe') {
        const probeArm = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 10)), steelMat);
        probeArm.position.set(0.68, 0.55, 0);
        probeArm.rotation.z = -0.3;
        group.add(probeArm);
        const bulb = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.08, 12, 12)),
          trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45 }))
        );
        bulb.position.set(0.84, 0.08, 0);
        group.add(bulb);
      } else if (toolId === 'colorimeter_uv') {
        const cuvette = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.24, 0.45, 0.24)),
          trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 }))
        );
        cuvette.position.set(0.32, 0.68, -0.22);
        group.add(cuvette);
      }
      updateHook = (r) => lcd.redraw(r.valueText, r.subLabel);
    }
  }

  // 2. BOROSILICATE GLASSWARE (Erlenmeyer, Beaker, Volumetric Flask, Separatory Funnel, Pipette)
  else if (
    toolId === 'erlenmeyer_flask' ||
    toolId === 'beaker_250ml' ||
    toolId === 'volumetric_flask' ||
    toolId === 'separatory_funnel' ||
    toolId === 'pipette_10ml'
  ) {
    const fluidMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.68,
        roughness: 0.15,
        clearcoat: 0.9
      })
    );

    if (toolId === 'erlenmeyer_flask') {
      const pts = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.56, 0.0),
        new THREE.Vector2(0.58, 0.14),
        new THREE.Vector2(0.18, 1.05),
        new THREE.Vector2(0.18, 1.45),
        new THREE.Vector2(0.23, 1.52)
      ];
      const flaskMesh = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(pts, 28)), glass);
      group.add(flaskMesh);

      const liquid = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.51, 0.52, 24)), fluidMat);
      liquid.position.y = 0.28;
      group.add(liquid);
      updateHook = (r) => {
        if (r.fluidHex) fluidMat.color.set(r.fluidHex);
        const sY = Math.max(0.35, Math.min(1.25, (r.fillRatio ?? 0.55) * 1.4));
        liquid.scale.set(1, sY, 1);
      };
    } else if (toolId === 'beaker_250ml') {
      const beaker = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.5, 0.48, 1.25, 28, 1, true)),
        glass
      );
      beaker.position.y = 0.64;
      group.add(beaker);
      const base = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 28)), glass);
      base.position.y = 0.02;
      group.add(base);
      const liquid = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.65, 24)), fluidMat);
      liquid.position.y = 0.36;
      group.add(liquid);
      updateHook = (r) => {
        if (r.fluidHex) fluidMat.color.set(r.fluidHex);
      };
    } else if (toolId === 'volumetric_flask') {
      const bulb = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.52, 24, 20)), glass);
      bulb.position.y = 0.46;
      group.add(bulb);
      const neck = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.1, 0.12, 1.05, 16)), glass);
      neck.position.y = 1.32;
      group.add(neck);
      const markRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.115, 0.015, 8, 24)),
        trackMat(new THREE.MeshBasicMaterial({ color: 0xf8fafc }))
      );
      markRing.rotation.x = Math.PI / 2;
      markRing.position.y = 1.45;
      group.add(markRing);
      const liq = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.46, 20, 16)), fluidMat);
      liq.position.y = 0.44;
      group.add(liq);
      updateHook = (r) => {
        if (r.fluidHex) fluidMat.color.set(r.fluidHex);
      };
    } else if (toolId === 'separatory_funnel') {
      const standBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.95, 0.08, 0.75)), darkBaseMat);
      standBase.position.y = 0.04;
      group.add(standBase);
      const rod = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.35, 10)), steelMat);
      rod.position.set(-0.35, 1.2, -0.2);
      group.add(rod);
      const cone = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.46, 1.05, 24)), glass);
      cone.rotation.x = Math.PI;
      cone.position.set(0.05, 1.48, 0);
      group.add(cone);
      const topLayer = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.36, 0.25, 0.34, 20)),
        trackMat(new THREE.MeshStandardMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.75 }))
      );
      topLayer.position.set(0.05, 1.66, 0);
      group.add(topLayer);
      const botLayer = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.24, 0.45, 20)), fluidMat);
      botLayer.rotation.x = Math.PI;
      botLayer.position.set(0.05, 1.26, 0);
      group.add(botLayer);
      const cock = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 12)), ptfeMat);
      cock.rotation.z = Math.PI / 2;
      cock.position.set(0.05, 0.92, 0);
      group.add(cock);
    } else {
      // Pipette
      const tube = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.05, 0.03, 1.9, 14)), glass);
      tube.position.y = 1.0;
      tube.rotation.z = 0.22;
      group.add(tube);
      const bulb = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.14, 14, 14)), glass);
      bulb.scale.set(0.85, 1.6, 0.85);
      bulb.position.set(-0.02, 1.05, 0);
      bulb.rotation.z = 0.22;
      group.add(bulb);
    }
  }

  // 3. BURETTE ON STAND
  else if (toolId === 'burette_50ml') {
    const base = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.05, 0.1, 0.8)), darkBaseMat);
    base.position.y = 0.05;
    group.add(base);
    const pole = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 12)), steelMat);
    pole.position.set(-0.38, 1.35, -0.15);
    group.add(pole);
    const clamp = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.45, 0.06, 0.08)), steelMat);
    clamp.position.set(-0.15, 1.85, -0.05);
    group.add(clamp);
    const burette = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.09, 0.08, 1.95, 16)), glass);
    burette.position.set(0.08, 1.62, 0);
    group.add(burette);
    const liqMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }));
    const liq = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.072, 0.072, 1.4, 14)), liqMat);
    liq.position.set(0.08, 1.48, 0);
    group.add(liq);
    const stopcock = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 10)), ptfeMat);
    stopcock.rotation.z = Math.PI / 2;
    stopcock.position.set(0.08, 0.68, 0);
    group.add(stopcock);
    updateHook = (r) => {
      const ratio = Math.max(0.15, Math.min(1, r.fillRatio ?? 0.65));
      liq.scale.set(1, ratio, 1);
      liq.position.y = 0.78 + ratio * 0.7;
    };
  }

  // 4. MAGNETIC HOTPLATE & STIR BAR
  else if (toolId === 'magnetic_hotplate') {
    const body = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.45, 0.34, 1.45)), darkBaseMat);
    body.position.y = 0.17;
    group.add(body);
    const plateMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.25,
        emissive: 0xef4444,
        emissiveIntensity: 0.18
      })
    );
    const plate = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 28)), plateMat);
    plate.position.set(0, 0.37, -0.08);
    group.add(plate);
    const stirBar = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.05, 0.28, 6, 10)), ptfeMat);
    stirBar.rotation.z = Math.PI / 2;
    stirBar.position.set(0, 0.45, -0.08);
    group.add(stirBar);
    updateHook = (r, t) => {
      stirBar.rotation.y = t * 14;
      const heatGlow = Math.max(0.05, Math.min(0.85, ((r.tempC ?? 40) - 25) / 140));
      plateMat.emissiveIntensity = heatGlow;
    };
  }

  // 5. BUNSEN BURNER WITH ANIMATED FLAME
  else if (toolId === 'bunsen_burner') {
    const base = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.45, 0.52, 0.12, 24)), darkBaseMat);
    base.position.y = 0.06;
    group.add(base);
    const barrel = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.1, 0.12, 1.05, 18)), steelMat);
    barrel.position.y = 0.62;
    group.add(barrel);
    const outerFlameMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending })
    );
    const outerFlame = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.16, 0.65, 16)), outerFlameMat);
    outerFlame.position.y = 1.42;
    group.add(outerFlame);
    const innerFlame = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.08, 0.36, 14)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }))
    );
    innerFlame.position.y = 1.3;
    group.add(innerFlame);
    updateHook = (r, t) => {
      const f = (r.flameIntensity ?? 0.9) + Math.sin(t * 18) * 0.08;
      outerFlame.scale.set(1, f, 1);
      innerFlame.scale.set(1, f * 0.95, 1);
    };
  }

  // 6. LIEBIG REFLUX CONDENSER
  else if (toolId === 'reflux_condenser') {
    const stand = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 0.08, 0.8)), darkBaseMat);
    stand.position.y = 0.04;
    group.add(stand);
    const jacket = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 1.95, 22)), glass);
    jacket.position.set(0, 1.25, 0);
    jacket.rotation.z = -0.35;
    group.add(jacket);
    const innerTube = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 2.25, 16)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 }))
    );
    innerTube.position.set(0, 1.25, 0);
    innerTube.rotation.z = -0.35;
    group.add(innerTube);
  }

  // 7. GAS SYRINGE
  else if (toolId === 'gas_syringe_100ml') {
    const stand = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.3, 0.14, 0.65)), darkBaseMat);
    stand.position.y = 0.07;
    group.add(stand);
    const barrel = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 1.6, 22)), glass);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(-0.1, 0.45, 0);
    group.add(barrel);
    const plunger = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 18)), ptfeMat);
    plunger.rotation.z = Math.PI / 2;
    plunger.position.set(0.35, 0.45, 0);
    group.add(plunger);
    updateHook = (r) => {
      const ratio = Math.max(0.05, Math.min(1, r.fillRatio ?? 0.4));
      plunger.position.x = 0.08 + ratio * 0.72;
    };
  }

  // 8. LAB THERMOMETER
  else {
    const stem = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.95, 14)), glass);
    stem.position.y = 1.05;
    group.add(stem);
    const bulb = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.13, 16, 16)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 }))
    );
    bulb.position.y = 0.15;
    group.add(bulb);
    const col = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 10)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444 }))
    );
    col.position.y = 0.9;
    group.add(col);
    updateHook = (r) => {
      const ratio = Math.max(0.15, Math.min(1.0, ((r.tempC ?? 25) + 10) / 140));
      col.scale.set(1, ratio, 1);
      col.position.y = 0.18 + ratio * 0.72;
    };
  }

  return {
    group,
    updateLive: (reading, t, customValue) => {
      updateHook?.(reading, t, customValue);
    },
    dispose: () => {
      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((t) => t.dispose());
    }
  };
}
