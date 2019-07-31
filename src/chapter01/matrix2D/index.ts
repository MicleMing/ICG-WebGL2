import { initWebGL, createProgram } from '../../shared';
import Geometry, { GShape } from './geometry';
import * as m from './matrix';
import { mat3 } from 'gl-matrix';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

import { transport, IEvents } from '../../config';

type Locations = { [key: string]: WebGLUniformLocation | GLint | null }

class Matrix2D {
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

    // this.transform(0, 0);
    this.drawScence('shapeF');
  }

  vertexLocations(program: WebGLProgram): Locations {
    const gl = this.gl;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    const color = [Math.random(), Math.random(), Math.random(), 1];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniformMatrix3fv(matrixLocation, false, m.identify());
    gl.uniform4fv(colorLocation, color);

    return {
      positionLocation,
      colorLocation,
      resolutionLocation,
      matrixLocation,
    }
  }

  drawScence(shape: GShape) {
    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    switch (shape) {
      case 'rectangle':
        this.gm.rectangle();
        gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        break;
      case 'shapeF':
        this.gm.shapeF();
        gl.drawArrays(this.gl.TRIANGLES, 0, 18);
        break;
      default:
    }
  }

  transform(x: number, y: number, angle: number, sx: number, sy: number, shape: GShape = 'shapeF') {
    const gl = this.gl;
    const { matrixLocation } = this.locations;

    const translateMatrix = m.translation(x, y);
    const rotationMatrix = m.rotation(angle * 3.6 * Math.PI / 180);
    const scaleMatrix = m.scaling(sx, sy);
    const matrix1 = mat3.multiply(mat3.create(), translateMatrix, scaleMatrix);
    const matrix2 = mat3.multiply(mat3.create(), matrix1, rotationMatrix);
    gl.uniformMatrix3fv(matrixLocation, false, matrix2);
    this.drawScence(shape);
  }
}

const matrix2d = new Matrix2D();

transport.onMessage(IEvents.progress, (data) => {
  matrix2d.transform(data.x, data.y, data.angle, data.sx, data.sy);
});


(window as any).matrix2d = matrix2d;
