type vec3 = [number, number, number];

export class Vec3 {
  static create = (v0?: number, v1?: number, v2?: number): vec3 => {
    const v: vec3 = [0, 0, 0];
    v[0] = v0 ? v0 : 0;
    v[1] = v1 ? v1 : 0;
    v[2] = v2 ? v2 : 0;
    return v;
  };
  static x = (v: vec3) => v[0];
  static y = (v: vec3) => v[1];
  static z = (v: vec3) => v[2];
  static r = (v: vec3) => v[0];
  static g = (v: vec3) => v[1];
  static b = (v: vec3) => v[2];
};

