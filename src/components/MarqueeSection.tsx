import { useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL;

const IMAGES = [
  `${BASE}images/hero-space-voyage-preview-eECLH3Yc.gif`,
  `${BASE}images/hero-codenest-preview-Cgppc2qV.gif`,
  `${BASE}images/hero-vex-ventures-preview-BczMFIiw.gif`,
  `${BASE}images/hero-stellar-ai-v2-preview-DjvxjG3C.gif`,
  `${BASE}images/hero-asme-preview-B_nGDnTP.gif`,
  `${BASE}images/hero-transform-data-preview-Cx5OU29N.gif`,
  `${BASE}images/hero-vitara-preview-Cjz2QYyU.gif`,
  `${BASE}images/hero-terra-preview-BFjrCr7T.gif`,
  `${BASE}images/hero-skyelite-preview-DHaZIgUv.gif`,
  `${BASE}images/hero-aethera-preview-DknSlcTa.gif`,
  `${BASE}images/hero-designpro-preview-D8c5_een.gif`,
  `${BASE}images/hero-stellar-ai-preview-D3HL6bw1.gif`,
  `${BASE}images/hero-xportfolio-preview-D4A8maiC.gif`,
  `${BASE}images/hero-orbit-web3-preview-BXt4OttD.gif`,
  `${BASE}images/hero-nexora-preview-cx5HmUgo.gif`,
  `${BASE}images/hero-evr-ventures-preview-DZxeVFEX.gif`,
  `${BASE}images/hero-planet-orbit-preview-DWAP8Z1P.gif`,
  `${BASE}images/hero-new-era-preview-CocuDUm9.gif`,
  `${BASE}images/hero-wealth-preview-B70idl_u.gif`,
  `${BASE}images/hero-luminex-preview-CxOP7ce6.gif`,
  `${BASE}images/hero-celestia-preview-0yO3jXO8.gif`,
];

const ROW_1 = IMAGES.slice(0, 11);
const ROW_2 = IMAGES.slice(11);

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      const offset = scrolled * 0.3;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-10 bg-transparent">
      <div className="flex flex-col gap-3 overflow-hidden">
        <div ref={row1Ref} className="flex gap-3" style={{ willChange: 'transform' }}>
          {[...ROW_1, ...ROW_1, ...ROW_1].map((src, i) => (
            <img
              key={`r1-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
            />
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3" style={{ willChange: 'transform' }}>
          {[...ROW_2, ...ROW_2, ...ROW_2].map((src, i) => (
            <img
              key={`r2-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
