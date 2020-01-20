import fs from "fs";
import { Vec3, vec3 } from "./vec3";
import { Ray } from "./ray";
import { hittable, hit_record } from "./hittable";
import { Sphere } from "./sphere";
import { Hittable_list } from "./hittable_list";
import { Camera } from "./camera";

const fileName = "ray.ppm";

const exist = fs.existsSync(fileName);

if (exist) {
  fs.unlinkSync(fileName);
}

const stream = fs.createWriteStream(fileName);

function random_in_unit_sphere(): vec3 {
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

function color(ray: Ray, world: hittable) {
  let rec: hit_record = {
    t: 0,
    p: Vec3.create(),
    normal: Vec3.create()
  };
  if (world.hit(ray, 0.001, 10000000, rec)) {
    const target = Vec3.add(
      Vec3.add(rec.p, rec.normal),
      random_in_unit_sphere()
    );
    return Vec3.multiply(
      color(new Ray(rec.p, Vec3.substract(target, rec.p)), world),
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
  const ns = 100;
  stream.write("P3\n");
  stream.write(`${nx} ${ny}\n`);
  stream.write("255\n");

  const lower_left_corner = Vec3.create(-2.0, -1.0, -1.0);
  const horizontal = Vec3.create(4.0, 0.0, 0.0);
  const vertical = Vec3.create(0.0, 2.0, 0.0);
  const origin = Vec3.create(0.0, 0.0, 0.0);

  const cam: Camera = new Camera(
    lower_left_corner,
    horizontal,
    vertical,
    origin
  );

  const list: hittable[] = [
    new Sphere({ center: Vec3.create(0, 0, -1), radius: 0.5 }),
    new Sphere({ center: Vec3.create(0, -100.5, -1), radius: 100 })
  ];

  const world: hittable = new Hittable_list({ l: list, n: 2 });

  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      let col = Vec3.create();
      for (let s = 0; s < ns; s++) {
        const u = (i + Math.random()) / nx;
        const v = (j + Math.random()) / ny;
        const r = cam.get_ray(u, v);
        col = Vec3.add(col, color(r, world));
      }
      col = Vec3.square(Vec3.devide(col, ns));
      const ir = Math.floor(255.99 * col[0]);
      const ig = Math.floor(255.99 * col[1]);
      const ib = Math.floor(255.99 * col[2]);
      stream.write(`${ir} ${ig} ${ib}\n`);
    }
  }
}

main();
