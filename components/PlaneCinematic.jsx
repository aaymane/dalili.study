'use client';

/**
 * PlaneCinematic — Canvas 2D plane renderer.
 * No WebGL dependency. Works everywhere: headless, mobile, Lighthouse.
 * Fills its parent container (set parent size to control dimensions).
 */

import { useEffect, useRef, forwardRef } from 'react';

const PlaneCinematic = forwardRef(function PlaneCinematic(
  { src = '/plane-parts/plane_alpha.png', hasAlpha = true },
  ref
) {
  const canvasRef = useRef(null);

  // Forward the canvas ref if needed externally
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') ref(canvasRef.current);
    else ref.current = canvasRef.current;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const isMobile = window.innerWidth < 768;

    let W = 0, H = 0;
    let floatT = 0, floatY = 0;
    let tiltX  = 0, tiltY  = 0;
    let mouseX = 0.5, mouseY = 0.5;
    let raf, ready = false;

    // Offscreen canvas holds the pre-processed (colour-graded) plane image
    const offscreen = document.createElement('canvas');
    const offCtx    = offscreen.getContext('2d', { willReadFrequently: true });

    // ── Resize: match canvas resolution to CSS size (handles DPR correctly)
    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width  || canvas.offsetWidth  || 300;
      H = rect.height || canvas.offsetHeight || 187;
      // Use devicePixelRatio for crisp rendering (cap at 2)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    // ── Load + process image once
    const img = new Image();
    img.src = src;
    img.onload = () => {
      offscreen.width  = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      offCtx.drawImage(img, 0, 0);

      const id   = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = id.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];

        if (hasAlpha) {
          if (data[i + 3] < 10) continue;   // already transparent → skip
        } else {
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luma > 238) { data[i + 3] = 0; continue; }
          if (luma > 212) { data[i + 3] = Math.round(((238 - luma) / 26) * 255); }
        }

        // Cool-blue space colour grade
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const avg  = (r + g + b) / 3;
        const sat  = luma > 175 ? 0.5 : 0.72;
        data[i]     = Math.round(avg + (r - avg) * sat);
        data[i + 1] = Math.round(avg + (g - avg) * sat);
        data[i + 2] = Math.min(255, Math.round(avg + (b - avg) * sat) + 20);
      }

      offCtx.putImageData(id, 0, 0);
      ready = true;
    };

    // First resize after paint so offsetWidth/Height are real
    requestAnimationFrame(() => {
      resize();
      raf = requestAnimationFrame(draw);
    });

    const resizeObs = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { resize(); })
      : null;
    if (resizeObs) resizeObs.observe(canvas);
    else window.addEventListener('resize', resize, { passive: true });

    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
      }, { passive: true });
    }

    // Throttle to ~30fps — background canvas, imperceptible at higher rate
    const FRAME_MS = 33;
    let last = performance.now();

    function draw(now) {
      raf = requestAnimationFrame(draw);
      if (now - last < FRAME_MS) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      if (!ready) return;

      // Float animation
      floatT += dt;
      const amp = isMobile ? 10 : 20;
      floatY += (Math.sin(floatT * 0.48) * amp - floatY) * 0.038;

      // Mouse tilt (desktop only)
      tiltX += ((mouseY - 0.5) * -7 - tiltX) * 0.045;
      tiltY += ((mouseX - 0.5) *  5 - tiltY) * 0.045;

      const cx = W * 0.5;
      const cy = H * 0.5 + floatY;

      // Atmospheric halo
      const haloR = Math.max(W, H) * 1.15;
      const halo  = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo.addColorStop(0,    'rgba(1,77,248,0.08)');
      halo.addColorStop(0.2,  'rgba(1,50,180,0.04)');
      halo.addColorStop(0.5,  'rgba(1,20,80,0.02)');
      halo.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Scale plane to fill container with contain logic + a bit of breathing room
      const scale = Math.min(W / offscreen.width, H / offscreen.height) * 0.94;
      const pw = offscreen.width  * scale;
      const ph = offscreen.height * scale;

      // Draw plane with perspective tilt matrix
      ctx.save();
      ctx.translate(cx, cy);
      if (!isMobile) {
        ctx.transform(
          1 + tiltY * 0.012, tiltX * 0.004,
          tiltY * 0.003,     1 + tiltX * 0.006,
          0, 0,
        );
      }
      ctx.drawImage(offscreen, -pw / 2, -ph / 2, pw, ph);
      ctx.restore();

      // Subtle blue screen-blend overlay
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const sg = ctx.createRadialGradient(cx * 0.9, cy * 0.85, 0, cx * 0.9, cy * 0.85, W * 0.4);
      sg.addColorStop(0, 'rgba(1,77,248,0.07)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx * 0.9, cy * 0.85, W * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.restore();

      // Engine glows + nav lights (desktop only to save mobile GPU)
      if (!isMobile) {
        const pulse = 0.65 + 0.35 * Math.sin(floatT * 1.7);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const e of [
          { dx: -0.26, dy: -0.04 }, { dx: -0.33, dy: -0.01 },
          { dx:  0.14, dy:  0.12 }, { dx:  0.23, dy:  0.10 },
        ]) {
          const ex = cx + e.dx * pw + tiltY * 2;
          const ey = cy + e.dy * ph + floatY * 0.6;
          const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 22);
          eg.addColorStop(0,   `rgba(100,185,255,${(0.45 * pulse).toFixed(3)})`);
          eg.addColorStop(0.6, `rgba(50,120,255,${(0.15 * pulse).toFixed(3)})`);
          eg.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(ex, ey, 22, 0, Math.PI * 2);
          ctx.fillStyle = eg;
          ctx.fill();
        }
        ctx.restore();

        const navP = 0.5 + 0.5 * Math.abs(Math.sin(floatT * 2.2));
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const w of [
          { dx: -0.45, dy: -0.02, c: '255,70,70'  },
          { dx:  0.37, dy:  0.17, c: '70,220,110' },
        ]) {
          const wx = cx + w.dx * pw + tiltY * 3;
          const wy = cy + w.dy * ph + floatY * 0.75;
          const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, 12);
          wg.addColorStop(0, `rgba(${w.c},${(0.85 * navP).toFixed(3)})`);
          wg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(wx, wy, 12, 0, Math.PI * 2);
          ctx.fillStyle = wg;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Pause when tab is hidden — saves GPU when user switches tabs
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf  = requestAnimationFrame(draw);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    // Pause when canvas is scrolled off-screen (IntersectionObserver)
    let visible = true;
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          const wasVisible = visible;
          visible = entries[0].isIntersecting;
          if (!visible) {
            cancelAnimationFrame(raf);
          } else if (!wasVisible) {
            last = performance.now();
            raf  = requestAnimationFrame(draw);
          }
        }, { rootMargin: '50% 0px' })
      : null;
    if (io) io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      if (resizeObs) resizeObs.unobserve(canvas);
      else window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (io) io.unobserve(canvas);
    };
  }, [src, hasAlpha]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  );
});

export default PlaneCinematic;
