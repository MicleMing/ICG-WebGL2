
import { mat3 } from 'gl-matrix';

export function translation(x: number, y: number) {
  const m3 = mat3.create();
  return mat3.set(
    m3,
    1, 0, 0,
    0, 1, 0,
    x, y, 1
  );
}

export function rotation(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m3 = mat3.create();
  return mat3.set(
    m3,
    c, -s, 0,
    s, c, 0,
    0, 0, 1
  );
}

export function scaling(sx: number, sy: number) {
  const m3 = mat3.create();
  return mat3.set(
    m3,
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  );
}

export function identify() {
  const identify = mat3.create();
  return mat3.identity(identify);
}
