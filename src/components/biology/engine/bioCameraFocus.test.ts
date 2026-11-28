import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  computeFocusPoseFromBox3,
  computeZoomStepPose,
  resolveFocusBoxForPart,
  resolveObjectWorldBox3,
  resolvePartVisibilityState,
  stepSmoothCameraTransition
} from './bioCameraFocus';

test('computeFocusPoseFromBox3 targets exact bounding box center instead of world origin (0,0,0)', () => {
  const organBox = new THREE.Box3(
    new THREE.Vector3(0.4, 1.0, -0.2),
    new THREE.Vector3(0.8, 1.5, 0.3)
  );
  const pose = computeFocusPoseFromBox3(organBox, {
    fovDeg: 42,
    aspect: 1.5,
    currentCameraPos: new THREE.Vector3(0, 0.2, 5.4),
    currentTarget: new THREE.Vector3(0, 0.2, 0)
  });

  // Target must equal organBox center (0.6, 1.25, 0.05), NOT (0,0,0)
  assert.ok(Math.abs(pose.target.x - 0.6) < 1e-6);
  assert.ok(Math.abs(pose.target.y - 1.25) < 1e-6);
  assert.ok(Math.abs(pose.target.z - 0.05) < 1e-6);
  // Camera must be cleanly framed within min/max distance around the organ
  const dist = pose.position.distanceTo(pose.target);
  assert.ok(dist >= 0.65 && dist <= 3.0, `Expected tight framing distance, got ${dist}`);
});

test('resolveFocusBoxForPart locates translated nested organ group and measures world Box3', () => {
  const root = new THREE.Group();
  const heartGroup = new THREE.Group();
  heartGroup.userData.organId = 'heart_circulatory';
  heartGroup.position.set(0.18, 0.65, 0.12);

  const ventricle = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 10),
    new THREE.MeshBasicMaterial()
  );
  ventricle.position.set(0.05, -0.05, 0);
  heartGroup.add(ventricle);
  root.add(heartGroup);

  const found = resolveFocusBoxForPart(root, 'heart_circulatory');
  assert.ok(found, 'Expected heart_circulatory group to be found');
  const center = new THREE.Vector3();
  found.box.getCenter(center);
  assert.ok(Math.abs(center.x - 0.23) < 0.02);
  assert.ok(Math.abs(center.y - 0.60) < 0.02);
  assert.ok(Math.abs(center.z - 0.12) < 0.02);
});

test('resolveObjectWorldBox3 excludes hidden child meshes from focus box', () => {
  const group = new THREE.Group();
  const visibleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4));
  visibleMesh.position.set(1, 2, 0);
  const hiddenMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4));
  hiddenMesh.position.set(-5, -5, -5);
  hiddenMesh.visible = false;
  group.add(visibleMesh, hiddenMesh);

  const box = resolveObjectWorldBox3(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  assert.ok(size.x < 0.5 && size.y < 0.5 && size.z < 0.5);
});

test('stepSmoothCameraTransition settles cleanly to desired pose', () => {
  const cam = new THREE.PerspectiveCamera(42, 1.5, 0.1, 100);
  cam.position.set(0, 0, 5);
  const target = new THREE.Vector3(0, 0, 0);
  const desired = {
    position: new THREE.Vector3(0.5, 1.2, 2.2),
    target: new THREE.Vector3(0.5, 1.0, 0.1)
  };

  let settled = false;
  for (let i = 0; i < 60; i++) {
    settled = stepSmoothCameraTransition(cam, target, desired, 0.05, 8.0);
    if (settled) break;
  }
  assert.equal(settled, true);
  assert.ok(cam.position.distanceTo(desired.position) < 1e-4);
  assert.ok(target.distanceTo(desired.target) < 1e-4);
});

test('resolvePartVisibilityState enforces Hide/Show and Isolate rules', () => {
  const hidden = new Set(['skeletal_frame']);
  const input = {
    allPartIds: ['brain_nervous', 'heart_circulatory', 'skeletal_frame'],
    hiddenPartIds: hidden,
    isolatedPartId: 'heart_circulatory'
  };

  assert.deepEqual(resolvePartVisibilityState('skeletal_frame', input), {
    visible: false,
    dimmed: false,
    opacityScale: 0
  });
  assert.deepEqual(resolvePartVisibilityState('heart_circulatory', input), {
    visible: true,
    dimmed: false,
    opacityScale: 1
  });
  assert.deepEqual(resolvePartVisibilityState('brain_nervous', input), {
    visible: true,
    dimmed: true,
    opacityScale: 0.12
  });
});

test('computeZoomStepPose zooms in/out cleanly within distance bounds', () => {
  const target = new THREE.Vector3(0.4, 0.8, 0);
  const pos = new THREE.Vector3(0.4, 0.8, 4.0);
  const zoomedIn = computeZoomStepPose(pos, target, 0.75, 1.0, 14.0);
  assert.ok(Math.abs(zoomedIn.distanceTo(target) - 3.0) < 1e-5);
  const clampedMin = computeZoomStepPose(pos, target, 0.1, 1.0, 14.0);
  assert.ok(Math.abs(clampedMin.distanceTo(target) - 1.0) < 1e-5);
});

test('resolveFocusBoxForPart prioritizes focusAnchorFor over wide peripheral vessel groups', () => {
  const root = new THREE.Group();
  const heartGroup = new THREE.Group();
  heartGroup.userData.organId = 'heart_circulatory';

  const heartCluster = new THREE.Group();
  heartCluster.userData.focusAnchorFor = 'heart_circulatory';
  heartCluster.userData.organId = 'heart_circulatory';
  heartCluster.position.set(0.05, 0.58, 0.08);
  const cone = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8));
  heartCluster.add(cone);

  // Systemic femoral vessel spanning all the way to foot
  const femoral = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.8, 0.02));
  femoral.userData.organId = 'heart_circulatory';
  femoral.position.set(0.2, -0.2, 0);

  heartGroup.add(heartCluster, femoral);
  root.add(heartGroup);

  const found = resolveFocusBoxForPart(root, 'heart_circulatory');
  assert.ok(found, 'Expected anchor match');
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  found.box.getSize(size);
  found.box.getCenter(center);

  assert.ok(size.y < 0.4, `Expected tight focal heart box height < 0.4, got ${size.y}`);
  assert.ok(Math.abs(center.y - 0.58) < 0.05);
});
