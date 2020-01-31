import fs from "fs";
import { Vec3, vec3 } from "./vec3";
import { Ray } from "./ray";
import { hittable, hit_record } from "./hittable";
import { Sphere } from "./sphere";
import { Hittable_list } from "./hittable_list";
import { Camera } from "./camera";
import { lambertian } from "./lambertian";
import { metal } from "./metal";
import { dielectric } from "./dielectric";

const fileName = "ray.ppm";

const exist = fs.existsSync(fileName);

if (exist) {
  fs.unlinkSync(fileName);
}

const stream = fs.createWriteStream(fileName);

function color(ray: Ray, world: hittable, depth: number) {
  let rec: hit_record = {
    t: 0,
    p: Vec3.create(),
    normal: Vec3.create(),
    mat_ptr: new lambertian(Vec3.create())
  };
  if (world.hit(ray, 0.001, 10000000, rec)) {
    let scatteredBox = {
      scattered: new Ray(Vec3.create(), Vec3.create())
    };
    let attenuationBox = {
      attenuation: Vec3.create()
    };

    if (
      depth < 50 &&
      rec.mat_ptr.scatter(ray, rec, attenuationBox, scatteredBox)
    ) {
      // console.log(attenuationBox.attenuation);
      return Vec3.multiply(
        attenuationBox.attenuation,
        color(scatteredBox.scattered, world, depth + 1)
      );
    } else {
      return Vec3.create(0, 0, 0);
    }
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

  const lookfrom = Vec3.create(3, 3, 2);
  const lookat = Vec3.create(0, 0, -1);
  const dist_to_focus = Vec3.len(Vec3.substract(lookfrom, lookat));
  const aperture = 2;
  const cam: Camera = new Camera(lookfrom, lookat, Vec3.create(0, 1, 0), 30, nx / ny, aperture, dist_to_focus);

  const list: hittable[] = [
    new Sphere({
      center: Vec3.create(0, 0, -1),
      radius: 0.5,
      m: new lambertian([0.1, 0.2, 0.5])
    }),
    new Sphere({
      center: Vec3.create(0, -100.5, -1),
      radius: 100,
      m: new lambertian([0.8, 0.8, 0])
    }),
    new Sphere({
      center: Vec3.create(1, 0, -1),
      radius: 0.5,
      m: new metal([0.8, 0.6, 0.2], 0.3)
    }),
    // new Sphere({
    //   center: Vec3.create(-1, 0, -1),
    //   radius: 0.5,
    //   m: new dielectric(1.3)
    // }),
    // new Sphere({
    //   center: Vec3.create(-1, 0, -1),
    //   radius: -0.45,
    //   m: new dielectric(1.5)
    // })
  ];

  const world: hittable = new Hittable_list({ l: list });

  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      let col = Vec3.create();
      for (let s = 0; s < ns; s++) {
        const u = (i + Math.random()) / nx;
        const v = (j + Math.random()) / ny;
        const r = cam.get_ray(u, v);
        col = Vec3.add(col, color(r, world, 0));
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
