export type CustomModelPrimitiveKind =
  | 'box'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'octahedron'
  | 'dodecahedron'
  | 'icosahedron'
  | 'ring'
  | 'capsule'
  | 'prism';

export type CustomModelColorRole = 'primary' | 'secondary' | 'highlight' | 'glow';

export type CustomModelAnimType = 'none' | 'spin_y' | 'spin_x' | 'spin_z' | 'pulse' | 'bob_y' | 'orbit_y';

export interface CustomModelAnimSpec {
  type: CustomModelAnimType;
  speed: number;
  amplitude: number;
}

export interface CustomModelPartSpec {
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
  primitive: CustomModelPrimitiveKind;
  colorRole: CustomModelColorRole;
  customHex?: string;
  pos: [number, number, number];
  rot: [number, number, number]; // radians
  scale: [number, number, number];
  explodeDir: [number, number, number];
  addEdges?: boolean;
  anim?: CustomModelAnimSpec;
}

export interface CustomModelBlueprint2D {
  summaryVi: string;
  summaryEn: string;
  elements: {
    kind: 'circle' | 'rect' | 'line' | 'polygon';
    label: string;
    coords: number[];
    color?: string;
  }[];
}

export interface CustomSpatialModel {
  id: string;
  titleVi: string;
  titleEn: string;
  badge: string;
  formula: string;
  descVi: string;
  descEn: string;
  sourceIdea: string;
  sourceType?: 'ai_idea' | 'real_world_camera';
  detectedObjectVi?: string;
  detectedObjectEn?: string;
  hasImageAttachment?: boolean;
  attachmentName?: string;
  createdAt: string;
  parts: CustomModelPartSpec[];
  blueprint2D?: CustomModelBlueprint2D;
}

export const CUSTOM_MODEL_PRIMITIVES: CustomModelPrimitiveKind[] = [
  'box',
  'sphere',
  'cylinder',
  'cone',
  'torus',
  'octahedron',
  'dodecahedron',
  'icosahedron',
  'ring',
  'capsule',
  'prism'
];
