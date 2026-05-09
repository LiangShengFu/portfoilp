import FadeIn from './FadeIn';

export default function ContactSection() {
  return (
    <section 
      id="contact" 
      className="relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)'
      }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-8"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Contact Me
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={30}>
        <p
          className="text-[#D7E2EA] font-light text-center max-w-lg mx-auto"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        >
          Let&apos;s work together.
        </p>
      </FadeIn>

      <FadeIn delay={0.3} y={30}>
        <div className="flex justify-center mt-10">
          <a
            href="mailto:349196664@qq.com"
            className="text-[#D7E2EA] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}
          >
            349196664@qq.com
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
