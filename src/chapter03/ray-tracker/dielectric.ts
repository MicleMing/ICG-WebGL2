import { Vec3, vec3 } from "./vec3";
import { material } from "./material";
import { reflect } from './metal';
import { Ray } from "./ray";
import { hit_record } from "./hittable";
import { random_in_unit_sphere } from "./random";

// https://blog.csdn.net/puppet_master/article/details/81144266
function refract(v: vec3, n: vec3, ni_over_nt: number): boolean | vec3 {
  const uv: vec3 = Vec3.unit_vector(v);
  const dt = Vec3.dot(uv, n); // cosθ
  // float discriminant = 1.0 - ni_over_nt*ni_over_nt*(1-dt*dt);
  const s2 = 1 - dt * dt; // sinθ ^ 2
  const st2 = ni_over_nt * ni_over_nt * s2 // sinθ’ ^ 2 = refractRatio ^ 2 * sinθ ^ 2
  const discriminant = 1 - st2; // cosθ' ^ 2
  if (discriminant > 0) {
    // T = T1 + T2  = -N cosθ' + （L + Ncosθ）η
    const t1: vec3 = Vec3.multiply(Vec3.multiply(n, Math.sqrt(discriminant)), -1);
    const t2: vec3 = Vec3.multiply(
      Vec3.substract(uv, Vec3.multiply(n, dt)),
      ni_over_nt
    );
    const refracted = Vec3.add(t1, t2);
    return refracted;
  }
  return false;
}

export class dielectric implements material {
  ref_idx: number;
  constructor(ri: number) {
    this.ref_idx = ri; // refract ratio
  }

  scatter(
    r_in: Ray,
    rec: hit_record,
    attenuationBox: { attenuation: vec3 },
    scatteredBox: { scattered: Ray }
  ) {
    let outward_normal: vec3;
    const reflected = reflect(r_in.direction(), rec.normal);
    let ni_over_nt;
    attenuationBox.attenuation = Vec3.create(1, 1, 1);
    if (Vec3.dot(r_in.direction(), rec.normal) > 0) {
      outward_normal = Vec3.multiply(rec.normal, -1);
      ni_over_nt = this.ref_idx;
    } else {
      outward_normal = rec.normal;
      ni_over_nt = 1 / this.ref_idx;
    }
    let refracted = refract(r_in.direction(), outward_normal, ni_over_nt);
    if (reflected) {
      scatteredBox.scattered = new Ray(rec.p, (refracted as vec3))
    } else {
      scatteredBox.scattered = new Ray(rec.p, reflected);
      return false;
    }
    return true;
  }
}
