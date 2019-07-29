import { initWebGL, createProgram } from '../../shared';

import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

type ImageVertex = {
  x: number;
  y: number;
  width: number;
  height: number;
}

class ImageProcessor {
  gl: WebGLRenderingContext;
  program: WebGLProgram;

  constructor() {
    const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
    const { width, height } = canvas;

    this.gl = initWebGL(canvas);
    this.gl.viewport(0, 0, width, height);
    this.program = createProgram(this.gl, vertexShader, fragmentShader);
  }

  loadImage(src: string) {
    const image = new Image();
    image.src = src;
    image.onload = () => this.render(image);
  }

  setRectangle(gl, imageVertex: ImageVertex) {
    const { x, y, width, height } = imageVertex;
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  }

  processPosition(program: WebGLProgram, imageVertex: ImageVertex) {
    const gl = this.gl;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    this.setRectangle(gl, imageVertex);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  }

  processTexture(program: WebGLProgram) {
    const gl = this.gl;
    const textureCoord = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]);
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const textCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  processCoord(program: WebGLProgram) {
    const gl = this.gl;
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  }

  render(image: HTMLImageElement) {
    const gl = this.gl;
    const program = this.program;
    gl.useProgram(program);

    this.processPosition(program, { x: 0, y: 0, width: image.width, height: image.height });
    this.processTexture(program);
    this.processCoord(program);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

const imageProcessor = new ImageProcessor();

imageProcessor.loadImage('http://127.0.0.1:5500/dist/image-processor/images/foo.png');
