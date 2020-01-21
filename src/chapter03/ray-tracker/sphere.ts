import { Vec3, vec3 } from "./vec3";
import { hittable, hit_record } from "./hittable";
import { Ray } from "./ray";
import { material } from "./material";
type Props = {
  center: vec3;
  radius: number;
  m: material;
};
export class Sphere implements hittable {
  center: vec3;
  radius: number;
  mat_ptr: material;
  constructor(props: Props) {
    this.center = props.center;
    this.radius = props.radius;
    this.mat_ptr = props.m;
  }
  hit(r: Ray, t_min: number, t_max: number, rec: hit_record) {
    const { center, radius, mat_ptr } = this;
    // 𝑡2⋅𝑑𝑜𝑡(𝐵,𝐵)+2𝑡⋅𝑑𝑜𝑡(𝐵,𝐴−𝐶)+𝑑𝑜𝑡(𝐴−𝐶,𝐴−𝐶)−𝑅2=0
    const oc: vec3 = Vec3.substract(r.origin(), center);
    const a = Vec3.dot(r.direction(), r.direction());
    const b = 2 * Vec3.dot(oc, r.direction());
    const c = Vec3.dot(oc, oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      let temp = (-b - Math.sqrt(discriminant)) / (2 * a);
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.point_at_parameter(rec.t);
        rec.normal = Vec3.unit_vector(Vec3.substract(rec.p, center));
        rec.mat_ptr = mat_ptr;
        return true;
      }
      temp = (-b + Math.sqrt(discriminant)) / (2 * a);
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.point_at_parameter(rec.t);
        rec.normal = Vec3.unit_vector(Vec3.substract(rec.p, center));
        rec.mat_ptr = mat_ptr;
        return true;
      }
    }
    return false;
  }
}
