'use client';

/**
 * PlaneCinematic — Canvas luma-key plane renderer
 * Strips white JPEG bg, applies space colour grade, engine glow, wing-tip lights.
 * Parent div handles GSAP positioning; this canvas handles internal float + tilt.
 */

import { useEffect, useRef, forwardRef } from 'react';

const PlaneCinematic = forwardRef(function PlaneCinematic({ src = '/plane-parts/1.jpg' }, ref) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') ref(canvasRef.current);
      else ref.current = canvasRef.current;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let W = canvas.offsetWidth  || window.innerWidth;
    let H = canvas.offsetHeight || window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    let floatT  = 0, floatY  = 0;
    let tiltX   = 0, tiltY   = 0;
    let tTiltX  = 0, tTiltY  = 0;
    let mouseX  = 0.5, mouseY = 0.5;
    let raf, ready = false;

    const offscreen = document.createElement('canvas');
    const offCtx    = offscreen.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.src = src;
    img.onload = () => {
      offscreen.width  = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      offCtx.drawImage(img, 0, 0);

      const id   = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = id.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const luma = 0.299*r + 0.587*g + 0.114*b;

        // Soft luma key: near-white pixels become transparent
        if (luma > 238) { data[i+3] = 0; continue; }
        if (luma > 212) { data[i+3] = Math.round(((238 - luma) / 26) * 255); }

        // Cool blue colour grade (feels like space lighting)
        const avg = (r + g + b) / 3;
        const sat = luma > 175 ? 0.5 : 0.72;
        data[i]     = Math.round(avg + (r - avg) * sat);
        data[i+1]   = Math.round(avg + (g - avg) * sat);
        data[i+2]   = Math.min(255, Math.round(avg + (b - avg) * sat) + 20);
      }

      offCtx.putImageData(id, 0, 0);
      ready = true;
    };

    function resize() {
      W = canvas.offsetWidth  || window.innerWidth;
      H = canvas.offsetHeight || window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    }
    window.addEventListener('resize', resize, { passive: true });

    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
      }, { passive: true });
    }

    let last = performance.now();

    function draw(now) {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, W, H);
      if (!ready) return;

      // Smooth float
      floatT += dt;
      const targetFloat = Math.sin(floatT * 0.48) * 22;
      floatY += (targetFloat - floatY) * 0.038;

      // Smooth tilt
      tTiltX = (mouseY - 0.5) * -7;
      tTiltY = (mouseX - 0.5) *  5;
      tiltX  += (tTiltX - tiltX) * 0.045;
      tiltY  += (tTiltY - tiltY) * 0.045;

      const cx = W * 0.5;
      const cy = H * 0.5 + floatY;

      // ── Atmospheric halo — very large and subtle so edges are invisible
      // Uses arc instead of fillRect to avoid rectangular seams
      const haloR = Math.max(W, H) * 1.1;
      const halo  = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo.addColorStop(0,    'rgba(1,77,248,0.07)');
      halo.addColorStop(0.18, 'rgba(1,50,180,0.04)');
      halo.addColorStop(0.40, 'rgba(1,20,80,0.02)');
      halo.addColorStop(0.65, 'rgba(1,5,16,0.005)');
      halo.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // ── Draw plane with perspective tilt
      const scale = Math.min(W, H) / Math.max(offscreen.width, offscreen.height) * 0.92;
      const pw = offscreen.width  * scale;
      const ph = offscreen.height * scale;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.transform(
        1 + tiltY * 0.012,
        tiltX * 0.004,
        tiltY * 0.003,
        1 + tiltX * 0.006,
        0, 0,
      );
      ctx.drawImage(offscreen, -pw/2, -ph/2, pw, ph);
      ctx.restore();

      // ── Blue cinematic screen overlay (subtle atmospheric tint)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const sg = ctx.createRadialGradient(cx * 0.9, cy * 0.9, 0, cx * 0.9, cy * 0.9, W * 0.35);
      sg.addColorStop(0, 'rgba(1,77,248,0.07)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx * 0.9, cy * 0.9, W * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.restore();

      // ── Engine glow spots (4 engines, 747 positions relative to 1.jpg)
      const pulse = 0.65 + 0.35 * Math.sin(floatT * 1.7);
      const engines = [
        { dx: -0.26, dy: -0.04 },
        { dx: -0.33, dy: -0.01 },
        { dx:  0.14, dy:  0.12 },
        { dx:  0.23, dy:  0.10 },
      ];
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const e of engines) {
        const ex = cx + e.dx * pw + tiltY * 2;
        const ey = cy + e.dy * ph + floatY * 0.6;
        const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 22);
        eg.addColorStop(0, `rgba(100,185,255,${(0.45 * pulse).toFixed(3)})`);
        eg.addColorStop(0.6, `rgba(50,120,255,${(0.15 * pulse).toFixed(3)})`);
        eg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(ex, ey, 22, 0, Math.PI * 2);
        ctx.fillStyle = eg;
        ctx.fill();
      }
      ctx.restore();

      // ── Wing-tip nav lights (red left / green right, pulsing)
      const navP = 0.5 + 0.5 * Math.abs(Math.sin(floatT * 2.2));
      const wingtips = [
        { dx: -0.45, dy: -0.02, c: '255,70,70'  },
        { dx:  0.37, dy:  0.17, c: '70,220,110' },
      ];
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const w of wingtips) {
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

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
});

export default PlaneCinematic;
