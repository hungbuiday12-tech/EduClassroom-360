import * as THREE from 'three';
import { getBiologyAssetSpec, BiologyAssetSpec } from './bioAssetRegistry';

export interface BioAssetLoadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface BioLoadedModelResult {
  group: THREE.Group;
  usedExternalGltf: boolean;
  spec?: BiologyAssetSpec;
}

// Module-level shared loader instances & asset template cache
let sharedDracoLoader: import('three/examples/jsm/loaders/DRACOLoader.js').DRACOLoader | null = null;
let sharedGltfLoader: import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader | null = null;
const cachedGltfRoots = new Map<string, THREE.Group>();

export async function getSharedGltfLoader() {
  if (!sharedGltfLoader || !sharedDracoLoader) {
    const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js')
    ]);
    sharedDracoLoader = new DRACOLoader();
    // Point to local /public/draco/ decoder directory
    sharedDracoLoader.setDecoderPath('./draco/');
    sharedGltfLoader = new GLTFLoader();
    sharedGltfLoader.setDRACOLoader(sharedDracoLoader);
  }
  return sharedGltfLoader;
}

/**
 * Lazy-loads a GLB/GLTF biology asset if `assetPath` is declared on the manifest spec,
 * caching the parsed scene hierarchy for reuse and normalizing scale/shadows.
 * Never triggers 404 console spam when `assetPath` is omitted — resolves cleanly to procedural fallback.
 */
export async function loadBiologyGltfOrFallback(
  modelId: string,
  options?: {
    targetSize?: number;
    onProgress?: (p: BioAssetLoadProgress) => void;
    signal?: AbortSignal;
  }
): Promise<BioLoadedModelResult | null> {
  const spec = getBiologyAssetSpec(modelId);
  if (!spec?.assetPath) {
    return null;
  }

  if (options?.signal?.aborted) {
    return null;
  }

  const cached = cachedGltfRoots.get(spec.assetPath);
  if (cached) {
    return {
      group: cached.clone(true),
      usedExternalGltf: true,
      spec
    };
  }

  try {
    const loader = await getSharedGltfLoader();
    const gltf = await new Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF>((resolve, reject) => {
      if (options?.signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      loader.load(
        spec.assetPath!,
        (loaded) => resolve(loaded),
        (evt) => {
          if (evt.total > 0 && options?.onProgress) {
            options.onProgress({
              loaded: evt.loaded,
              total: evt.total,
              percent: Math.min(100, Math.round((evt.loaded / evt.total) * 100))
            });
          }
        },
        (err) => reject(err)
      );
    });

    const root = gltf.scene || new THREE.Group();
    root.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 1e-4);
    const desiredSize = options?.targetSize ?? 3.4;
    const scaleFactor = desiredSize / maxDim;

    const normalized = new THREE.Group();
    root.position.sub(center);
    normalized.add(root);
    normalized.scale.setScalar(scaleFactor);

    normalized.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    cachedGltfRoots.set(spec.assetPath, normalized);

    return {
      group: normalized.clone(true),
      usedExternalGltf: true,
      spec
    };
  } catch {
    return null;
  }
}

const TEXTURE_KEYS = [
  'map',
  'normalMap',
  'bumpMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'emissiveMap',
  'alphaMap',
  'clearcoatMap',
  'clearcoatRoughnessMap',
  'clearcoatNormalMap'
] as const;

/**
 * Thoroughly disposes geometries, materials, embedded Texture maps, and custom objects (e.g. Troika labels).
 */
export function disposeObjectTreeFull(obj: THREE.Object3D): void {
  const disposedTextures = new Set<THREE.Texture>();
  const disposedMaterials = new Set<THREE.Material>();
  const disposedGeometries = new Set<THREE.BufferGeometry>();

  obj.traverse((child) => {
    const maybeTroika = child as { dispose?: () => void };
    if (typeof maybeTroika.dispose === 'function' && !(child instanceof THREE.Mesh)) {
      try {
        maybeTroika.dispose();
      } catch {
        // ignore
      }
    }
    const mesh = child as THREE.Mesh;
    if (mesh.geometry && !disposedGeometries.has(mesh.geometry)) {
      disposedGeometries.add(mesh.geometry);
      mesh.geometry.dispose();
    }
    const matList = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const mat of matList) {
      if (!mat || disposedMaterials.has(mat)) continue;
      disposedMaterials.add(mat);
      const recordMat = mat as unknown as Record<string, unknown>;
      for (const k of TEXTURE_KEYS) {
        const tex = recordMat[k] as THREE.Texture | undefined;
        if (tex && typeof tex.dispose === 'function' && !disposedTextures.has(tex)) {
          disposedTextures.add(tex);
          tex.dispose();
        }
      }
      mat.dispose();
    }
  });
}
