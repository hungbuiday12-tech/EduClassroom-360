import * as THREE from 'three';

export interface ExplodablePartInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  badgeVi: string;
  badgeEn: string;
  introVi: string;
  introEn: string;
  functionVi: string;
  functionEn: string;
  specFormula?: string;
}

export interface ExplodablePart {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeDir: THREE.Vector3;
  info: ExplodablePartInfo;
}

export interface DynamicModelRef {
  group: THREE.Group;
  explodables: ExplodablePart[];
  waveGeo?: THREE.PlaneGeometry;
  waveBaseZ?: Float32Array;
  atomElectrons?: {
    mesh: THREE.Object3D;
    ringRadius: number;
    tiltEuler: THREE.Euler;
    speed: number;
    phase: number;
  }[];
  sphereCutRing?: THREE.Mesh;
  // Advanced kinetic rig references
  turbofan?: {
    fanGroup: THREE.Group;
    coreGroup: THREE.Group;
    exhaustRing: THREE.Mesh;
    exhaustMat: THREE.MeshStandardMaterial;
  };
  solar?: {
    planets: {
      pivot: THREE.Group;
      mesh: THREE.Mesh;
      speed: number;
      phase: number;
      moonPivot?: THREE.Group;
    }[];
    sunCorona: THREE.Mesh;
  };
  robotArm?: {
    waist: THREE.Group;
    shoulder: THREE.Group;
    elbow: THREE.Group;
    wrist: THREE.Group;
    jawLeft: THREE.Mesh;
    jawRight: THREE.Mesh;
  };
  supercar?: {
    wheels: THREE.Group[];
    streamlines: { mesh: THREE.Mesh; baseX: number; speed: number; phase: number }[];
  };
  windTurbine?: {
    rotor: THREE.Group;
    coilMat: THREE.MeshStandardMaterial;
    waveRing: THREE.Mesh;
  };
  customAnimatedParts?: {
    mesh: THREE.Object3D;
    basePos: THREE.Vector3;
    baseScale: [number, number, number];
    baseRot: [number, number, number];
    anim: {
      type: 'none' | 'spin_y' | 'spin_x' | 'spin_z' | 'pulse' | 'bob_y' | 'orbit_y';
      speed: number;
      amplitude: number;
    };
  }[];
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures?: THREE.Texture[];
  };
}

export interface BuilderMaterials {
  primary: THREE.Material;
  secondary: THREE.Material;
  highlight: THREE.Material;
  edge: THREE.LineBasicMaterial;
  glow: THREE.MeshStandardMaterial;
}

export function buildAdvancedModel(
  kind: 'turbofan' | 'solar_system' | 'robot_arm' | 'supercar_aero' | 'wind_turbine' | 'cable_bridge',
  mats: BuilderMaterials,
  paletteHex: number,
  paletteSecondaryHex: number,
  clipPlane: THREE.Plane,
  softwareGl: boolean
): Omit<DynamicModelRef, 'disposables'> & {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
} {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const addPart = (
    mesh: THREE.Object3D,
    explodeDir: THREE.Vector3,
    info: ExplodablePartInfo,
    addEdges = false,
    attachToGroup = true
  ) => {
    mesh.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = !softwareGl;
        obj.receiveShadow = !softwareGl;
      }
    });
    if (attachToGroup) {
      group.add(mesh);
    }
    explodables.push({
      mesh,
      basePos: mesh.position.clone(),
      explodeDir: explodeDir.clone(),
      info
    });
    if (addEdges && mesh instanceof THREE.Mesh) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 24);
      trackGeo(edges);
      mesh.add(new THREE.LineSegments(edges, mats.edge));
    }
  };

  if (kind === 'turbofan') {
    const centerY = 2.05;

    // 1. Grounded heavy test-stand pylon (grouped base + pylon)
    const pylonStandGroup = new THREE.Group();
    const standBaseGeo = trackGeo(new THREE.BoxGeometry(2.6, 0.22, 1.8));
    const standBase = new THREE.Mesh(standBaseGeo, mats.secondary);
    standBase.position.set(0, 0.11, 0);
    pylonStandGroup.add(standBase);

    const pylonGeo = trackGeo(new THREE.BoxGeometry(0.45, 1.25, 1.1));
    const pylon = new THREE.Mesh(pylonGeo, mats.secondary);
    pylon.position.set(0, 0.85, 0);
    pylonStandGroup.add(pylon);
    addPart(pylonStandGroup, new THREE.Vector3(0, -0.9, 0), {
      id: 'turbofan_pylon',
      nameVi: 'Giá Đỡ & Trụ Thử Nghiệm Lực Đẩy',
      nameEn: 'Test-Stand Thrust Pylon',
      badgeVi: 'KHUNG ĐỠ',
      badgeEn: 'MOUNTING',
      introVi: 'Kết cấu thép chịu lực cao kết nối toàn bộ khối động cơ phản lực với bệ đo lực đẩy mặt đất.',
      introEn: 'Heavy-duty structural pylon anchoring the turbofan assembly to the static thrust test rig.',
      functionVi: 'Truyền tải trọng và lực đẩy dọc trục (lên tới hàng trăm kN) xuống bệ cảm biến lực, giảm rung động cộng hưởng.',
      functionEn: 'Transfers axial thrust loads and structural weight safely while damping high-frequency engine vibration.',
      specFormula: 'F_pylon = ṁ·(V_out − V_in)'
    });

    // 2. Outer metallic nacelle intake lip via LatheGeometry
    const lathePts = [
      new THREE.Vector2(1.18, -1.55),
      new THREE.Vector2(1.42, -1.35),
      new THREE.Vector2(1.52, -0.5),
      new THREE.Vector2(1.48, 0.75),
      new THREE.Vector2(1.22, 1.55),
      new THREE.Vector2(1.06, 1.55),
      new THREE.Vector2(1.24, 0.4),
      new THREE.Vector2(1.22, -0.8),
      new THREE.Vector2(1.12, -1.52),
      new THREE.Vector2(1.18, -1.55)
    ];
    const nacelleGeo = trackGeo(new THREE.LatheGeometry(lathePts, 48));
    nacelleGeo.rotateZ(Math.PI / 2);
    const nacelleMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xcbd5e1,
        metalness: 0.82,
        roughness: 0.24,
        clearcoat: 0.7,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
    const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
    nacelle.position.set(0, centerY, 0);
    addPart(nacelle, new THREE.Vector3(0, 1.8, 0), {
      id: 'turbofan_nacelle',
      nameVi: 'Vỏ Bọc Khí Động Nacelle',
      nameEn: 'Aerodynamic Outer Nacelle',
      badgeVi: 'VỎ NGOÀI',
      badgeEn: 'COWLING',
      introVi: 'Ống vỏ composite-titan tạo hình khí động học bao bọc toàn bộ cụm quạt và lõi động cơ.',
      introEn: 'Aerodynamic composite-titanium cowling housing the front fan and inner compressor core.',
      functionVi: 'Dẫn hướng luồng khí đường vòng (Bypass Air) tạo 75–80% tổng lực đẩy êm ái và giảm tiếng ồn.',
      functionEn: 'Channels high-volume bypass airflow to generate ~80% of total thrust quietly and efficiently.',
      specFormula: 'BPR = ṁ_bypass / ṁ_core ≈ 9:1'
    });

    // 3. Titanium intake lip ring
    const lipGeo = trackGeo(new THREE.TorusGeometry(1.22, 0.08, 16, 48));
    lipGeo.rotateY(Math.PI / 2);
    const lipRing = new THREE.Mesh(lipGeo, mats.highlight);
    lipRing.position.set(-1.52, centerY, 0);
    addPart(lipRing, new THREE.Vector3(-1.85, 0.25, 0), {
      id: 'turbofan_intake',
      nameVi: 'Vành Nạp Khí Hợp Kim Titan',
      nameEn: 'Titanium Intake Lip Ring',
      badgeVi: 'CỬA HÚT',
      badgeEn: 'INTAKE',
      introVi: 'Vành cửa hút phía trước có tiết diện cong chính xác bằng hợp kim Titan chịu nhiệt.',
      introEn: 'Precision-contoured leading-edge intake ring forged from heat-resistant titanium alloy.',
      functionVi: 'Ổn định áp suất dòng khí đi vào quạt, chống đóng băng và ngăn dòng xoáy tách lớp ở góc tấn lớn.',
      functionEn: 'Stabilizes incoming airflow pressure, prevents ice buildup, and avoids boundary-layer separation.',
      specFormula: 'P₀ = P + ½·ρ·v² (Bernoulli)'
    });

    // 4. Main Front Fan Rotor Group (spinner cone + 16 angled titanium blades)
    const fanGroup = new THREE.Group();
    fanGroup.position.set(-1.05, centerY, 0);

    const spinnerGeo = trackGeo(new THREE.ConeGeometry(0.4, 0.75, 28));
    spinnerGeo.rotateZ(Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, mats.glow);
    spinner.position.set(-0.32, 0, 0);
    fanGroup.add(spinner);

    const hubGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 24));
    hubGeo.rotateZ(Math.PI / 2);
    fanGroup.add(new THREE.Mesh(hubGeo, mats.secondary));

    const bladeGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.82, 0.24));
    const bladeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.88,
        roughness: 0.22,
        clippingPlanes: [clipPlane]
      })
    );
    for (let i = 0; i < 16; i++) {
      const ang = (i * Math.PI * 2) / 16;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.x = ang;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0, 0.76, 0);
      blade.rotation.y = 0.45;
      bladePivot.add(blade);
      fanGroup.add(bladePivot);
    }
    addPart(fanGroup, new THREE.Vector3(-1.15, -0.15, 0.85), {
      id: 'turbofan_fan',
      nameVi: 'Cụm Quạt Nén Trước 16 Cánh',
      nameEn: '16-Blade Front Fan Rotor',
      badgeVi: 'ROTOR QUẠT',
      badgeEn: 'FAN STAGE',
      introVi: 'Tầng quạt hút cỡ lớn gồm mũi chóp nón và 16 cánh xoắn khí động học quay tốc độ cao.',
      introEn: 'Large-diameter front rotor assembly with aerodynamic spinner cone and 16 twisted titanium blades.',
      functionVi: 'Hút khối lượng không khí khổng lồ vào động cơ, chia thành luồng bypass đẩy thẳng và luồng vào lõi nén.',
      functionEn: 'Accelerates massive intake air volume, splitting flow into outer bypass thrust and inner core compression.',
      specFormula: 'ω = 2π·RPM / 60 · v_tip ≈ 420 m/s'
    });

    // 5. High-pressure compressor rotor + drive shaft
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0.15, centerY, 0);
    const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 2.2, 24));
    shaftGeo.rotateZ(Math.PI / 2);
    coreGroup.add(new THREE.Mesh(shaftGeo, mats.secondary));

    const stageBladeGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.56, 0.16));
    [-0.55, 0.0, 0.55].forEach((xOff, stIdx) => {
      const count = 12 - stIdx;
      for (let i = 0; i < count; i++) {
        const ang = (i * Math.PI * 2) / count;
        const p = new THREE.Group();
        p.position.x = xOff;
        p.rotation.x = ang;
        const b = new THREE.Mesh(stageBladeGeo, mats.primary);
        b.position.y = 0.52;
        b.rotation.y = -0.4;
        p.add(b);
        coreGroup.add(p);
      }
    });
    addPart(coreGroup, new THREE.Vector3(0.4, 0.15, -0.95), {
      id: 'turbofan_compressor',
      nameVi: 'Lõi Máy Nén Đa Tầng & Trục Truyền',
      nameEn: '3-Stage High-Pressure Compressor',
      badgeVi: 'LÕI NÉN',
      badgeEn: 'CORE',
      introVi: 'Trục trung tâm quay ngược chiều cùng 3 tầng đĩa cánh nén áp suất cao liên tiếp.',
      introEn: 'Counter-rotating central drive shaft coupled with 3 sequential high-pressure compressor stages.',
      functionVi: 'Nén không khí lên áp suất gấp 30–40 lần áp suất khí quyển trước khi đưa vào buồng đốt nhiên liệu.',
      functionEn: 'Compresses core intake air by 30–40× atmospheric pressure prior to fuel injection and combustion.',
      specFormula: 'P₂/P₁ = (T₂/T₁)^(γ/(γ-1))'
    });

    // 6. Glowing Combustion Chamber & Exhaust Nozzle
    const exhaustMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xff5500,
        emissiveIntensity: 1.4,
        roughness: 0.25,
        metalness: 0.4,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane]
      })
    );
    const exhaustConeGeo = trackGeo(new THREE.CylinderGeometry(0.55, 0.85, 0.85, 28, 1, true));
    exhaustConeGeo.rotateZ(Math.PI / 2);
    const exhaustRing = new THREE.Mesh(exhaustConeGeo, exhaustMat);
    exhaustRing.position.set(1.45, centerY, 0);
    addPart(exhaustRing, new THREE.Vector3(1.85, 0.2, 0), {
      id: 'turbofan_exhaust',
      nameVi: 'Buồng Đốt & Vòi Xả Phản Lực',
      nameEn: 'Combustion & Exhaust Nozzle',
      badgeVi: 'BUỒNG ĐỐT',
      badgeEn: 'EXHAUST',
      introVi: 'Cụm vòi hội tụ chịu siêu nhiệt nơi khí nóng giãn nở phun mạnh ra phía sau.',
      introEn: 'Thermal-resistant convergent exhaust nozzle where superheated gas accelerates out the rear.',
      functionVi: 'Đốt cháy hỗn hợp khí nén - nhiên liệu, quay tuabin dẫn động quạt trước và sinh lực đẩy phản lực.',
      functionEn: 'Expands high-temperature combustion gas to drive the turbine shaft and produce high-velocity jet thrust.',
      specFormula: 'T_burn ≈ 1,650 K · Δp = m·Δv'
    });

    return {
      group,
      explodables,
      geometries,
      materials,
      turbofan: { fanGroup, coreGroup, exhaustRing, exhaustMat }
    };
  }

  if (kind === 'solar_system') {
    const centerY = 2.05;

    // 1. Grounded Brass Orrery Base & Central Support Column
    const pedestalGroup = new THREE.Group();
    const baseGeo = trackGeo(new THREE.CylinderGeometry(1.5, 1.8, 0.22, 36));
    const baseMesh = new THREE.Mesh(baseGeo, mats.secondary);
    baseMesh.position.set(0, 0.11, 0);
    pedestalGroup.add(baseMesh);

    const colGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.22, centerY - 0.2, 20));
    const colMesh = new THREE.Mesh(colGeo, mats.secondary);
    colMesh.position.set(0, (centerY - 0.2) * 0.5 + 0.2, 0);
    pedestalGroup.add(colMesh);
    addPart(pedestalGroup, new THREE.Vector3(0, -1.1, 0), {
      id: 'solar_pedestal',
      nameVi: 'Chân Đế & Trụ Mô Hình Thiên Văn',
      nameEn: 'Orrery Brass Base & Pedestal',
      badgeVi: 'TRỤ ĐỠ',
      badgeEn: 'PEDESTAL',
      introVi: 'Khung bệ đồng cơ học đỡ trục trung tâm của hệ mô phỏng quỹ đạo Kepler.',
      introEn: 'Mechanical brass base supporting the central axis of the planetary Keplerian orrery.',
      functionVi: 'Giữ thăng bằng và tạo mốc quy chiếu mặt phẳng hoàng đạo (Ecliptic Plane) cho các quỹ đạo.',
      functionEn: 'Provides a grounded reference plane representing the solar system ecliptic plane.',
      specFormula: 'ω_axis = 0 · Mặt phẳng Hoàng đạo'
    });

    // 2. Glowing Sun & Corona
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, centerY, 0);
    const sunGeo = trackGeo(new THREE.SphereGeometry(0.54, 32, 32));
    const sunMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.65,
        roughness: 0.2,
        clippingPlanes: [clipPlane]
      })
    );
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sun);

    const coronaGeo = trackGeo(new THREE.TorusGeometry(0.68, 0.025, 12, 48));
    coronaGeo.rotateX(Math.PI / 2);
    const sunCorona = new THREE.Mesh(coronaGeo, mats.glow);
    sunGroup.add(sunCorona);
    addPart(sunGroup, new THREE.Vector3(0, -0.45, 0), {
      id: 'solar_sun',
      nameVi: 'Mặt Trời & Vành Nhật Hoa',
      nameEn: 'The Sun & Solar Corona',
      badgeVi: 'NGÔI SAO',
      badgeEn: 'STAR CORE',
      introVi: 'Ngôi sao trung tâm chiếm tới 99,86% tổng khối lượng toàn Hệ Mặt Trời.',
      introEn: 'Central G-type main-sequence star holding 99.86% of the Solar System mass.',
      functionVi: 'Tạo trường hấp dẫn khổng lồ giữ các hành tinh quay quanh quỹ đạo elip và bức xạ năng lượng nhiệt hạch.',
      functionEn: 'Generates gravitational pull governing planetary orbits and radiates thermonuclear energy.',
      specFormula: 'F_g = G·M_sun·m / r²'
    });

    const planetSpecs = [
      {
        id: 'mercury',
        nameVi: 'Quỹ Đạo Sao Thủy (Mercury)',
        nameEn: 'Mercury Orbit Layer',
        introVi: 'Hành tinh nhỏ nhất và gần Mặt Trời nhất với bề mặt đầy hố va chạm thiên thạch.',
        introEn: 'Smallest and innermost rocky planet in the Solar System.',
        functionVi: 'Chuyển động nhanh nhất theo định luật Kepler II & III với chu kỳ chỉ 88 ngày Trái Đất.',
        functionEn: 'Orbits fastest around the Sun with an 88-Earth-day sidereal year.',
        r: 0.95, size: 0.1, col: 0x94a3b8, speed: 2.3, phase: 0.4, hasMoon: false, hasRing: false
      },
      {
        id: 'venus',
        nameVi: 'Quỹ Đạo Sao Kim (Venus)',
        nameEn: 'Venus Orbit Layer',
        introVi: 'Hành tinh nóng nhất Hệ Mặt Trời do hiệu ứng nhà kính cực mạnh của khí quyển CO₂.',
        introEn: 'Hottest terrestrial planet wrapped in dense CO₂ greenhouse clouds.',
        functionVi: 'Tự quay ngược chiều kim đồng hồ và có quỹ đạo gần tròn nhất trong các hành tinh.',
        functionEn: 'Exhibits retrograde axial rotation and the most circular orbit among planets.',
        r: 1.35, size: 0.14, col: 0xfbbf24, speed: 1.7, phase: 1.8, hasMoon: false, hasRing: false
      },
      {
        id: 'earth',
        nameVi: 'Hệ Trái Đất & Mặt Trăng',
        nameEn: 'Earth & Moon Orbital System',
        introVi: 'Hành tinh xanh nằm trong vùng ở được (Habitable Zone) cùng vệ tinh tự nhiên Mặt Trăng.',
        introEn: 'Third planet from the Sun inside the habitable zone with its natural Moon.',
        functionVi: 'Lực hấp dẫn giữa Trái Đất – Mặt Trăng tạo thủy triều đại dương và ổn định độ nghiêng trục quay 23,5°.',
        functionEn: 'Earth–Moon tidal locking drives ocean tides and stabilizes Earth’s 23.5° axial tilt.',
        r: 1.8, size: 0.16, col: 0x38bdf8, speed: 1.25, phase: 3.1, hasMoon: true, hasRing: false
      },
      {
        id: 'mars',
        nameVi: 'Quỹ Đạo Sao Hỏa (Mars)',
        nameEn: 'Mars Orbit Layer',
        introVi: 'Hành tinh Đỏ với bề mặt giàu oxit sắt, núi lửa Olympus Mons cao nhất Hệ Mặt Trời.',
        introEn: 'The Red Planet coated in iron oxide dust with giant shield volcanoes.',
        functionVi: 'Nghiên cứu quỹ đạo chuyển tiếp Hohmann từ Trái Đất sang Sao Hỏa cho các tàu vũ trụ.',
        functionEn: 'Primary target for Hohmann transfer orbital mechanics and planetary exploration.',
        r: 2.25, size: 0.13, col: 0xf87171, speed: 0.95, phase: 4.5, hasMoon: false, hasRing: false
      },
      {
        id: 'jupiter',
        nameVi: 'Quỹ Đạo Sao Mộc (Jupiter)',
        nameEn: 'Jupiter Gas Giant Layer',
        introVi: 'Hành tinh khí khổng lồ lớn nhất Hệ Mặt Trời, khối lượng gấp 2,5 lần tất cả hành tinh khác cộng lại.',
        introEn: 'Largest gas giant, more than twice as massive as all other planets combined.',
        functionVi: 'Lực hấp dẫn mạnh đóng vai trò lá chắn hút hoặc làm lệch hướng các sao chổi, tiểu hành tinh.',
        functionEn: 'Acts as a gravitational shield deflecting comets and stabilizing inner planetary orbits.',
        r: 2.85, size: 0.28, col: 0xfdba74, speed: 0.62, phase: 0.9, hasMoon: false, hasRing: false
      },
      {
        id: 'saturn',
        nameVi: 'Sao Thổ & Hệ Vành Đai Băng',
        nameEn: 'Saturn & Icy Ring System',
        introVi: 'Hành tinh nổi tiếng với vành đai băng – đá rộng lớn phân bố trên mặt phẳng xích đạo.',
        introEn: 'Gas giant renowned for its sprawling concentric rings of ice and rocky particles.',
        functionVi: 'Minh họa giới hạn Roche: lực thủy triều xé vỡ vệ tinh tiến quá gần thành các vành đai quay.',
        functionEn: 'Demonstrates the Roche limit where tidal forces maintain flat orbital rings.',
        r: 3.5, size: 0.24, col: 0xfde68a, speed: 0.42, phase: 2.4, hasMoon: false, hasRing: true
      }
    ];

    const planets: NonNullable<DynamicModelRef['solar']>['planets'] = [];
    planetSpecs.forEach((sp, idx) => {
      const layerGroup = new THREE.Group();
      layerGroup.position.set(0, centerY, 0);

      const ringGeo = trackGeo(new THREE.TorusGeometry(sp.r, 0.016, 10, 72));
      ringGeo.rotateX(Math.PI / 2);
      const orbitRing = new THREE.Mesh(ringGeo, mats.primary);
      layerGroup.add(orbitRing);

      const pivot = new THREE.Group();
      const pGeo = trackGeo(new THREE.SphereGeometry(sp.size, 22, 22));
      const pMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: sp.col,
          roughness: 0.45,
          metalness: 0.2,
          emissive: sp.col,
          emissiveIntensity: 0.2,
          clippingPlanes: [clipPlane]
        })
      );
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(sp.r, 0, 0);
      pivot.add(pMesh);

      let moonPivot: THREE.Group | undefined;
      if (sp.hasMoon) {
        moonPivot = new THREE.Group();
        const mGeo = trackGeo(new THREE.SphereGeometry(0.048, 14, 14));
        const moon = new THREE.Mesh(mGeo, mats.highlight);
        moon.position.set(0.32, 0.04, 0);
        moonPivot.add(moon);
        pMesh.add(moonPivot);
      }

      if (sp.hasRing) {
        const satRingGeo = trackGeo(new THREE.RingGeometry(sp.size * 1.35, sp.size * 2.1, 36));
        satRingGeo.rotateX(Math.PI / 2 - 0.35);
        const satRingMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: 0xfde68a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.82,
            clippingPlanes: [clipPlane]
          })
        );
        pMesh.add(new THREE.Mesh(satRingGeo, satRingMat));
      }

      layerGroup.add(pivot);
      addPart(layerGroup, new THREE.Vector3(0, (idx - 1.5) * 0.48 + 0.5, 0), {
        id: `solar_${sp.id}`,
        nameVi: sp.nameVi,
        nameEn: sp.nameEn,
        badgeVi: `QUỸ ĐẠO ${idx + 1}`,
        badgeEn: `ORBIT ${idx + 1}`,
        introVi: sp.introVi,
        introEn: sp.introEn,
        functionVi: sp.functionVi,
        functionEn: sp.functionEn,
        specFormula: `T² ∝ a³ · r = ${sp.r} AU (tỷ lệ)`
      });
      planets.push({ pivot, mesh: pMesh, speed: sp.speed, phase: sp.phase, moonPivot });
    });

    return {
      group,
      explodables,
      geometries,
      materials,
      solar: { planets, sunCorona }
    };
  }

  if (kind === 'robot_arm') {
    // 1. Grounded circular heavy servo turret pedestal
    const plinthGeo = trackGeo(new THREE.CylinderGeometry(1.15, 1.35, 0.26, 32));
    const plinth = new THREE.Mesh(plinthGeo, mats.secondary);
    plinth.position.set(0, 0.13, 0);
    addPart(plinth, new THREE.Vector3(0, -0.85, 0), {
      id: 'robot_plinth',
      nameVi: 'Chân Đế Cố Định & Mâm Lực',
      nameEn: 'Heavy Base Plinth',
      badgeVi: 'BỆ MÓNG',
      badgeEn: 'BASE',
      introVi: 'Bệ gang đúc chịu momen xoắn gắn chặt xuống sàn xưởng tự động hóa.',
      introEn: 'Cast-alloy structural plinth anchoring the 6-axis industrial manipulator.',
      functionVi: 'Chống lật do momen quán tính khi tay máy vươn xa mang tải trọng ở tốc độ cao.',
      functionEn: 'Absorbs overturning torque moments during high-speed arm extension under payload.',
      specFormula: 'M_base = F_load × L_reach'
    }, true);

    // 2. Waist servo turret (parent of articulated chain)
    const waist = new THREE.Group();
    waist.position.set(0, 0.26, 0);
    const waistDrumGeo = trackGeo(new THREE.CylinderGeometry(0.68, 0.78, 0.48, 28));
    const waistDrum = new THREE.Mesh(waistDrumGeo, mats.primary);
    waistDrum.position.y = 0.24;
    waist.add(waistDrum);

    const shoulderJointGeo = trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.72, 24));
    shoulderJointGeo.rotateX(Math.PI / 2);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, mats.glow);
    shoulderJoint.position.set(0, 0.52, 0);
    waist.add(shoulderJoint);
    addPart(waist, new THREE.Vector3(-1.05, 0.1, 0), {
      id: 'robot_waist',
      nameVi: 'Khớp Trục Xoay Đế (Trục J1)',
      nameEn: 'Waist Rotary Turret (Joint J1)',
      badgeVi: 'KHỚP J1',
      badgeEn: 'JOINT J1',
      introVi: 'Đế servo quay 360° quanh trục thẳng đứng Y kèm ổ bi chịu lực hướng trục.',
      introEn: '360° yaw rotary servo turret housing the primary harmonic drive.',
      functionVi: 'Điều hướng góc phương vị (Azimuth θ₁) cho toàn bộ cánh tay vươn tới mọi hướng không gian.',
      functionEn: 'Controls horizontal azimuth rotation θ₁ across the full 360° cylindrical workspace.',
      specFormula: 'A₁(θ₁) = Rot_Y(θ₁)'
    });

    // 3. Shoulder Boom Group (child of waist!)
    const shoulder = new THREE.Group();
    shoulder.position.set(0, 0.52, 0);
    waist.add(shoulder);

    const lowerBoomGeo = trackGeo(new THREE.BoxGeometry(0.32, 1.55, 0.32));
    const lowerBoom = new THREE.Mesh(lowerBoomGeo, mats.primary);
    lowerBoom.position.y = 0.78;
    shoulder.add(lowerBoom);

    const pistonGeo = trackGeo(new THREE.CylinderGeometry(0.07, 0.09, 1.15, 14));
    const piston = new THREE.Mesh(pistonGeo, mats.highlight);
    piston.position.set(-0.24, 0.65, 0);
    shoulder.add(piston);
    addPart(shoulder, new THREE.Vector3(0.15, 0.85, 0.75), {
      id: 'robot_shoulder',
      nameVi: 'Thân Vai & Xi-lanh Thủy Lực (Trục J2)',
      nameEn: 'Shoulder Boom & Hydraulic Piston (J2)',
      badgeVi: 'KHỚP J2',
      badgeEn: 'JOINT J2',
      introVi: 'Cánh tay sơ cấp trang bị xi-lanh trợ lực thủy lực nâng toàn bộ phần khuỷu phía trên.',
      introEn: 'Primary structural boom paired with a hydraulic assistive cylinder.',
      functionVi: 'Quyết định tầm vươn cao (θ₂) và gánh phần lớn trọng lượng tải trọng nâng.',
      functionEn: 'Sets vertical reach elevation θ₂ and counterbalances heavy payload gravity.',
      specFormula: 'τ₂ = m·g·L·cos(θ₂)'
    }, false, false);

    // 4. Elbow Joint & Forearm (child of shoulder!)
    const elbow = new THREE.Group();
    elbow.position.set(0, 1.56, 0);
    shoulder.add(elbow);

    const elbowServoGeo = trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.56, 20));
    elbowServoGeo.rotateX(Math.PI / 2);
    elbow.add(new THREE.Mesh(elbowServoGeo, mats.glow));

    const forearmGeo = trackGeo(new THREE.BoxGeometry(0.24, 1.35, 0.24));
    const forearm = new THREE.Mesh(forearmGeo, mats.secondary);
    forearm.position.y = 0.68;
    elbow.add(forearm);
    addPart(elbow, new THREE.Vector3(0.75, 0.9, -0.65), {
      id: 'robot_elbow',
      nameVi: 'Khớp Khuỷu & Cẳng Tay (Trục J3)',
      nameEn: 'Elbow Servo & Forearm (J3)',
      badgeVi: 'KHỚP J3',
      badgeEn: 'JOINT J3',
      introVi: 'Khớp gập tinh gọn giúp đầu kẹp tiếp cận sâu vào góc hẹp trong dây chuyền lắp ráp.',
      introEn: 'Articulated pitch elbow and lightweight aluminum forearm link.',
      functionVi: 'Tinh chỉnh bán kính làm việc (θ₃) phối hợp giải bài toán động học ngược (IK) bám sát điểm mục tiêu.',
      functionEn: 'Refines radial workspace reach θ₃ to solve Inverse Kinematics smoothly.',
      specFormula: 'r = L₁cosθ₂ + L₂cos(θ₂+θ₃)'
    }, false, false);

    // 5. Wrist gimbal + Dual-Jaw Mechanical Gripper (child of elbow!)
    const wrist = new THREE.Group();
    wrist.position.set(0, 1.38, 0);
    elbow.add(wrist);

    const wristRingGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.2, 0.22, 18));
    wrist.add(new THREE.Mesh(wristRingGeo, mats.glow));

    const jawGeo = trackGeo(new THREE.BoxGeometry(0.07, 0.42, 0.14));
    const jawLeft = new THREE.Mesh(jawGeo, mats.highlight);
    jawLeft.position.set(-0.14, 0.28, 0);
    jawLeft.rotation.z = -0.15;

    const jawRight = new THREE.Mesh(jawGeo, mats.highlight);
    jawRight.position.set(0.14, 0.28, 0);
    jawRight.rotation.z = 0.15;

    const tipLaserGeo = trackGeo(new THREE.SphereGeometry(0.08, 16, 16));
    const tipLaser = new THREE.Mesh(tipLaserGeo, mats.glow);
    tipLaser.position.set(0, 0.24, 0);

    wrist.add(jawLeft, jawRight, tipLaser);
    addPart(wrist, new THREE.Vector3(1.15, 0.95, 0.35), {
      id: 'robot_wrist',
      nameVi: 'Cổ Tay 3 Trục & Kẹp Gắp Servo',
      nameEn: 'Gimbal Wrist & Dual-Jaw Gripper',
      badgeVi: 'KẸP GẮP',
      badgeEn: 'END EFFECTOR',
      introVi: 'Đầu công tác cuối cùng gồm vòng gimbal cổ tay và hai ngàm kẹp đóng mở chính xác.',
      introEn: 'End-effector wrist gimbal featuring dual precision servo gripper jaws and optical sensor.',
      functionVi: 'Giữ hướng vật kẹp ổn định và tạo lực kẹp điều khiển lực để gắp linh kiện.',
      functionEn: 'Maintains tool orientation and applies controlled clamping force on target workpieces.',
      specFormula: 'F_grip = 2·μ·F_jaw'
    }, false, false);

    return {
      group,
      explodables,
      geometries,
      materials,
      robotArm: { waist, shoulder, elbow, wrist, jawLeft, jawRight }
    };
  }

  if (kind === 'supercar_aero') {
    // 1. Wind-tunnel rotating turntable disc grounded at y=0
    const deckGeo = trackGeo(new THREE.CylinderGeometry(2.8, 2.95, 0.14, 48));
    const deck = new THREE.Mesh(deckGeo, mats.secondary);
    deck.position.set(0, 0.07, 0);
    addPart(deck, new THREE.Vector3(0, -1.0, 0), {
      id: 'car_turntable',
      nameVi: 'Bệ Xoay Đo Lực Cản Hầm Gió',
      nameEn: 'Wind-Tunnel Calibration Turntable',
      badgeVi: 'BỆ ĐO',
      badgeEn: 'TURNTABLE',
      introVi: 'Sàn quay cân bằng trang bị cảm biến lực 6 thành phần dưới bánh xe.',
      introEn: 'Rotating floor platform equipped with 6-axis aerodynamic force balance sensors.',
      functionVi: 'Đo trực tiếp hệ số lực cản Cd và lực ép xuống mặt đường Cl ở mọi góc gió ngang.',
      functionEn: 'Directly measures drag coefficient Cd and downforce Cl across yaw angles.',
      specFormula: 'F_drag = ½·ρ·v²·A·C_d'
    });

    // 2. Aerodynamic Supercar Chassis via ExtrudeGeometry
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-2.15, 0.18);
    bodyShape.lineTo(2.15, 0.18);
    bodyShape.lineTo(2.22, 0.45);
    bodyShape.lineTo(1.75, 0.68);
    bodyShape.quadraticCurveTo(0.85, 0.78, 0.42, 1.08);
    bodyShape.lineTo(-0.55, 1.12);
    bodyShape.quadraticCurveTo(-1.35, 0.85, -2.0, 0.75);
    bodyShape.lineTo(-2.18, 0.42);
    bodyShape.closePath();

    const chassisGeo = trackGeo(
      new THREE.ExtrudeGeometry(bodyShape, {
        depth: 1.56,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.08,
        bevelSegments: 4
      })
    );
    chassisGeo.translate(0, 0.18, -0.78);
    const chassis = new THREE.Mesh(chassisGeo, mats.primary);
    addPart(chassis, new THREE.Vector3(0, 0.25, 0), {
      id: 'car_chassis',
      nameVi: 'Thân Xe Monocoque Khí Động Học',
      nameEn: 'Monocoque Aero Chassis',
      badgeVi: 'KHUNG THÂN',
      badgeEn: 'CHASSIS',
      introVi: 'Khung thân liền khối sợi carbon vuốt giọt nước giảm tối đa vùng nhiễu xoáy phía sau.',
      introEn: 'Teardrop-profiled carbon monocoque body sculpted for minimal wake turbulence.',
      functionVi: 'Chẻ luồng không khí êm ái qua mũi xe thấp và tạo hiệu ứng Venturi ép thân xe xuống đường.',
      functionEn: 'Slices oncoming air cleanly and harnesses underbody Venturi suction for stability.',
      specFormula: 'C_d ≈ 0.27 · Re = ρvL/μ'
    }, true);

    // 3. Tinted Glass Canopy Dome
    const canopyGeo = trackGeo(new THREE.SphereGeometry(0.68, 28, 20));
    canopyGeo.scale(1.65, 0.52, 0.92);
    const canopyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.2,
        roughness: 0.06,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.82,
        clippingPlanes: [clipPlane]
      })
    );
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(-0.08, 1.16, 0);
    addPart(canopy, new THREE.Vector3(0, 1.85, 0), {
      id: 'car_canopy',
      nameVi: 'Vòm Kính Khoang Lái Thủy Giọt',
      nameEn: 'Teardrop Cockpit Canopy',
      badgeVi: 'KHOANG LÁI',
      badgeEn: 'CANOPY',
      introVi: 'Kính cường lực cong đa chiều nối liền nắp capo đến phần đuôi xe.',
      introEn: 'Low-drag curved polycarbonate cockpit canopy seamlessly bridging hood to rear deck.',
      functionVi: 'Dẫn dòng khí tầng biên bám sát bề mặt (hiệu ứng Coanda) tới cánh gió sau mà không bị tách dòng.',
      functionEn: 'Guides attached boundary-layer airflow cleanly onto the rear wing via the Coanda effect.',
      specFormula: 'v_top > v_bottom ⇒ ΔP < 0'
    });

    // 4. Carbon Rear GT Wing + Pylons grouped
    const gtWingGroup = new THREE.Group();
    const wingBladeGeo = trackGeo(new THREE.BoxGeometry(0.46, 0.06, 1.85));
    const wingBlade = new THREE.Mesh(wingBladeGeo, mats.secondary);
    wingBlade.position.set(-1.92, 1.28, 0);
    wingBlade.rotation.z = -0.14;
    gtWingGroup.add(wingBlade);

    const wingPylonGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.42, 0.06));
    [-0.45, 0.45].forEach((zOff) => {
      const p = new THREE.Mesh(wingPylonGeo, mats.glow);
      p.position.set(-1.86, 1.06, zOff);
      gtWingGroup.add(p);
    });
    addPart(gtWingGroup, new THREE.Vector3(-1.35, 1.35, 0), {
      id: 'car_wing',
      nameVi: 'Cánh Lướt Gió Sau GT (Downforce Wing)',
      nameEn: 'Carbon Rear GT Downforce Wing',
      badgeVi: 'CÁNH GIÓ',
      badgeEn: 'AERO WING',
      introVi: 'Cánh khí động học hình airfoil lật ngược gắn trên 2 trụ cổ ngỗng.',
      introEn: 'Inverted-airfoil carbon rear wing mounted on twin structural pylons.',
      functionVi: 'Tạo lực ép xuống (Downforce) giúp lốp sau bám đường tuyệt đối khi ôm cua tốc độ cao.',
      functionEn: 'Generates upward of 350 kg aerodynamic downforce to maximize rear tire grip at speed.',
      specFormula: 'F_down = ½·ρ·v²·S·|C_L|'
    });

    // 5. Front & Rear LED Light Bars grouped
    const ledGroup = new THREE.Group();
    const lightBarGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.08, 1.35));
    const frontLed = new THREE.Mesh(lightBarGeo, mats.glow);
    frontLed.position.set(2.2, 0.52, 0);
    ledGroup.add(frontLed);

    const rearLed = new THREE.Mesh(lightBarGeo, mats.glow);
    rearLed.position.set(-2.22, 0.72, 0);
    ledGroup.add(rearLed);
    addPart(ledGroup, new THREE.Vector3(1.5, 0.45, 0), {
      id: 'car_leds',
      nameVi: 'Hệ Thống Đèn LED Ma Trận',
      nameEn: 'Matrix LED Lighting Array',
      badgeVi: 'ĐÈN LED',
      badgeEn: 'OPTICS',
      introVi: 'Dải đèn định vị pha trước và đèn hậu liền mạch tích hợp hốc thoát gió.',
      introEn: 'Integrated front and rear laser-LED light bars recessed into aero ducts.',
      functionVi: 'Tối ưu chiếu sáng tầm xa mà không làm tăng diện tích cản gió chính diện.',
      functionEn: 'Delivers high-lumen visibility without adding frontal aerodynamic drag area.',
      specFormula: 'A_frontal ≈ 1.92 m²'
    });

    // 6. 4 Multi-part Alloy Wheels grouped cleanly
    const wheelsGroup = new THREE.Group();
    const wheels: THREE.Group[] = [];
    const tireGeo = trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.26, 26));
    tireGeo.rotateX(Math.PI / 2);
    const rimGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.28, 12));
    rimGeo.rotateX(Math.PI / 2);

    const wheelCoords: [number, number][] = [
      [1.36, 0.86],
      [1.36, -0.86],
      [-1.36, 0.86],
      [-1.36, -0.86]
    ];
    wheelCoords.forEach(([wx, wz]) => {
      const wg = new THREE.Group();
      wg.position.set(wx, 0.48, wz);
      wg.add(new THREE.Mesh(tireGeo, mats.secondary));
      wg.add(new THREE.Mesh(rimGeo, mats.glow));
      wheelsGroup.add(wg);
      wheels.push(wg);
    });
    addPart(wheelsGroup, new THREE.Vector3(0, -0.3, 1.55), {
      id: 'car_wheels',
      nameVi: 'Hệ 4 Bánh Xe Hợp Kim & Lốp Bám Đường',
      nameEn: '4× Forged Alloy Wheel Assembly',
      badgeVi: 'BÁNH XE',
      badgeEn: 'WHEELS',
      introVi: 'Bộ 4 la-zăng hợp kim nhẹ dạng cánh tuabin tản nhiệt phanh kèm lốp thể thao bản rộng.',
      introEn: 'Four forged lightweight turbine-spoke alloy wheels with wide-contact radial tires.',
      functionVi: 'Chuyển mô-men xoắn động cơ thành lực đẩy tịnh tiến và hút khí nóng làm mát đĩa phanh.',
      functionEn: 'Converts axle torque into forward traction while pumping cool air across brake rotors.',
      specFormula: 'v = ω · R_wheel · F_ms ≤ μ·(N + F_down)'
    });

    // Wind-tunnel aerodynamic airflow streamlines
    const streamlines: NonNullable<DynamicModelRef['supercar']>['streamlines'] = [];
    const streamGeo = trackGeo(new THREE.BoxGeometry(0.55, 0.025, 0.025));
    const streamMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: paletteHex,
        transparent: true,
        opacity: 0.75,
        clippingPlanes: [clipPlane]
      })
    );
    for (let i = 0; i < 16; i++) {
      const zLane = ((i % 4) - 1.5) * 0.42;
      const sm = new THREE.Mesh(streamGeo, streamMat);
      sm.position.set(0, 1.45, zLane);
      group.add(sm);
      streamlines.push({
        mesh: sm,
        baseX: (Math.floor(i / 4) - 1.5) * 1.4,
        speed: 3.4 + (i % 3) * 0.5,
        phase: i * 0.45
      });
    }

    return {
      group,
      explodables,
      geometries,
      materials,
      supercar: { wheels, streamlines }
    };
  }

  if (kind === 'wind_turbine') {
    // 1. Floating Ocean Foundation & Wave Ring
    const seaGeo = trackGeo(new THREE.CylinderGeometry(2.1, 2.3, 0.14, 48));
    const sea = new THREE.Mesh(seaGeo, mats.secondary);
    sea.position.set(0, 0.07, 0);
    addPart(sea, new THREE.Vector3(0, -1.0, 0), {
      id: 'wind_foundation',
      nameVi: 'Móng Phao Biển Khơi (Offshore Base)',
      nameEn: 'Floating Offshore Foundation',
      badgeVi: 'MÓNG BIỂN',
      badgeEn: 'FOUNDATION',
      introVi: 'Kết cấu móng trọng lực – phao nổi neo giữ tuabin khổng lồ giữa đại dương.',
      introEn: 'Gravity-stabilized offshore marine platform anchoring the turbine against ocean swells.',
      functionVi: 'Chịu momen uốn của gió bão và áp lực sóng biển giữ tháp trụ luôn thẳng đứng.',
      functionEn: 'Resists extreme wind overturning moments and hydrodynamic wave loads.',
      specFormula: 'F_buoyancy = ρ_sea · V · g'
    });

    const waveRingGeo = trackGeo(new THREE.TorusGeometry(1.4, 0.03, 12, 48));
    waveRingGeo.rotateX(Math.PI / 2);
    const waveRing = new THREE.Mesh(waveRingGeo, mats.glow);
    waveRing.position.set(0, 0.16, 0);
    group.add(waveRing);

    // 2. Tapered Steel Monopole Tower
    const towerGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.34, 2.95, 24));
    const tower = new THREE.Mesh(towerGeo, mats.primary);
    tower.position.set(0, 1.62, 0);
    addPart(tower, new THREE.Vector3(-1.1, -0.2, 0), {
      id: 'wind_tower',
      nameVi: 'Tháp Trụ Thép Hình Côn',
      nameEn: 'Tapered Steel Monopole Tower',
      badgeVi: 'THÁP TRỤ',
      badgeEn: 'TOWER',
      introVi: 'Cột thép hình nón cụt vươn cao lên tầng gió ổn định và ít nhiễu loạn bề mặt.',
      introEn: 'Tapered tubular steel tower elevating the rotor into stronger, smoother upper-altitude winds.',
      functionVi: 'Nâng cụm máy phát lên cao (tốc độ gió tăng theo hàm mũ độ cao) và dẫn cáp điện xuống đáy biển.',
      functionEn: 'Supports the nacelle at optimal wind-shear altitude and routes power cables downward.',
      specFormula: 'v(h) = v₀·(h / h₀)^α'
    }, true);

    // 3. Internal Copper Generator Coils
    const coilMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.85,
        metalness: 0.75,
        roughness: 0.25,
        clippingPlanes: [clipPlane]
      })
    );
    const genGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.65, 20));
    genGeo.rotateX(Math.PI / 2);
    const generator = new THREE.Mesh(genGeo, coilMat);
    generator.position.set(0, 3.22, -0.1);
    addPart(generator, new THREE.Vector3(0.4, 0.2, -1.4), {
      id: 'wind_generator',
      nameVi: 'Máy Phát Điện Từ Cảm Ứng Cuộn Đồng',
      nameEn: 'Copper-Coil Induction Generator',
      badgeVi: 'MÁY PHÁT',
      badgeEn: 'GENERATOR',
      introVi: 'Hệ thống cuộn dây stator đồng và rotor nam châm vĩnh cửu nằm gọn trong khoang máy.',
      introEn: 'Permanent-magnet rotor and copper stator windings housed inside the turbine nacelle.',
      functionVi: 'Biến đổi cơ năng quay của trục cánh quạt thành điện năng xoay chiều theo định luật Faraday.',
      functionEn: 'Converts rotational mechanical torque into clean AC electrical power via Faraday induction.',
      specFormula: 'e = -N·(dΦ/dt) · P = τ·ω'
    });

    // 4. Outer Nacelle Housing Hood
    const nacelleGeo = trackGeo(new THREE.BoxGeometry(0.62, 0.56, 1.15));
    const nacelle = new THREE.Mesh(nacelleGeo, mats.secondary);
    nacelle.position.set(0, 3.24, -0.15);
    addPart(nacelle, new THREE.Vector3(0, 1.65, -0.35), {
      id: 'wind_nacelle',
      nameVi: 'Vỏ Khoang Nacelle & Hộp Số',
      nameEn: 'Nacelle Gearbox Housing',
      badgeVi: 'VỎ KHOANG',
      badgeEn: 'NACELLE',
      introVi: 'Vỏ bảo vệ chống ăn mòn muối biển tích hợp cơ cấu xoay đón hướng gió (Yaw System).',
      introEn: 'Salt-spray-sealed housing containing gearbox, brake disc, and yaw-alignment drives.',
      functionVi: 'Bảo vệ máy phát khỏi thời tiết khắc nghiệt và tự động xoay đón vuông góc với hướng gió thổi.',
      functionEn: 'Shields electrical hardware from marine humidity and aligns the rotor directly into wind.',
      specFormula: 'η_gearbox ≈ 96%'
    }, true);

    // 5. 3-Blade Airfoil Rotor Hub
    const rotor = new THREE.Group();
    rotor.position.set(0, 3.24, 0.56);
    const noseGeo = trackGeo(new THREE.ConeGeometry(0.22, 0.45, 20));
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, mats.glow);
    nose.position.z = 0.2;
    rotor.add(nose);

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.16, 0.35);
    bladeShape.lineTo(0.06, 1.75);
    bladeShape.lineTo(-0.04, 1.75);
    bladeShape.lineTo(-0.08, 0.35);
    bladeShape.closePath();

    const bladeGeo = trackGeo(
      new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2
      })
    );
    for (let i = 0; i < 3; i++) {
      const bPivot = new THREE.Group();
      bPivot.rotation.z = (i * Math.PI * 2) / 3;
      const blade = new THREE.Mesh(bladeGeo, mats.highlight);
      blade.rotation.y = 0.22;
      bPivot.add(blade);
      rotor.add(bPivot);
    }
    addPart(rotor, new THREE.Vector3(0, 0.25, 1.6), {
      id: 'wind_rotor',
      nameVi: 'Cụm Rotor 3 Cánh Khí Động (Airfoil)',
      nameEn: '3-Blade Airfoil Rotor Hub',
      badgeVi: 'CÁNH QUẠT',
      badgeEn: 'ROTOR',
      introVi: '3 cánh quạt mặt cắt cánh máy bay làm bằng sợi thủy tinh siêu nhẹ có thể đổi góc nghiêng (Pitch).',
      introEn: 'Three composite aerodynamic airfoil blades mounted on a pitch-controlled hub.',
      functionVi: 'Khai thác tối đa động năng dòng gió tạo lực nâng làm quay trục (giới hạn Betz 59,3%).',
      functionEn: 'Extracts kinetic wind energy via aerodynamic lift up to the theoretical 59.3% Betz limit.',
      specFormula: 'P = ½·ρ·A·v³·C_p (C_p ≤ 0.593)'
    });

    return {
      group,
      explodables,
      geometries,
      materials,
      windTurbine: { rotor, coilMat, waveRing }
    };
  }

  // kind === 'cable_bridge' (Cable-Stayed Suspension Bridge)
  // 1. Bridge Box-Girder Deck + Center Glow Lane grouped
  const deckGroup = new THREE.Group();
  const deckGeo = trackGeo(new THREE.BoxGeometry(6.6, 0.16, 1.15));
  const deck = new THREE.Mesh(deckGeo, mats.secondary);
  deck.position.set(0, 1.15, 0);
  deckGroup.add(deck);

  const laneGeo = trackGeo(new THREE.BoxGeometry(6.5, 0.03, 0.08));
  const lane = new THREE.Mesh(laneGeo, mats.glow);
  lane.position.set(0, 1.24, 0);
  deckGroup.add(lane);
  addPart(deckGroup, new THREE.Vector3(0, -0.75, 1.15), {
    id: 'bridge_deck',
    nameVi: 'Mặt Dầm Cầu Hộp Thép & Làn Xe',
    nameEn: 'Aerodynamic Box-Girder Deck',
    badgeVi: 'DẦM CẦU',
    badgeEn: 'DECK',
    introVi: 'Bản mặt cầu thép hộp khí động học xuyên suốt hai bờ sông giúp chịu uốn và chống xoắn gió.',
    introEn: 'Streamlined steel box-girder bridge deck carrying traffic loads across the main span.',
    functionVi: 'Truyền tải trọng xe cộ qua các điểm neo cáp lên dây văng và truyền lực nén dọc trục về trụ tháp.',
    functionEn: 'Distributes vehicle live loads into stay-cable anchors and transfers axial compression to piers.',
    specFormula: 'M_uốn_max = F·L / 4'
  });

  // 2. Concrete Piers grouped
  const piersGroup = new THREE.Group();
  const pierGeo = trackGeo(new THREE.BoxGeometry(0.55, 1.1, 1.45));
  [-1.65, 1.65].forEach((tx) => {
    const pier = new THREE.Mesh(pierGeo, mats.secondary);
    pier.position.set(tx, 0.55, 0);
    piersGroup.add(pier);
  });
  addPart(piersGroup, new THREE.Vector3(0, -1.15, -0.45), {
    id: 'bridge_piers',
    nameVi: 'Hệ Trụ Móng Bê Tông Cốt Thép',
    nameEn: 'Reinforced Concrete Piers',
    badgeVi: 'TRỤ MÓNG',
    badgeEn: 'PIERS',
    introVi: 'Hai khối trụ móng bê tông đồ sộ đặt sâu xuống lòng sông làm điểm tựa cho tháp cầu.',
    introEn: 'Twin massive reinforced concrete piers anchored deeply into the riverbed.',
    functionVi: 'Gánh toàn bộ tải trọng thẳng đứng của tháp chữ A, dầm cầu và lực căng của 24 dây văng.',
    functionEn: 'Bears the combined dead weight of pylons, cables, deck, and dynamic traffic loads.',
    specFormula: 'N_pier = W_total / 2'
  });

  // 3. Left & Right Diamond Pylons + 4. Stay Cable Arrays
  const legGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 2.55, 12));
  const crossBeamGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.14, 0.95));
  const cableMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: paletteSecondaryHex,
      emissive: paletteHex,
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.25,
      clippingPlanes: [clipPlane]
    })
  );

  [-1.65, 1.65].forEach((tx, sideIdx) => {
    const isLeft = sideIdx === 0;
    const pylonGroup = new THREE.Group();
    pylonGroup.position.set(tx, 1.15, 0);

    const leftLeg = new THREE.Mesh(legGeo, mats.primary);
    leftLeg.position.set(0, 1.25, -0.34);
    leftLeg.rotation.x = 0.13;
    pylonGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, mats.primary);
    rightLeg.position.set(0, 1.25, 0.34);
    rightLeg.rotation.x = -0.13;
    pylonGroup.add(rightLeg);

    const cross = new THREE.Mesh(crossBeamGeo, mats.glow);
    cross.position.set(0, 1.45, 0);
    pylonGroup.add(cross);

    const capGeo = trackGeo(new THREE.OctahedronGeometry(0.18));
    const cap = new THREE.Mesh(capGeo, mats.glow);
    cap.position.set(0, 2.52, 0);
    pylonGroup.add(cap);

    addPart(pylonGroup, new THREE.Vector3(isLeft ? -1.1 : 1.1, 1.35, 0), {
      id: isLeft ? 'bridge_pylon_left' : 'bridge_pylon_right',
      nameVi: isLeft ? 'Tháp Cầu Chữ A Trái' : 'Tháp Cầu Chữ A Phải',
      nameEn: isLeft ? 'West Diamond Pylon' : 'East Diamond Pylon',
      badgeVi: isLeft ? 'THÁP T1' : 'THÁP T2',
      badgeEn: isLeft ? 'PYLON 1' : 'PYLON 2',
      introVi: 'Tháp thép chữ A đối xứng vươn cao giữ cân bằng hệ dây văng dạng rẽ quạt.',
      introEn: 'Tall diamond-shaped twin-leg pylon resisting asymmetric lateral wind and cable pull.',
      functionVi: 'Chuyển hóa lực kéo xiên của các dây văng thành lực nén thẳng đứng xuống trụ móng.',
      functionEn: 'Converts diagonal stay-cable tension into pure vertical compression down into the pier.',
      specFormula: 'ΣF_x = 0 · N_comp = Σ T_i·sin(α_i)'
    });

    // Group 12 cables per pylon into 1 logical Stay Cable Array part!
    const cablesGroup = new THREE.Group();
    const towerTop = new THREE.Vector3(tx, 3.55, 0);
    const anchors = [-1.4, -0.95, -0.5, 0.5, 0.95, 1.4];
    anchors.forEach((dx) => {
      [-0.48, 0.48].forEach((zOff) => {
        const deckPt = new THREE.Vector3(tx + dx, 1.2, zOff);
        const dir = new THREE.Vector3().subVectors(deckPt, towerTop);
        const len = dir.length();
        const cableGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, len, 6));
        const cable = new THREE.Mesh(cableGeo, cableMat);
        cable.position.copy(towerTop).lerp(deckPt, 0.5);
        cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        cablesGroup.add(cable);
      });
    });
    addPart(cablesGroup, new THREE.Vector3(isLeft ? -0.65 : 0.65, 0.65, isLeft ? 1.1 : -1.1), {
      id: isLeft ? 'bridge_cables_left' : 'bridge_cables_right',
      nameVi: isLeft ? 'Hệ 12 Dây Văng Tháp Trái' : 'Hệ 12 Dây Văng Tháp Phải',
      nameEn: isLeft ? 'West 12-Cable Stay Fan' : 'East 12-Cable Stay Fan',
      badgeVi: 'DÂY VĂNG',
      badgeEn: 'STAY CABLES',
      introVi: 'Các bó cáp thép cường độ siêu cao bọc vỏ chống ăn mòn, căng đối xứng dạng rẽ quạt.',
      introEn: 'High-tensile galvanized steel cable strands arranged in a balanced semi-fan layout.',
      functionVi: 'Treo trực tiếp dầm cầu nhờ thành phần lực căng đứng T·sin(α), giúp nhịp cầu vượt xa hàng trăm mét.',
      functionEn: 'Supports the bridge deck via vertical tension T·sin(α), enabling long clear spans.',
      specFormula: 'T·sin(α) = w·x'
    });
  });

  return { group, explodables, geometries, materials };
}

export function updateAdvancedKinematics(
  model: DynamicModelRef,
  dt: number,
  elapsed: number,
  simSpeed: number,
  heightVal: number,
  frozen: boolean,
  cursorTarget: { x: number; y: number; z: number },
  isPinching: boolean,
  isolatedMode = false
): void {
  if (model.turbofan && !frozen) {
    const rpm = (2.8 + heightVal * 4.2) * simSpeed;
    model.turbofan.fanGroup.rotation.x += dt * rpm;
    model.turbofan.coreGroup.rotation.x -= dt * rpm * 1.45;
    model.turbofan.exhaustMat.emissiveIntensity =
      0.8 + heightVal * 0.85 + Math.sin(elapsed * 12) * 0.15;
  }

  if (model.solar && !frozen) {
    model.solar.sunCorona.rotation.z += dt * 0.8 * simSpeed;
    for (const p of model.solar.planets) {
      p.pivot.rotation.y = elapsed * p.speed * simSpeed * 0.55 + p.phase;
      p.mesh.rotation.y += dt * 1.2 * simSpeed;
      if (p.moonPivot) {
        p.moonPivot.rotation.y += dt * 3.2 * simSpeed;
      }
    }
  }

  if (model.robotArm && !isolatedMode) {
    // Live Inverse-Kinematics-inspired tracking toward hand cursor Oxyz (skipped during single-part isolation)
    const targetWaist = Math.atan2(cursorTarget.x, Math.max(0.8, cursorTarget.z + 2.2));
    const targetShoulder = THREE.MathUtils.clamp((1.8 - cursorTarget.y) * 0.34, -0.75, 0.75);
    const targetElbow = THREE.MathUtils.clamp(-0.65 - (cursorTarget.y - 1.5) * 0.28, -1.5, -0.2);

    model.robotArm.waist.rotation.y = THREE.MathUtils.damp(
      model.robotArm.waist.rotation.y,
      frozen ? model.robotArm.waist.rotation.y : targetWaist,
      8,
      dt
    );
    model.robotArm.shoulder.rotation.z = THREE.MathUtils.damp(
      model.robotArm.shoulder.rotation.z,
      frozen ? model.robotArm.shoulder.rotation.z : targetShoulder,
      8,
      dt
    );
    model.robotArm.elbow.rotation.z = THREE.MathUtils.damp(
      model.robotArm.elbow.rotation.z,
      frozen ? model.robotArm.elbow.rotation.z : targetElbow,
      8,
      dt
    );

    const jawOpen = isPinching ? 0.055 : 0.16;
    model.robotArm.jawLeft.position.x = THREE.MathUtils.damp(
      model.robotArm.jawLeft.position.x,
      -jawOpen,
      14,
      dt
    );
    model.robotArm.jawRight.position.x = THREE.MathUtils.damp(
      model.robotArm.jawRight.position.x,
      jawOpen,
      14,
      dt
    );
  }

  if (model.supercar && !frozen) {
    const windSpeed = (1.8 + heightVal * 2.4) * simSpeed;
    for (const w of model.supercar.wheels) {
      w.rotation.z -= dt * windSpeed * 2.6;
    }
    for (const s of model.supercar.streamlines) {
      const t = ((elapsed * s.speed * (0.6 + heightVal * 0.5) + s.phase) % 5.6) - 2.8;
      const x = -t;
      const roofProfile = Math.exp(-Math.pow((x + 0.1) / 1.35, 2)) * 0.85;
      s.mesh.position.x = x;
      s.mesh.position.y = 0.78 + roofProfile + (s.phase % 0.45);
      s.mesh.rotation.z = -x * 0.14 * roofProfile;
    }
  }

  if (model.windTurbine && !frozen) {
    const windRpm = (1.6 + heightVal * 2.8) * simSpeed;
    model.windTurbine.rotor.rotation.z -= dt * windRpm;
    model.windTurbine.coilMat.emissiveIntensity = 0.4 + heightVal * 0.85;
    const pulse = 1 + ((elapsed * 0.7) % 1) * 0.55;
    model.windTurbine.waveRing.scale.set(pulse, pulse, 1);
  }
}
