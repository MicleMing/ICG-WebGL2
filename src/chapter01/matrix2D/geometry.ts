export default class Geometry {
  gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  rectangle(width: number = 100, height: number = 30) {
    const gl = this.gl;
    const x1 = 0;
    const y1 = 0;
    const x2 = width;
    const y2 = height;

    const vertex = new Float32Array([
      x1, y1,
      x1, y2,
      x2, y1,
      x2, y1,
      x1, y2,
      x2, y2,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
  }

  shapeF() {
    const gl = this.gl;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 左竖
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,

        // 上横
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,

        // 中横
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
      ]),
      gl.STATIC_DRAW);
  }
}

export type GShape = 'rectangle' | 'shapeF';
