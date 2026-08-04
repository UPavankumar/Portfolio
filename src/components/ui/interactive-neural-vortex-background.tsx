import { useEffect, useRef, useState } from "react";

/**
 * WebGL neural-vortex field that reacts to the cursor.
 *
 * Adapted from the 21st.dev component: the original is a full-page demo with a
 * `fixed` canvas, its own hero markup and Next-only styled-jsx. Here it is a
 * bare background layer — absolutely positioned inside its parent and
 * pointer-events-none, so it cannot affect layout or intercept clicks. Falls
 * back to a static dot grid when WebGL is unavailable.
 */
export default function InteractiveNeuralVortex({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = (canvasEl.getContext("webgl", { alpha: true, antialias: false }) ||
      canvasEl.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setFailed(true);
      return;
    }

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Palette shifted from the original purple/violet to the site's teal → sky,
    // and dimmed so headline text stays readable over it.
    const fsSource = `
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

        color = vec3(0.22, 0.74, 0.97);
        color = mix(color, vec3(0.38, 0.65, 0.98), 0.34 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
        color += vec3(0.02, 0.14, 0.28) * sin(2.0 * u_scroll_progress + 1.5);
        color = color * noise;
        gl_FragColor = vec4(color, noise * 0.80);
      }
    `;

    const compileShader = (source: string, type: number) => {
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
    };

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      setFailed(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRatio = gl.getUniformLocation(program, "u_ratio");
    const uPointerPosition = gl.getUniformLocation(program, "u_pointer_position");
    const uScrollProgress = gl.getUniformLocation(program, "u_scroll_progress");

    // CSS (absolute inset-0) owns the display size, so the canvas always
    // matches the hero box exactly; we only sync the drawing buffer to it.
    // Checked every frame because a single early measurement can be taken
    // before layout settles and would otherwise stick.
    const resizeCanvas = () => {
      const rect = canvasEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvasEl.width === w && canvasEl.height === h) return;
      canvasEl.width = w;
      canvasEl.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform1f(uRatio, w / h);
    };

    resizeCanvas();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let raf = 0;

    const draw = (time: number) => {
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;

      const rect = canvasEl.getBoundingClientRect();
      gl.uniform1f(uTime, time);
      gl.uniform2f(
        uPointerPosition,
        rect.width ? pointer.current.x / rect.width : 0.5,
        rect.height ? 1 - pointer.current.y / rect.height : 0.5
      );
      gl.uniform1f(uScrollProgress, window.scrollY / (2 * window.innerHeight));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const render = () => {
      if (visible) {
        draw(performance.now());
      }
      raf = requestAnimationFrame(render);
    };

    // Pointer coords are relative to the canvas so the highlight tracks
    // correctly regardless of where the hero sits on the page.
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      pointer.current.tX = e.clientX - rect.left;
      pointer.current.tY = e.clientY - rect.top;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvasEl.getBoundingClientRect();
      pointer.current.tX = t.clientX - rect.left;
      pointer.current.tY = t.clientY - rect.top;
    };

    if (reduced) {
      // one static frame, no loop
      pointer.current = { x: 0, y: 0, tX: 0, tY: 0 };
      draw(0);
    } else {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      raf = requestAnimationFrame(render);
    }

    window.addEventListener("resize", resizeCanvas);
    const ro = new ResizeObserver(resizeCanvas);
    if (canvasEl.parentElement) ro.observe(canvasEl.parentElement);

    // stop drawing once the hero scrolls away
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvasEl);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(vertexBuffer);
    };
  }, []);

  if (failed) {
    return <div className="dotgrid pointer-events-none absolute inset-0" aria-hidden />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
