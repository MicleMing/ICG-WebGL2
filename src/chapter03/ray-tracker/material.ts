import { vec3 } from "./vec3";
import { Ray } from "./ray";
import { hit_record } from "./hittable";

export abstract class material {
  abstract scatter: (
    r_in: Ray,
    rec: hit_record,
    attenuationBox: { attenuation: vec3 },
    scatteredBox: { scattered: Ray }
  ) => boolean;
}
