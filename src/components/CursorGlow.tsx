import { useEffect, useRef } from 'react';

interface CursorGlowProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function CursorGlow({ mouseRef }: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };

      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseRef]);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      style={{ width: 300, height: 300 }}
    />
  );
}
