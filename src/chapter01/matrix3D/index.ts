import { initWebGL, createProgram } from '../../shared';
import Geometry, { GShape } from './geometry';
import * as m from './matrix';
import { mat4 } from 'gl-matrix';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

import { transport, IEvents, ConfigPanel } from '../../config';

type Locations = { [key: string]: WebGLUniformLocation | GLint | null }

class Matrix3D {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  locations: Locations;
  gm: Geometry;

  constructor() {
    const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
    const { width, height } = canvas;

    this.gl = initWebGL(canvas);
    this.gl.viewport(0, 0, width, height);

    this.gm = new Geometry(this.gl);
    this.program = createProgram(this.gl, vertexShader, fragmentShader);
    this.gl.useProgram(this.program);
    this.locations = this.vertexLocations(this.program);

    this.intitial();
  }

  vertexLocations(program: WebGLProgram): Locations {
    const gl = this.gl;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    const color = [Math.random(), Math.random(), Math.random(), 1];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.uniformMatrix4fv(matrixLocation, false, m.identify());
    gl.uniform4fv(colorLocation, color);

    return {
      positionLocation,
      colorLocation,
      matrixLocation,
    }
  }

  drawScence() {
    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.gm.shapeF();
    gl.drawArrays(this.gl.TRIANGLES, 0, 18);
  }

  transform(
    x: number, y: number, z: number,
    anglex: number, angley: number, anglez: number,
    sx: number, sy: number, sz: number
  ) {
    const gl = this.gl;
    const { matrixLocation } = this.locations;

    const translateMatrix = m.translation(x, y, z);
    const rotationXMatrix = m.rotationX(anglex * 3.6 * Math.PI / 180);
    const rotationYMatrix = m.rotationY(angley * 3.6 * Math.PI / 180);
    const rotationZMatrix = m.rotationZ(anglez * 3.6 * Math.PI / 180);
    const scaleMatrix = m.scaling(sx, sy, sz);

    const pMatrix = m.projection(
      this.gl.canvas.clientWidth,
      this.gl.canvas.clientHeight,
      400
    );
    const matrix0 = mat4.multiply(mat4.create(), pMatrix, translateMatrix);
    const matrix1 = mat4.multiply(mat4.create(), matrix0, rotationXMatrix);
    const matrix2 = mat4.multiply(mat4.create(), matrix1, rotationYMatrix);
    const matrix3 = mat4.multiply(mat4.create(), matrix2, rotationZMatrix);
    const matrix4 = mat4.multiply(mat4.create(), matrix3, scaleMatrix);
    gl.uniformMatrix4fv(matrixLocation, false, matrix4);
    this.drawScence();
  }

  intitial() {
    this.transform(0, 0, 0, 0, 0, 0, 1, 1, 1);
  }
}

const matrix2d = new Matrix3D();

ConfigPanel(ConfigPanel.__S__.matrix3d);

transport.onMessage(IEvents.progress, (data) => {
  matrix2d.transform(
    data.x, data.y, data.z,
    data.anglex, data.angley, data.anglez,
    data.sx, data.sy, data.sz
  );
});


(window as any).matrix2d = matrix2d;
