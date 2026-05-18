import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from './LiveProjectButton';
import GlassCard from './GlassCard';

interface ProjectCardProps {
  index: number;
  totalCards: number;
  number: string;
  category: string;
  name: string;
  images: [string, string, string]; // [col1_top, col1_bottom, col2]
  liveUrl?: string;
}

export default function ProjectCard({
  index,
  totalCards,
  number,
  category,
  name,
  images,
  liveUrl,
}: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 0.5], [targetScale, 1]);

  return (
    <div ref={containerRef} className="h-[85vh] flex items-center justify-center sticky" style={{ top: `${index * 28}px` }}>
      <motion.div style={{ scale }} className="w-full max-w-6xl">
        <GlassCard className="p-4 sm:p-6 md:p-8">
          {/* Top row: number, label, name, live button */}
          <div className="flex items-start justify-between mb-6 sm:mb-8 md:mb-10">
            <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
              <span
                className="text-[#D7E2EA] font-black leading-none"
                style={{ fontSize: 'clamp(2rem, 8vw, 100px)' }}
              >
                {number}
              </span>
              <div className="flex flex-col gap-1 pt-1 sm:pt-2">
                <span
                  className="text-[#D7E2EA] font-light uppercase tracking-widest"
                  style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', opacity: 0.6 }}
                >
                  {category}
                </span>
                <h3
                  className="text-[#D7E2EA] font-medium uppercase leading-tight"
                  style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)' }}
                >
                  {name}
                </h3>
              </div>
            </div>
            <LiveProjectButton href={liveUrl} />
          </div>

          {/* Bottom row: 2-column image grid */}
          <div className="flex gap-3 sm:gap-4 md:gap-5">
            {/* Left column: 40% width, 2 stacked images */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5" style={{ width: '40%' }}>
              <img
                src={images[0]}
                alt=""
                loading="lazy"
                className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ height: 'clamp(130px, 16vw, 230px)' }}
              />
              <img
                src={images[1]}
                alt=""
                loading="lazy"
                className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ height: 'clamp(160px, 22vw, 340px)' }}
              />
            </div>

            {/* Right column: 60% width, 1 tall image */}
            <div style={{ width: '60%' }}>
              <img
                src={images[2]}
                alt=""
                loading="lazy"
                className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
