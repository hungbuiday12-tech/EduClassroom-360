declare module 'troika-three-text' {
  import * as THREE from 'three';

  export class Text extends THREE.Mesh {
    text: string;
    fontSize: number;
    color: THREE.ColorRepresentation;
    anchorX: number | 'left' | 'center' | 'right';
    anchorY: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom';
    maxWidth: number;
    textAlign: 'left' | 'right' | 'center' | 'justify';
    outlineWidth: number | string;
    outlineColor: THREE.ColorRepresentation;
    outlineOpacity: number;
    fillOpacity: number;
    depthOffset: number;
    fontWeight: 'normal' | 'bold' | number;
    letterSpacing: number;
    lineHeight: number | 'normal';
    clipRect: [number, number, number, number] | null;
    orientation: string;
    sync(callback?: () => void): void;
    dispose(): void;
  }
}
