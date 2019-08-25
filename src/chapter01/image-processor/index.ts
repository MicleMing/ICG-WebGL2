import { initWebGL, createProgram } from '../../shared';
import kernels, { IKenel } from './kernels';

import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';
import kenels from './kernels';

import { transport, IEvents, ConfigPanel } from '../../config';

function computeKernelWeight(kernel: number[]): number {
  const weight = kernel.reduce((prev, curr) => {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

type ImageVertex = {
  x: number;
  y: number;
  width: number;
  height: number;
}

class ImageProcessor {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniforms: { [key: string]: WebGLUniformLocation | null }

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

  // TODO
  createTextureFrameBuffers(
    gl: WebGLRenderingContext,
    kernels: IKenel[],
    image: HTMLImageElement
  ) {
    const textures: WebGLTexture[] = [];
    const fBuffers: WebGLFramebuffer[] = [];
    kernels.forEach((kernel) => {
      const texture = this.createTexture(gl);
      textures.push(texture);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
      const buffer = gl.createFramebuffer() as WebGLFramebuffer;
      fBuffers.push(buffer);
      gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    });
  }

  applyKernel(kernel: IKenel) {
    const gl = this.gl;
    const uniforms = this.uniforms;
    const kernelVec = kernels[kernel];
    gl.uniform1fv(uniforms.kernelLocation, kernelVec);
    gl.uniform1f(uniforms.kernelWeightLocation, computeKernelWeight(kernelVec));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  createTexture(gl: WebGLRenderingContext): WebGLTexture {
    // create texture
    const texture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
  }

  processPosition(program: WebGLProgram, image: HTMLImageElement) {
    const gl = this.gl;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    const imageVertex: ImageVertex = {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    };

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
  }

  processUniform(program: WebGLProgram, image: HTMLImageElement) {
    const gl = this.gl;
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    const textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
    gl.uniform2f(textureSizeLocation, image.width, image.height);

    const kernelLocation = gl.getUniformLocation(program, "u_kernel");
    const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
    gl.uniform1fv(kernelLocation, kenels['normal']);
    gl.uniform1f(kernelWeightLocation, computeKernelWeight(kenels['normal']));

    const flipYLocation = gl.getUniformLocation(program, "u_flipY");
    gl.uniform1f(flipYLocation, -1);

    return {
      resolutionLocation,
      textureSizeLocation,
      kernelLocation,
      kernelWeightLocation,
      flipYLocation,
    }
  }

  render(image: HTMLImageElement) {
    const gl = this.gl;
    const program = this.program;
    gl.useProgram(program);

    this.processPosition(program, image);
    this.processTexture(program);
    this.uniforms = this.processUniform(program, image);

    this.createTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);

    this.applyKernel('normal');
  }
}

const imageProcessor = new ImageProcessor();

imageProcessor.loadImage('http://127.0.0.1:5500/dist/image-processor/images/foo.png');

ConfigPanel(ConfigPanel.__S__.image2d);
transport.onMessage(IEvents.progress, (data) => {
  console.log(data);
  const kenel = data.select;
  imageProcessor.applyKernel(kenel);
});
