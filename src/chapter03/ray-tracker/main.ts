import fs from "fs";
import { Vec3, vec3 } from "./vec3";
import { Ray } from "./ray";
import { hittable, hit_record } from "./hittable";
import { Sphere } from "./sphere";
import { Hittable_list } from "./hittable_list";

const fileName = "ray.ppm";

const exist = fs.existsSync(fileName);

if (exist) {
  fs.unlinkSync(fileName);
}

const stream = fs.createWriteStream(fileName);

function color(ray: Ray, world: hittable) {
  let rec: hit_record = {
    t: 0,
    p: Vec3.create(),
    normal: Vec3.create()
  };
  if (world.hit(ray, 0, 10000000, rec)) {
    const N = rec.normal;
    return Vec3.multiply(
      Vec3.create(Vec3.x(N) + 1, Vec3.y(N) + 1, Vec3.z(N) + 1),
      0.5
    );
  }
  // unit vector(a) = A / |A|
  const unit_direction: vec3 = Vec3.unit_vector(ray.direction());
  const t = 0.5 * (Vec3.y(unit_direction) + 1);
  // 𝑏𝑙𝑒𝑛𝑑𝑒𝑑𝑉𝑎𝑙𝑢𝑒=(1−𝑡)∗𝑠𝑡𝑎𝑟𝑡𝑉𝑎𝑙𝑢𝑒+𝑡∗𝑒𝑛𝑑𝑉𝑎𝑙𝑢𝑒,
  // when t = 1.0 => blue, when t = 0 => white
  return Vec3.add(
    Vec3.multiply([1.0, 1.0, 1.0], 1.0 - t),
    Vec3.multiply([0.5, 0.7, 1.0], t)
  );
}

function main() {
  const nx = 200;
  const ny = 100;
  stream.write("P3\n");
  stream.write(`${nx} ${ny}\n`);
  stream.write("255\n");

  const lower_left_corner = Vec3.create(-2.0, -1.0, -1.0);
  const horizontal = Vec3.create(4.0, 0.0, 0.0);
  const vertical = Vec3.create(0.0, 2.0, 0.0);
  const origin = Vec3.create(0.0, 0.0, 0.0);

  const list: hittable[] = [
    new Sphere({ center: Vec3.create(0, 0, -1), radius: 0.5 }),
    new Sphere({ center: Vec3.create(0, -100.5, -1), radius: 100 })
  ];

  const world: hittable = new Hittable_list({ l: list, n: 2 });

  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      const u = i / nx;
      const v = j / ny;
      const r = new Ray(
        origin,
        // direction: lower_left_corner + u*horizontal + v*vertical
        Vec3.add(
          Vec3.add(lower_left_corner, Vec3.multiply(horizontal, u)),
          Vec3.multiply(vertical, v)
        )
      );
      // const p: vec3 = r.point_at_parameter(2);
      const col: vec3 = color(r, world);
      const ir = Math.floor(255.99 * col[0]);
      const ig = Math.floor(255.99 * col[1]);
      const ib = Math.floor(255.99 * col[2]);
      stream.write(`${ir} ${ig} ${ib}\n`);
    }
  }
}

main();
