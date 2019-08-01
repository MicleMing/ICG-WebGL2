export default class Geometry {
  gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }
  shapeF() {
    const gl = this.gl;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 左竖
        0, 0, 0,
        30, 0, 0,
        0, 150, 0,
        0, 150, 0,
        30, 0, 0,
        30, 150, 0,

        // 上横
        30, 0, 0,
        100, 0, 0,
        30, 30, 0,
        30, 30, 0,
        100, 0, 0,
        100, 30, 0,

        // 下横
        30, 60, 0,
        67, 60, 0,
        30, 90, 0,
        30, 90, 0,
        67, 60, 0,
        67, 90, 0]),
      gl.STATIC_DRAW);
  }
}

export type GShape = 'shapeF';
