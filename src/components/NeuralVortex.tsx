import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const VERTEX_SHADER = `
  precision mediump float;
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;

  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }

  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;
    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.);
      sine_acc = rotate(sine_acc, 1.);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer) + 2.4 * p;
      res += (.5 + .5 * cos(layer)) / scale;
      scale *= (1.2);
    }
    return res.x + res.y;
  }

  void main() {
    vec2 uv = .5 * vUv;
    uv.x *= u_ratio;
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0., 1.);
    p = .5 * pow(1. - p, 2.);
    float t = .001 * u_time;
    vec3 color = vec3(0.);
    float noise = neuro_shape(uv, t, p);
    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);
    noise *= (1. - length(vUv - .5));

    // Obzidian Labs ember palette: deep amber core drifting into bright orange
    color = vec3(0.85, 0.32, 0.06);
    color = mix(color, vec3(1.0, 0.62, 0.18), 0.35 + 0.18 * sin(2.0 * u_scroll_progress + 1.2));
    color += vec3(0.35, 0.12, 0.0) * sin(2.0 * u_scroll_progress + 1.5);
    color = color * noise;
    gl_FragColor = vec4(color, noise);
  }
`;

function compileShader(gl: WebGLRenderingContext, source: string, type: number) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function NeuralVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = (canvasEl.getContext("webgl") ||
      canvasEl.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShader = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRatio = gl.getUniformLocation(program, "u_ratio");
    const uPointerPosition = gl.getUniformLocation(program, "u_pointer_position");
    const uScrollProgress = gl.getUniformLocation(program, "u_scroll_progress");

    const resizeCanvas = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
      canvasEl.width = canvasEl.clientWidth * devicePixelRatio;
      canvasEl.height = canvasEl.clientHeight * devicePixelRatio;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      gl.uniform1f(uRatio, canvasEl.width / canvasEl.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const getScrollProgress = () => {
      const rect = canvasEl.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    };

    const render = () => {
      const currentTime = performance.now();

      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(
        uPointerPosition,
        pointer.current.x / canvasEl.clientWidth,
        1 - pointer.current.y / canvasEl.clientHeight,
      );
      gl.uniform1f(uScrollProgress, getScrollProgress() * 2);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      pointer.current.tX = e.clientX - rect.left;
      pointer.current.tY = e.clientY - rect.top;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const rect = canvasEl.getBoundingClientRect();
        pointer.current.tX = e.touches[0].clientX - rect.left;
        pointer.current.tY = e.touches[0].clientY - rect.top;
      }
    };

    canvasEl.addEventListener("pointermove", handlePointerMove);
    canvasEl.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvasEl.removeEventListener("pointermove", handlePointerMove);
      canvasEl.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <section id="vision" className="relative min-h-screen w-full overflow-hidden bg-obsidian">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(6,5,4,0.7)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-dark w-full rounded-3xl px-8 py-14 sm:px-14"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-ember-300">
            THE OBZIDIAN EDGE
          </span>
          <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Intelligence, woven into every workflow.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
           Behind every solution we build is a focus on solving real business problems - 
           from custom 3D websites and tailored software systems to AI-powered n8n workflows that 
           automate repetitive tasks and improve efficiency. 
           This is what it looks like when AI stops being a feature and becomes
            the engine.
          </p>
          <a
            href="#contact"
            className="mt-9 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-ember-500 to-ember-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-6px_rgba(249,115,22,0.65)] transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
          >
            Book a strategy call
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
