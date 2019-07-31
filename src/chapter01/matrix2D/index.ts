import { initWebGL, createProgram } from '../../shared';
import Geometry, { GShape } from './geometry';
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

    this.translate(0, 0);
  }

  vertexLocations(program: WebGLProgram): Locations {
    const gl = this.gl;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const translationLocation = gl.getUniformLocation(program, 'u_translation');
    const color = [Math.random(), Math.random(), Math.random(), 1];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2fv(translationLocation, [0, 0]);
    gl.uniform4fv(colorLocation, color);

    return {
      positionLocation,
      colorLocation,
      resolutionLocation,
      translationLocation,
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

  translate(x: number, y: number, shape: GShape = 'shapeF') {
    const gl = this.gl;
    const { translationLocation } = this.locations;
    gl.uniform2f(translationLocation, x, y);
    this.drawScence(shape);
  }
}

const matrix2d = new Matrix2D();

transport.onMessage(IEvents.progress, (data) => {
  matrix2d.translate(data.x, data.y);
});


(window as any).matrix2d = matrix2d;
