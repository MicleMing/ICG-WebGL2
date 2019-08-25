
const kenels = {
  normal: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0
  ],
  gaussianBlur: [
    0.045, 0.122, 0.045,
    0.122, 0.332, 0.122,
    0.045, 0.122, 0.045
  ],
  unsharpen: [
    -1, -1, -1,
    -1, 9, -1,
    -1, -1, -1
  ],
  sharpness: [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ],
  sharpen: [
    -1, -1, -1,
    -1, 16, -1,
    -1, -1, -1
  ],
  edgeDetect: [
    -1, -1, -1,
    2, 2, 2,
    -1, -1, -1
  ],

  sobelHorizontal: [
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1
  ],
  sobelVertical: [
    1, 0, -1,
    2, 0, -2,
    1, 0, -1
  ],
  previtHorizontal: [
    1, 1, 1,
    0, 0, 0,
    -1, -1, -1
  ],
  previtVertical: [
    1, 0, -1,
    1, 0, -1,
    1, 0, -1
  ],
  boxBlur: [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111
  ],
  emboss: [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2
  ]
}

export type IKenel = keyof typeof kenels;

export default kenels;
