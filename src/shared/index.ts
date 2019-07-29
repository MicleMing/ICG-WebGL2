import { vec3, vec4 } from 'gl-matrix';

export function create3DContext(canvas: HTMLCanvasElement, opt_attribs?: Object): WebGLRenderingContext {
  let context: WebGLRenderingContext;
  context = canvas.getContext('webgl', opt_attribs) as WebGLRenderingContext;
  return context;
}

export function initWebGL(canvas: HTMLCanvasElement, opt_attribs?: Object): WebGLRenderingContext {
  const context = create3DContext(canvas, opt_attribs);
  return context;
}

export function createProgram(gl: WebGLRenderingContext, vertex: string, fragment: string): WebGLProgram {
  // vertex shader
  const vertShdr = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
  gl.shaderSource(vertShdr, vertex);
  gl.compileShader(vertShdr);
  if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
    const msg = `Vertex shader failed to compile.  The error log is:${gl.getShaderInfoLog(vertShdr)}`;
    console.error(msg);
    return -1;
  }

  // fragment shader
  const fragShdr = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
  gl.shaderSource(fragShdr, fragment);
  gl.compileShader(fragShdr);

  if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
    const msg = `Fragment shader failed to compile.  The error log is:${gl.getShaderInfoLog(fragShdr)}`;
    console.error(msg);
    return -1;
  }

  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const msg = `Shader program failed to link.  The error log is:${gl.getProgramInfoLog(program)}`;
    console.error(msg);
    return -1;
  }

  return program;
}

export function pointsToBuffer(points, Type = Float32Array) {
  const deminsion = points[0].length;
  const len = points.length;
  const buffer = new Type(deminsion * len);
  let idx = 0;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < deminsion; j++) {
      buffer[idx++] = points[i][j];
    }
  }
  return buffer;
}

const colorCache = {
  fv3: {},
  fv4: {},
  uv3: {},
  uv4: {},
};
export function parseColor(colorStr, type = 'fv4') {
  if (colorCache[type][colorStr]) {
    return colorCache[type][colorStr];
  }
  const r = parseInt(colorStr.charAt(1) + colorStr.charAt(2), 16);
  const g = parseInt(colorStr.charAt(3) + colorStr.charAt(4), 16);
  const b = parseInt(colorStr.charAt(5) + colorStr.charAt(6), 16);

  let color;
  if (type === 'fv3') {
    color = vec3.fromValues(r / 255, g / 255, b / 255);
  } else if (type === 'fv4') {
    color = vec4.fromValues(r / 255, g / 255, b / 255, 1.0);
  } else if (type === 'uv3') {
    color = new Uint8Array([r, g, b]);
  } else {
    color = new Uint8Array([r, g, b, 255]);
  }
  colorCache[type][colorStr] = color;
  return colorCache[type][colorStr];
}
