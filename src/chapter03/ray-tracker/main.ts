import fs from 'fs';
import { Vec3, vec3 } from './vec3';

const fileName = 'ray.ppm';

const exist = fs.existsSync(fileName);

if (exist) {
  fs.unlinkSync(fileName);
}

const stream = fs.createWriteStream(fileName);

function main() {
  const nx = 200;
  const ny = 100;
  stream.write("P3\n");
  stream.write(`${nx} ${ny}\n`);
  stream.write('255\n');
  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      const col: vec3 = Vec3.create(i / nx, j / ny, 0.2);
      const ir = Math.floor(255.99 * col[0]);
      const ig = Math.floor(255.99 * col[1]);
      const ib = Math.floor(255.99 * col[2]);
      stream.write(`${ir} ${ig} ${ib}\n`);
    }
  }
}

main();