import { Vec3, vec3 } from "./vec3";
import { Ray } from "./ray";

export class Camera {
  lower_left_corner: vec3;
  horizontal: vec3;
  vertical: vec3;
  origin: vec3;

  // constructor(l: vec3, h: vec3, v: vec3, o: vec3) {
  //   this.lower_left_corner = l;
  //   this.horizontal = h;
  //   this.vertical = v;
  //   this.origin = o;
  // }

  constructor(lookfrom: vec3, lookat: vec3, vup: vec3, vfov: number, aspect: number) {
    const theta = vfov * Math.PI / 180;
    const half_height = Math.tan(theta / 2);
    const half_width = aspect * half_height; // aspect = w / h
    let u: vec3;
    let v: vec3;
    let w: vec3;
    this.origin = lookfrom;
    w = Vec3.unit_vector(Vec3.substract(lookfrom, lookat));
    u = Vec3.unit_vector(Vec3.cross(vup, w));
    v = Vec3.cross(w, u);
    // origin - half_width*u - half_height*v - w;
    this.lower_left_corner = Vec3.substract(
      Vec3.substract(
        Vec3.substract(
          this.origin,
          Vec3.multiply(u, half_width)
        ),
        Vec3.multiply(v, half_height)
      ),
      w
    )
    // 2*half_width*u;
    this.horizontal = Vec3.multiply(u, 2 * half_width);
    // 2*half_height*v
    this.vertical = Vec3.multiply(v, 2 * half_height);
  }

  get_ray(u: number, v: number): Ray {
    const { origin, lower_left_corner, horizontal, vertical } = this;
    // lower_left_corner + u*horizontal + v*vertical - origin
    const direction = Vec3.substract(
      Vec3.add(
        Vec3.add(lower_left_corner, Vec3.multiply(horizontal, u)),
        Vec3.multiply(vertical, v)
      ),
      origin
    );
    return new Ray(origin, direction);
  }
}
