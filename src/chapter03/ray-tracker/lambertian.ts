import { Vec3, vec3 } from "./vec3";
import { material } from "./material";
import { Ray } from "./ray";
import { hit_record } from "./hittable";
import { random_in_unit_sphere } from "./random";

export class lambertian implements material {
  albedo: vec3;
  constructor(a: vec3) {
    this.albedo = a;
  }
  scatter(
    r_in: Ray,
    rec: hit_record,
    attenuationBox: { attenuation: vec3 },
    scatteredBox: { scattered: Ray }
  ) {
    const target: vec3 = Vec3.add(
      Vec3.add(rec.p, rec.normal),
      random_in_unit_sphere()
    );
    scatteredBox.scattered = new Ray(rec.p, Vec3.substract(target, rec.p));
    attenuationBox.attenuation = this.albedo;
    return true;
  }
}
