export type vec3 = [number, number, number];

const checkVec3 = (v) => {
  return Object.prototype.toString.call(v) === '[object Array]' && v.length === 3;
};

export class Vec3 {

  static x = (v: vec3) => v[0];
  static y = (v: vec3) => v[1];
  static z = (v: vec3) => v[2];
  static r = (v: vec3) => v[0];
  static g = (v: vec3) => v[1];
  static b = (v: vec3) => v[2];

  static create(v0?: number, v1?: number, v2?: number): vec3 {
    const v: vec3 = [0, 0, 0];
    v[0] = v0 ? v0 : 0;
    v[1] = v1 ? v1 : 0;
    v[2] = v2 ? v2 : 0;
    return v;
  };

  static multiply(a: vec3, t: number): vec3;
  static multiply(a: vec3, b: vec3): vec3;

  static multiply(a: vec3, b: vec3 | number): vec3 {
    const out = Vec3.create();
    const isVec3 = checkVec3(b);
    out[0] = a[0] * (isVec3 ? b[0] : b);
    out[1] = a[1] * (isVec3 ? b[1] : b);
    out[2] = a[2] * (isVec3 ? b[2] : b);
    return out;
  }

  static add(a: vec3, b: vec3): vec3 {
    const out = Vec3.create();
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }

  static devide(a: vec3, t: number): vec3;
  static devide(a: vec3, b: vec3): vec3;

  static devide(a: vec3, b: vec3 | number): vec3 {
    const out = Vec3.create();
    const isVec3 = checkVec3(b);
    out[0] = a[0] / (isVec3 ? b[0] : b);
    out[1] = a[1] / (isVec3 ? b[1] : b);
    out[2] = a[2] / (isVec3 ? b[2] : b);
    return out;
  }

  static dot(a: vec3, b: vec3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  static len(v: vec3): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  static make_unit_vector(v: vec3): vec3 {
    const k = Vec3.len(v);
    return Vec3.devide(v, k);
  }

  static unit_vector(v: vec3): vec3 {
    return Vec3.devide(v, Vec3.len(v));
  }
};

