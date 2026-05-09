import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '50px',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(24px) saturate(120%)',
        WebkitBackdropFilter: 'blur(24px) saturate(120%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 0 0 1px rgba(255, 255, 255, 0.06),
          inset 0 1px 2px rgba(255, 255, 255, 0.04)
        `,
      }}
    >
      {children}
    </div>
  );
}
