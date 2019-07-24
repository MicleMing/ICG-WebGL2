import { initWebGL, createProgram } from '../../shared';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

class Triangle {
  gl: WebGLRenderingContext;
  constructor() {
    const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
    const { width, height } = canvas;

    this.gl = initWebGL(canvas);
    this.gl.viewport(0, 0, width, height);
  }

  initVertexBuffers() {
    const gl = this.gl;
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const vertex = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5,
    ]);

    const vertexColors = new Float32Array([
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,
    ]);


    // vertex
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // vertex color
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

  }

  draw() {
    this.initVertexBuffers();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

const triangle = new Triangle();

triangle.draw();
