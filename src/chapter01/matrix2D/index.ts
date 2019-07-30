import { initWebGL, createProgram } from '../../shared';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

type Locations = { [key: string]: WebGLUniformLocation | GLint | null }

class Matrix2D {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  locations: Locations;

  constructor() {
    const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
    const { width, height } = canvas;

    this.gl = initWebGL(canvas);
    this.gl.viewport(0, 0, width, height);

    this.program = createProgram(this.gl, vertexShader, fragmentShader);
    this.gl.useProgram(this.program);
    this.locations = this.vertexLocations(this.program);

    this.drawScence([0, 0]);
  }

  vertexLocations(program: WebGLProgram): Locations {
    const gl = this.gl;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const color = [Math.random(), Math.random(), Math.random(), 1];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4fv(colorLocation, color);

    return {
      positionLocation,
      colorLocation,
      resolutionLocation,
    }
  }

  drawScence(translation: number[], width: number = 100, height: number = 30) {
    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawRect(translation[0], translation[1], width, height);
    gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  drawRect(x: number, y: number, width: number, height: number) {
    const gl = this.gl;
    const x1 = x;
    const y1 = y;
    const x2 = x + width;
    const y2 = y + height;

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
}

const matrix2d = new Matrix2D();

(window as any).matrix2d = matrix2d;
