import { Vec3 } from '../vec3';

describe('Vec3', () => {
  test('ceate vec3', () => {
    const v = Vec3.create();
    expect(v).toEqual([0, 0, 0]);
  })
});
