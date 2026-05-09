import { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
}

const ORBS: Orb[] = [
  { x: 0.3, y: 0.3, radius: 0.6, color: 'rgba(94, 234, 212, 0.22)' },
  { x: 0.75, y: 0.55, radius: 0.5, color: 'rgba(251, 146, 60, 0.18)' },
  { x: 0.5, y: 0.85, radius: 0.5, color: 'rgba(168, 139, 250, 0.16)' },
  { x: 0.5, y: 0.7, radius: 0.55, color: 'rgba(94, 234, 212, 0.10)' },
];

export default function HeroGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    const draw = () => {
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      // Smooth mouse damping (0.04 = fast follow, like reference)
      const damp = 0.04;
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * damp;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * damp;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Draw static orbs
      for (const orb of ORBS) {
        const ox = orb.x * w;
        const oy = orb.y * h;
        const maxDim = Math.max(w, h);
        const r = orb.radius * maxDim;

        const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Mouse-following spotlight — teal accent matching reference site
      const sx = mx * w;
      const sy = my * h;
      const spotlightRadius = Math.max(w, h) * 0.45;

      const spotlight = ctx.createRadialGradient(sx, sy, 0, sx, sy, spotlightRadius);
      spotlight.addColorStop(0, 'rgba(94, 234, 212, 0.10)');
      spotlight.addColorStop(0.35, 'rgba(94, 234, 212, 0.04)');
      spotlight.addColorStop(0.7, 'rgba(168, 139, 250, 0.02)');
      spotlight.addColorStop(1, 'transparent');

      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, w, h);

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    if (prefersReduced) {
      // One-frame render with spotlight centered
      draw();
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
}
