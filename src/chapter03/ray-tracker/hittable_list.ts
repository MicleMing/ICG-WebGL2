import { Vec3, vec3 } from "./vec3";
import { hittable, hit_record } from "./hittable";
import { Ray } from "./ray";

type Props = {
  l: hittable[];
  n: number;
};

export class Hittable_list implements hittable {
  list: hittable[];
  list_size: number;
  constructor(props: Props) {
    this.list = props.l;
    this.list_size = props.n;
  }

  hit(r: Ray, t_min: number, t_max: number, rec: hit_record) {
    let temp_rec: hit_record = {
      t: 0,
      p: Vec3.create(),
      normal: Vec3.create()
    };
    let hit_anything = false;
    let closest_so_far = t_max;
    for (let i = 0; i < this.list_size; i++) {
      if (this.list[i].hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec.normal = temp_rec.normal;
        rec.p = temp_rec.p;
        rec.t = temp_rec.t;
      }
    }
    return hit_anything;
  }
}
