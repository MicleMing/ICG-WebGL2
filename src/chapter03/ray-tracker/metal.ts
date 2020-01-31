import { Vec3, vec3 } from "./vec3";
import { material } from "./material";
import { Ray } from "./ray";
import { hit_record } from "./hittable";

import { random_in_unit_sphere } from "./random";

export function reflect(v: vec3, n: vec3) {
  return Vec3.substract(v, Vec3.multiply(n, 2 * Vec3.dot(v, n)));
}

export class metal implements material {
  albedo: vec3;
  fuzz: number;
  constructor(a: vec3, f: number = 1) {
    this.albedo = a;
    if (f < 1) {
      this.fuzz = f;
    } else {
      this.fuzz = 1;
    }
  }
  scatter(
    r_in: Ray,
    rec: hit_record,
    attenuationBox: { attenuation: vec3 },
    scatteredBox: { scattered: Ray }
  ) {
    const reflected = reflect(Vec3.unit_vector(r_in.direction()), rec.normal);
    const fuzzed = Vec3.add(
      reflected,
      Vec3.multiply(random_in_unit_sphere(), this.fuzz)
    );
    scatteredBox.scattered = new Ray(rec.p, fuzzed);
    attenuationBox.attenuation = this.albedo;
    return Vec3.dot(scatteredBox.scattered.direction(), rec.normal) > 0;
  }
}
