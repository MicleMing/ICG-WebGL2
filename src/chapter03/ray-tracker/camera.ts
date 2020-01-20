import { Vec3, vec3 } from "./vec3";
import { Ray } from "./ray";

export class Camera {
  lower_left_corner: vec3;
  horizontal: vec3;
  vertical: vec3;
  origin: vec3;

  constructor(l: vec3, h: vec3, v: vec3, o: vec3) {
    this.lower_left_corner = l;
    this.horizontal = h;
    this.vertical = v;
    this.origin = o;
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
