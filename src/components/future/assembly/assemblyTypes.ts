import * as THREE from 'three';

export type AssemblyModelId =
  | 'v4_engine'
  | 'tourbillon_watch'
  | 'fpv_drone'
  | 'planetary_gearbox';

export type AssemblyDifficulty = 'guided' | 'hardcore';

export interface AssemblyPartSpec {
  id: string;
  order: number;
  nameVi: string;
  nameEn: string;
  materialTagVi: string;
  materialTagEn: string;
  roleVi: string;
  roleEn: string;
  specs: string;
  /** Target position in assembled local coordinates */
  assembledPos: [number, number, number];
  /** Staging position when unassigned / in 3D staging arc */
  stagingPos: [number, number, number];
  /** Offset added when Exploded View slider is 100% */
  explodeOffset: [number, number, number];
  /** Direction vector along which the part slides when snapping in */
  snapAxis: [number, number, number];
  /** Prerequisite part IDs that should be installed before this part */
  requires: string[];
  /** Whether this part is the pre-mounted base chassis */
  isBase?: boolean;
  /** Accent hex for part tray dot & hologram target */
  accentHex: string;
}

export interface AssemblyModelSpec {
  id: AssemblyModelId;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  badge: string;
  defaultCameraPos: [number, number, number];
  defaultTarget: [number, number, number];
  snapDistance: number;
  runLabelVi: string;
  runLabelEn: string;
  parts: AssemblyPartSpec[];
}

export interface PartRuntimeNode {
  spec: AssemblyPartSpec;
  group: THREE.Group;
  ghostGroup: THREE.Group;
  guideLine: THREE.Line;
  animatedParts: Record<string, THREE.Object3D>;
  /** Current normalized assembly progress (0 = staging/dragged, 1 = seated) */
  seatProgress: number;
  /** Current world/local position while dragging or flying */
  currentPos: THREE.Vector3;
  /** Target position for smooth damping */
  targetPos: THREE.Vector3;
  /** Spring flash intensity on snap (0..1) */
  flashIntensity: number;
}
