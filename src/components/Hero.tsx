import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FRAME_COUNT = 26;
const START_DELAY_MS = 2000;
const PASS_DURATION_MS = 2000; // one forward sweep; round trip (there + back) is well under the original 5s clip
const frameSrc = (i: number) => `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const isPausedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [pauseCapable, setPauseCapable] = useState(false);

  // Only mouse/trackpad users get the hover-to-pause interaction; on touch
  // devices the animation just loops continuously.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setPauseCapable(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index - 1];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.fillStyle = "#060504";
    ctx.fillRect(0, 0, cw, ch);

    // cover-fit placement of the source frame within the canvas
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) {
      dh = ch;
      dw = ch * ir;
      dx = (cw - dw) / 2;
      dy = 0;
    } else {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);

    // mask the small watermark baked into the source frames' top-right corner
    ctx.fillStyle = "#060504";
    ctx.fillRect(dx + dw * 0.8, dy, dw * 0.2, dh * 0.12);
  };

  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img.onload = () => {
        loadedCount += 1;
        if (i === 1) draw(1);
        if (loadedCount === FRAME_COUNT) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;

    const onResize = () => draw(currentFrameRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoplaying ping-pong loop: forward through all frames, then back, forever.
  // Starts a couple seconds after the frames are ready rather than on scroll.
  // Time only accrues while not paused, so hovering freezes the current frame
  // in place and resumes smoothly from there rather than jumping ahead.
  useEffect(() => {
    if (!ready) return;
    let rafId = 0;
    let lastTimestamp: number | null = null;
    let virtualElapsed = 0;

    const tick = (now: number) => {
      if (lastTimestamp === null) lastTimestamp = now;
      const delta = now - lastTimestamp;
      lastTimestamp = now;
      if (!isPausedRef.current) {
        virtualElapsed += delta;
      }

      const cycle = PASS_DURATION_MS * 2;
      const elapsed = virtualElapsed % cycle;
      const frameFloat =
        elapsed < PASS_DURATION_MS
          ? 1 + (elapsed / PASS_DURATION_MS) * (FRAME_COUNT - 1)
          : FRAME_COUNT - ((elapsed - PASS_DURATION_MS) / PASS_DURATION_MS) * (FRAME_COUNT - 1);
      const frame = Math.round(frameFloat);
      currentFrameRef.current = frame;
      draw(frame);
      rafId = requestAnimationFrame(tick);
    };

    const timeoutId = window.setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [ready]);

  return (
    <section
      id="top"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-obsidian"
    >
      <div className="absolute inset-0 m-auto aspect-video w-full max-w-[960px] max-h-[80vh]">
        {!ready && (
          <img
            src={frameSrc(1)}
            alt="Obzidian Labs"
            className="absolute inset-0 h-full w-full object-contain opacity-[0.85]"
          />
        )}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            ready ? "opacity-[0.85]" : "opacity-0"
          }`}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(249,115,22,0.18),transparent_60%)]" />

      {pauseCapable && (
        <div
          aria-hidden="true"
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
          className="absolute inset-0 z-20 m-auto aspect-video w-full max-w-[960px] max-h-[80vh]"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <span className="mb-5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-ember-300 backdrop-blur-md">
          AI CONSULTING &amp; ENGINEERING
        </span>
        <h1 className="font-heading text-4xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl">
          We build the <span className="text-gradient-ember">gravity</span>
          <br className="hidden sm:block" /> behind your product.
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/60 sm:text-lg">
          Obzidian Labs designs 3D web experiences, custom software, and AI systems
          that pull your business into its next orbit.
        </p>
      </motion.div>

      <div className="absolute bottom-9 z-10 flex flex-col items-center gap-2 text-white/40">
        <span className="text-[11px] font-medium tracking-[0.3em]">SCROLL</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </div>
    </section>
  );
}
