import { Ray } from "./ray";
import { vec3 } from "./vec3";

export type hit_record = {
  t: number;
  p: vec3;
  normal: vec3;
};

export abstract class hittable {
  hit: (
    r: Ray,
    t_min: number,
    t_max: number,
    hit_record: hit_record
  ) => boolean;
}
