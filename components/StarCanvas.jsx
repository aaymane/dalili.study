'use client';

import { useEffect, useRef } from 'react';

// Three depth layers: far / mid / near — reduced for perf
const LAYERS = [
  { count: 900,  rMin: 0.15, rMax: 0.7,  twinkleAmp: 0.25, parallax: 0.012 },
  { count: 350,  rMin: 0.35, rMax: 1.2,  twinkleAmp: 0.40, parallax: 0.030 },
  { count: 150,  rMin: 0.6,  rMax: 2.0,  twinkleAmp: 0.55, parallax: 0.055 },
];

const WARM = ['255,248,230', '255,252,210', '255,255,255'];
const COOL = ['210,228,255', '195,220,255', '220,240,255', '255,255,255'];

// Nebula blobs — static, cached on OffscreenCanvas
const NEBULAE = [
  { rx: 0.12, ry: 0.22, r: 340, color: 'rgba(1,77,248,0.045)' },
  { rx: 0.80, ry: 0.60, r: 260, color: 'rgba(31,40,80,0.09)'  },
  { rx: 0.48, ry: 0.78, r: 220, color: 'rgba(1,60,200,0.035)' },
  { rx: 0.70, ry: 0.12, r: 190, color: 'rgba(50,80,200,0.04)' },
  { rx: 0.22, ry: 0.68, r: 170, color: 'rgba(1,40,150,0.04)'  },
  { rx: 0.90, ry: 0.30, r: 150, color: 'rgba(1,77,248,0.03)'  },
];

/** Build a cached OffscreenCanvas with all nebula blobs painted once. */
function buildNebulaCache(W, H) {
  const oc  = new OffscreenCanvas(W, H);
  const octx = oc.getContext('2d');
  for (const neb of NEBULAE) {
    const nx  = neb.rx * W;
    const ny  = neb.ry * H;
    const grd = octx.createRadialGradient(nx, ny, 0, nx, ny, neb.r);
    grd.addColorStop(0, neb.color);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    octx.beginPath();
    octx.arc(nx, ny, neb.r, 0, Math.PI * 2);
    octx.fillStyle = grd;
    octx.fill();
  }
  return oc;
}

export default function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const factor   = isMobile ? 0.4 : 1;

    let W = 0, H = 0;
    let nebulaCache = null;
    let mouseX = 0.5, mouseY = 0.5;
    let smX = 0.5, smY = 0.5;
    let raf;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      mouseX = 0.5;
      mouseY = 0.5;
      // Rebuild nebula cache at new size
      nebulaCache = buildNebulaCache(W, H);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / W;
        mouseY = e.clientY / H;
      }, { passive: true });
    }

    // Build star layers
    const layers = LAYERS.map((cfg) => ({
      ...cfg,
      stars: Array.from({ length: Math.floor(cfg.count * factor) }, () => {
        const palette = Math.random() < 0.55 ? COOL : WARM;
        return {
          x:     Math.random(),
          y:     Math.random(),
          r:     cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin),
          base:  0.25 + Math.random() * 0.75,
          speed: (0.6 + Math.random() * 4.5) * 0.0009,
          phase: Math.random() * Math.PI * 2,
          color: palette[Math.floor(Math.random() * palette.length)],
        };
      }),
    }));

    // Shooting star state
    let shoot     = null;
    let nextShoot = Date.now() + 3000 + Math.random() * 5000;

    function launchShoot() {
      const ang = -Math.PI / 8 + Math.random() * (Math.PI / 4);
      const spd = 850 + Math.random() * 550;
      shoot = {
        x:    W * (0.05 + Math.random() * 0.6),
        y:    H * (0.02 + Math.random() * 0.35),
        vx:   Math.cos(ang) * spd,
        vy:   Math.sin(ang) * spd,
        life: 0,
        dur:  0.45 + Math.random() * 0.25,
        len:  70 + Math.random() * 70,
      };
    }

    let last   = performance.now();
    // Target ~30 fps for the background canvas — imperceptible at this density
    const FRAME_MS = 33;

    function draw(now) {
      raf = requestAnimationFrame(draw);

      // Throttle: skip if not enough time elapsed (targets ~30fps)
      if (now - last < FRAME_MS) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      smX += (mouseX - smX) * 0.04;
      smY += (mouseY - smY) * 0.04;
      const mx = smX - 0.5;
      const my = smY - 0.5;

      ctx.clearRect(0, 0, W, H);

      // ── Nebulae: blit cached offscreen (6 gradients pre-rendered, free!)
      if (nebulaCache) ctx.drawImage(nebulaCache, 0, 0);

      // ── Aurora blobs — arc-clipped, NOT fillRect(0,0,W,H) for speed
      const t   = now * 0.00012;
      const a1x = W * (0.18 + 0.03 * Math.sin(t * 0.7));
      const a1y = H * (0.62 + 0.04 * Math.cos(t * 0.5));
      const ab1 = ctx.createRadialGradient(a1x, a1y, 0, a1x, a1y, W * 0.36);
      ab1.addColorStop(0, 'rgba(1,77,248,0.065)');
      ab1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ab1;
      ctx.beginPath();
      ctx.arc(a1x, a1y, W * 0.36, 0, Math.PI * 2);
      ctx.fill();

      const a2x = W * (0.82 + 0.03 * Math.cos(t * 0.6));
      const a2y = H * (0.35 + 0.04 * Math.sin(t * 0.4));
      const ab2 = ctx.createRadialGradient(a2x, a2y, 0, a2x, a2y, W * 0.28);
      ab2.addColorStop(0, 'rgba(31,40,80,0.10)');
      ab2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ab2;
      ctx.beginPath();
      ctx.arc(a2x, a2y, W * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // ── Stars per layer
      for (const layer of layers) {
        const ox = mx * layer.parallax * W;
        const oy = my * layer.parallax * H;

        for (const s of layer.stars) {
          const opacity = reduced
            ? s.base
            : Math.max(0.04, Math.min(1, s.base + layer.twinkleAmp * Math.sin(now * s.speed + s.phase)));

          const sx = ((s.x * W + ox) % W + W) % W;
          const sy = ((s.y * H + oy) % H + H) % H;

          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${opacity.toFixed(3)})`;
          ctx.fill();
        }
      }

      // ── Shooting star
      if (!reduced) {
        if (!shoot && Date.now() >= nextShoot) launchShoot();
        if (shoot) {
          shoot.life += dt;
          const p = shoot.life / shoot.dur;
          if (p >= 1) {
            shoot = null;
            nextShoot = Date.now() + 3500 + Math.random() * 6000;
          } else {
            const alpha = p < 0.5 ? p * 2 : 2 - p * 2;
            shoot.x += shoot.vx * dt;
            shoot.y += shoot.vy * dt;
            const ang = Math.atan2(shoot.vy, shoot.vx);
            const tx  = shoot.x - Math.cos(ang) * shoot.len;
            const ty  = shoot.y - Math.sin(ang) * shoot.len;
            const grd = ctx.createLinearGradient(tx, ty, shoot.x, shoot.y);
            grd.addColorStop(0,   'rgba(255,255,255,0)');
            grd.addColorStop(0.7, `rgba(200,225,255,${(alpha * 0.35).toFixed(3)})`);
            grd.addColorStop(1,   `rgba(255,255,255,${(alpha * 0.9).toFixed(3)})`);
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(shoot.x, shoot.y);
            ctx.strokeStyle = grd;
            ctx.lineWidth   = 1.5;
            ctx.stroke();
            // glow head
            const hg = ctx.createRadialGradient(shoot.x, shoot.y, 0, shoot.x, shoot.y, 8);
            hg.addColorStop(0, `rgba(255,255,255,${(alpha * 0.9).toFixed(3)})`);
            hg.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(shoot.x, shoot.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = hg;
            ctx.fill();
          }
        }
      }
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        willChange: 'contents',
      }}
    />
  );
}
