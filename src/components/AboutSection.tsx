import ContactButton from './ContactButton';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ElectricBorder from './ElectricBorder';

const bioText =
  "Computer Science junior focused on building impactful AI products. I turn cutting-edge models into scalable user value through structured thinking, fast execution, and strong technical intuition. Driven by 0→1 ownership and product judgment, I aim to create intelligent systems that define real-world impact at scale.";

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* Top-left: Moon */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="/images/moon_icon.11395d36.png" alt="" className="w-full h-auto" />
      </FadeIn>

      {/* Bottom-left: 3D object */}
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]">
        <img src="/images/p59_1.4659672e.png" alt="" className="w-full h-auto" />
      </FadeIn>

      {/* Top-right: Lego */}
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="/images/lego_icon-1.703bb594.png" alt="" className="w-full h-auto" />
      </FadeIn>

      {/* Bottom-right: 3D group */}
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]">
        <img src="/images/Group_134-1.2e04f3ce.png" alt="" className="w-full h-auto" />
      </FadeIn>

      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          About me
        </h2>
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text={bioText}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            scrollOffset={['start 0.8', 'end 0.2']}
          />

          <FadeIn delay={0.4} y={20}>
            <div className="flex flex-wrap justify-center gap-4">
              <ElectricBorder
                color="#B497CF"
                speed={1}
                chaos={0.04}
                borderRadius={24}
              >
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-white font-medium uppercase tracking-widest text-xs sm:text-sm md:text-base transition-all duration-300 hover:bg-white/10 active:scale-95 whitespace-nowrap"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Download Resume
                </a>
              </ElectricBorder>
              <ContactButton href="#contact" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
