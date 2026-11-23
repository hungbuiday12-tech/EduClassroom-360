declare module 'troika-three-text' {
  import * as THREE from 'three';

  export class Text extends THREE.Mesh {
    text: string;
    font?: string;
    fontSize: number;
    fontWeight?: number | string;
    color: number | string;
    anchorX: 'left' | 'center' | 'right' | number;
    anchorY: 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom' | number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    maxWidth?: number;
    lineHeight?: number;
    letterSpacing?: number;
    outlineWidth?: number | string;
    outlineColor?: number | string;
    outlineOpacity?: number;
    outlineBlur?: number | string;
    fillOpacity?: number;
    strokeWidth?: number | string;
    strokeColor?: number | string;
    depthOffset?: number;
    sdfGlyphSize?: number;
    sync(callback?: () => void): void;
    dispose(): void;
  }
}
