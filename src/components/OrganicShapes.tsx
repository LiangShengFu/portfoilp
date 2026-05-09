import { useEffect, useRef } from 'react';

interface Blob {
  x: number; y: number;
  size: number;
  color: string;
  speedX: number; speedY: number;
  morphSpeed: number;
  seed: number;
}

export default function OrganicShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const blobs: Blob[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBlobs();
    };

    const initBlobs = () => {
      blobs.length = 0;
      const w = canvas.width;
      const h = canvas.height;
      blobs.push(
        { x: w * 0.15, y: h * 0.25, size: Math.min(w, h) * 0.35, color: 'rgba(20, 60, 160, ALPHA)', speedX: 0.015, speedY: 0.01, morphSpeed: 0.4, seed: 0 },
        { x: w * 0.8, y: h * 0.6, size: Math.min(w, h) * 0.4, color: 'rgba(80, 30, 150, ALPHA)', speedX: -0.012, speedY: -0.015, morphSpeed: 0.35, seed: 2 },
        { x: w * 0.5, y: h * 0.4, size: Math.min(w, h) * 0.3, color: 'rgba(10, 40, 100, ALPHA)', speedX: 0.01, speedY: -0.012, morphSpeed: 0.3, seed: 4 },
        { x: w * 0.6, y: h * 0.75, size: Math.min(w, h) * 0.25, color: 'rgba(30, 80, 180, ALPHA)', speedX: -0.008, speedY: 0.01, morphSpeed: 0.45, seed: 6 },
      );
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = timestamp / 1000;

      for (const blob of blobs) {
        blob.x += blob.speedX;
        blob.y += blob.speedY;

        // bounce within bounds
        if (blob.x < -blob.size * 0.3 || blob.x > canvas.width + blob.size * 0.3) blob.speedX *= -1;
        if (blob.y < -blob.size * 0.3 || blob.y > canvas.height + blob.size * 0.3) blob.speedY *= -1;

        // organic morphing using multiple sine waves
        const deform1 = Math.sin(t * blob.morphSpeed + blob.seed) * blob.size * 0.15;
        const deform2 = Math.cos(t * blob.morphSpeed * 0.7 + blob.seed + 1) * blob.size * 0.1;
        const deform3 = Math.sin(t * blob.morphSpeed * 1.3 + blob.seed + 2) * blob.size * 0.08;
        const currentSize = blob.size + deform1 + deform2 + deform3;

        const grad = ctx.createRadialGradient(
          blob.x + deform1 * 0.5, blob.y + deform2 * 0.5,
          0,
          blob.x, blob.y,
          currentSize
        );
        const color = blob.color.replace('ALPHA', '0.06');
        const colorMid = blob.color.replace('ALPHA', '0.02');
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, colorMid);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        filter: 'blur(40px)',
      }}
    />
  );
}
