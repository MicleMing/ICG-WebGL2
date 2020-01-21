import { Vec3, vec3 } from "./vec3";

export function random_in_unit_sphere(): vec3 {
  let p: vec3;
  do {
    p = Vec3.substract(
      Vec3.multiply(
        Vec3.create(Math.random(), Math.random(), Math.random()),
        2
      ),
      Vec3.create(1, 1, 1)
    );
  } while (Vec3.squard_length(p) >= 1);
  return p;
}
