
import { mat4 } from 'gl-matrix';

export function translation(x: number, y: number, z: number) {
  const m4 = mat4.create();
  return mat4.set(
    m4,
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  );
}

export function rotationX(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m4 = mat4.create();
  return mat4.set(
    m4,
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  );
}

export function rotationY(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m4 = mat4.create();
  return mat4.set(
    m4,
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  );
}

export function rotationZ(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m4 = mat4.create();
  return mat4.set(
    m4,
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
}

export function scaling(sx: number, sy: number, sz: number) {
  const m4 = mat4.create();
  return mat4.set(
    m4,
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1,
  );
}

export function identify() {
  const identify = mat4.create();
  return mat4.identity(identify);
}

export function projection(w: number, h: number, d: number) {
  const m4 = mat4.create();

  return mat4.set(
    m4,
    2 / w, 0, 0, 0,
    0, -2 / h, 0, 0,
    0, 0, 2 / d, 0,
    -1, 1, 0, 1,
  );
}
