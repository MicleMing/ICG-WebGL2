import { Vec3, vec3 } from "./vec3";
import { Ray } from "./ray";

function random_in_unit_disk(): vec3 {
  let p: vec3;
  do {
    p = Vec3.substract(
      Vec3.multiply(
        Vec3.create(Math.random(), Math.random(), 0),
        2
      ),
      Vec3.create(1, 1, 0)
    )
  } while (Vec3.dot(p, p) >= 1)
  return p;
}

export class Camera {
  lower_left_corner: vec3;
  horizontal: vec3;
  vertical: vec3;
  origin: vec3;
  u: vec3;
  v: vec3;
  w: vec3;
  lens_radius: number;

  // constructor(l: vec3, h: vec3, v: vec3, o: vec3) {
  //   this.lower_left_corner = l;
  //   this.horizontal = h;
  //   this.vertical = v;
  //   this.origin = o;
  // }

  constructor(
    lookfrom: vec3, lookat: vec3, vup: vec3,
    vfov: number, aspect: number, aperture: number, focus_dist: number,
  ) {
    const theta = vfov * Math.PI / 180;
    const half_height = Math.tan(theta / 2);
    const half_width = aspect * half_height; // aspect = w / h

    this.origin = lookfrom;
    this.w = Vec3.unit_vector(Vec3.substract(lookfrom, lookat));
    this.u = Vec3.unit_vector(Vec3.cross(vup, this.w));
    this.v = Vec3.cross(this.w, this.u);
    // origin - half_width*u - half_height*v - w;
    this.lower_left_corner = Vec3.substract(
      Vec3.substract(
        Vec3.substract(
          this.origin,
          Vec3.multiply(this.u, half_width * focus_dist)
        ),
        Vec3.multiply(this.v, half_height * focus_dist)
      ),
      Vec3.multiply(this.w, focus_dist)
    )
    // 2*half_width*u;
    this.horizontal = Vec3.multiply(this.u, 2 * half_width * focus_dist);
    // 2*half_height*v
    this.vertical = Vec3.multiply(this.v, 2 * half_height * focus_dist);
    this.lens_radius = aperture / 2;
  }

  get_ray(u: number, v: number): Ray {
    const { origin, lower_left_corner, horizontal, vertical, lens_radius } = this;
    const rd = Vec3.multiply(random_in_unit_disk(), lens_radius)
    const offset = Vec3.add(
      Vec3.multiply(this.u, Vec3.x(rd)),
      Vec3.multiply(this.v, Vec3.y(rd))
    );

    const blurOrigin = Vec3.add(origin, offset);

    // lower_left_corner + u*horizontal + v*vertical - origin - offset
    const direction = Vec3.substract(
      Vec3.substract(
        Vec3.add(
          Vec3.add(lower_left_corner, Vec3.multiply(horizontal, u)),
          Vec3.multiply(vertical, v)
        ),
        origin
      ),
      offset
    )
    return new Ray(blurOrigin, direction);
  }
}
