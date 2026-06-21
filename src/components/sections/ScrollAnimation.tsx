'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

/* ─── Configuration ─────────────────────────────────────── */
const TOTAL_FRAMES = 34;
const SCROLL_HEIGHT_VH = 180; // virtual scroll distance (multiples of viewport height)
const FADE_START = 0.85;       // start fading at 85 % scroll progress

/* ─── Helpers ───────────────────────────────────────────── */
const zeroPad = (n: number, width = 3) => String(n).padStart(width, '0');
const frameUrl = (i: number) => `/video_frames/ezgif-frame-${zeroPad(i)}.jpg`;

/* ─── Component ─────────────────────────────────────────── */
export const ScrollAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  const imagesCache      = useRef<Record<number, HTMLImageElement>>({});
  const progressRef      = useRef(0);
  const rafPendingRef    = useRef(false);
  const reducedMotionRef = useRef(false);

  const [isReady,     setIsReady]     = useState(false); // first frame loaded
  const [loadingDone, setLoadingDone] = useState(false); // all frames cached
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ── draw-cover: scale image to fill canvas, centred ─── */
  const drawCover = (
    canvas: HTMLCanvasElement,
    ctx:    CanvasRenderingContext2D,
    img:    HTMLImageElement,
  ) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth  || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const cr = cw / ch;
    const ir = iw / ih;
    let dx: number, dy: number, dw: number, dh: number;

    if (ir > cr) {
      dh = ch; dw = ch * ir;
      dx = (cw - dw) / 2; dy = 0;
    } else {
      dw = cw; dh = cw / ir;
      dx = 0;  dy = (ch - dh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  /* ── paint: pick the right cached frame and draw it ──── */
  const paint = () => {
    rafPendingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = progressRef.current;
    const targetIdx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(p * (TOTAL_FRAMES - 1)) + 1));

    // Try exact frame, fall back to nearest available
    let img = imagesCache.current[targetIdx];
    if (!img) {
      let best = -1, bestDist = Infinity;
      for (const key in imagesCache.current) {
        const d = Math.abs(Number(key) - targetIdx);
        if (d < bestDist) { bestDist = d; best = Number(key); }
      }
      if (best !== -1) img = imagesCache.current[best];
    }

    if (img && img.complete && img.naturalWidth) {
      drawCover(canvas, ctx, img);
    }

    // Fade out in the last FADE_START–100 % window
    if (p > FADE_START) {
      const t = (p - FADE_START) / (1 - FADE_START);
      canvas.style.opacity = String((1 - t).toFixed(3));
    } else {
      canvas.style.opacity = '1';
    }
  };

  /* ── schedule a single RAF paint ─────────────────────── */
  const schedulePaint = () => {
    if (rafPendingRef.current) return;
    rafPendingRef.current = true;
    requestAnimationFrame(paint);
  };

  /* ── resize: sync canvas buffer to CSS size × DPR ────── */
  const syncCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    // Only resize if dimensions actually changed (avoids thrashing)
    const newW = Math.round(rect.width  * dpr);
    const newH = Math.round(rect.height * dpr);
    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width  = newW;
      canvas.height = newH;
    }
    schedulePaint();
  };

  /* ── scroll handler ──────────────────────────────────── */
  const onScroll = () => {
    if (reducedMotionRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const { top, height } = container.getBoundingClientRect();
    const winH = window.innerHeight;

    // progress: 0 when top of container is at viewport top → 1 when bottom reaches viewport bottom
    const scrollable = height - winH;
    const scrolled   = -top; // positive when scrolled down past container top
    const p = scrollable > 0 ? Math.max(0, Math.min(1, scrolled / scrollable)) : 0;

    progressRef.current = p;
    setScrollProgress(p);
    schedulePaint();
  };

  /* ── Main effect: preload + bind events ─────────────── */
  useEffect(() => {
    // Reduced-motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const onMQChange = (e: MediaQueryListEvent) => { reducedMotionRef.current = e.matches; };
    mq.addEventListener('change', onMQChange);

    // Load frame 1 immediately so the canvas isn't blank
    const seed = new Image();
    seed.src = frameUrl(1);
    seed.onload = () => {
      imagesCache.current[1] = seed;
      syncCanvasSize(); // also triggers first paint
      setIsReady(true);
    };

    // Background-load all remaining frames in batches
    const BATCH = 12;
    let cancelled = false;

    (async () => {
      for (let start = 2; start <= TOTAL_FRAMES && !cancelled; start += BATCH) {
        const end = Math.min(TOTAL_FRAMES, start + BATCH - 1);
        await Promise.all(
          Array.from({ length: end - start + 1 }, (_, i) =>
            new Promise<void>((resolve) => {
              const idx = start + i;
              const img = new Image();
              img.src = frameUrl(idx);
              img.onload  = () => { imagesCache.current[idx] = img; resolve(); };
              img.onerror = () => resolve(); // silently skip missing frames
            })
          )
        );
        // Repaint after each batch so late-arriving frames are visible
        if (!cancelled) schedulePaint();
      }
      if (!cancelled) setLoadingDone(true);
    })();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncCanvasSize);

    return () => {
      cancelled = true;
      mq.removeEventListener('change', onMQChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncCanvasSize);
    };
  }, []); // intentionally empty – all handlers use refs, not state

  /* ─── Reduced-motion: static fallback ───────────────── */
  const [showReducedUI, setShowReducedUI] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShowReducedUI(mq.matches);
    const h = (e: MediaQueryListEvent) => setShowReducedUI(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  if (showReducedUI) {
    return (
      <section
        id="showreel"
        className="relative w-full h-screen bg-[#09090A] flex flex-col items-center justify-center overflow-hidden border-y border-[#7F7F7F]/20"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/video_frames/ezgif-frame-001.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090A]/80 via-[#09090A]/40 to-[#09090A]/80 z-10" />
        <OverlayCopy />
      </section>
    );
  }

  /* ─── Full scroll animation ──────────────────────────── */
  return (
    <section
      id="showreel"
      ref={containerRef}
      className="relative w-full bg-[#09090A] border-y border-[#7F7F7F]/20"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Canvas — fills the sticky viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'opacity', transition: 'opacity 0.3s ease' }}
        />

        {/* Cinematic top-and-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090A]/80 via-transparent to-[#09090A]/80 z-10 pointer-events-none" />

        {/* Overlay copy — always centred, always readable */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <OverlayCopy />
        </div>

        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-[#FFFFFF]/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00A651] to-[#FFD700]"
            style={{ width: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        </div>

        {/* Loading pill (top-centre, disappears once all frames are cached) */}
        <AnimatePresence>
          {!loadingDone && (
            <motion.div
              className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#09090A]/80 border border-[#3F3F46] px-3 py-1.5 rounded-full backdrop-blur-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 0.3 }}
            >
              <span className="w-2.5 h-2.5 border-2 border-[#00A651] border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#A1A1AA]">
                Loading…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle scroll cue — fades out once the user starts scrolling */}
        <AnimatePresence>
          {isReady && scrollProgress < 0.05 && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#A1A1AA]">Scroll</span>
              <motion.svg
                width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#00A651]"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M7 1v12M7 13l-4-4M7 13l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─── Overlay Copy (shared between both render paths) ───── */
const OverlayCopy: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-4xl mx-auto px-6 text-center space-y-6 md:space-y-8 pointer-events-none">
      <motion.h2
        className={[
          'font-display font-light leading-[1.1] tracking-tight',
          'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
          'text-[#F4F4F5]',
          'drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]',
        ].join(' ')}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Promoting a Culture of{' '}
        <br className="hidden md:inline" />
        <em className="not-italic text-[#00A651]">Regular Savings</em> and{' '}
        <br className="hidden md:inline" />
        Collective Investments.
      </motion.h2>

      <motion.p
        className="font-sans font-light text-[#A1A1AA] text-sm md:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
      >
        To promote financial responsibility and transparent management for sustainable wealth creation and economic empowerment.
      </motion.p>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 pt-2 pointer-events-auto"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
      >
        <motion.a
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono text-[10px] tracking-widest uppercase font-bold bg-[#00A651] text-white hover:bg-[#008741] transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Become a Member <ArrowRight className="w-4 h-4" />
        </motion.a>
        <motion.a
          href="#manifesto"
          className="px-6 py-3 rounded font-mono text-[10px] tracking-widest uppercase border border-white/25 text-white hover:bg-white/10 hover:border-[#00A651] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.a>
      </motion.div>
    </div>
  );
};
