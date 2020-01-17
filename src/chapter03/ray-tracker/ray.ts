
import { vec3, Vec3 } from './vec3';
export class Ray {
  A: vec3;
  B: vec3;
  constructor(a: vec3, b: vec3) {
    this.A = a;
    this.B = b;
  }

  origin(): vec3 {
    return this.A;
  }

  direction(): vec3 {
    return this.B;
  }

  point_at_parameter(t: number) {
    // p(t) = A + t * B
    return Vec3.add(this.A, Vec3.multiply(this.B, t));
  }
}