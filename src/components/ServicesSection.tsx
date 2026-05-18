import FadeIn from './FadeIn';

const services = [
  {
    number: '02',
    name: 'Data Visualization & Interactive Design',
    description:
      'Design innovative visualization logic with multi-layer overlays, metric comparison, and interactive analysis — empowering users to interpret complex data and drive data-informed decisions.',
  },
  {
    number: '03',
    name: 'Product Feature Planning & Prototyping',
    description:
      'Lead feature planning for AI products through PRD writing, user needs analysis, and prototyping to design product workflows including prompt engineering and agent orchestration.',
  },
  {
    number: '04',
    name: 'Technical Tools & Efficiency',
    description:
      'Proficient in AI coding tools like Cursor and ChatGPT to accelerate frontend framework setup, data processing logic, API design, and overall development velocity while reducing costs.',
  },
  {
    number: '05',
    name: 'Cross-functional Collaboration & Delivery',
    description:
      'Coordinate seamless frontend-backend integration, drive AI tool adoption across the development pipeline, and ensure successful product launches with optimized user experience.',
  },
];

export default function ServicesSection() {
  return (
    <section id="ability" className="relative z-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <h2
        className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Ability
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.15} y={0} duration={2}>
            <div
              className="flex items-start gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12"
              style={{
                borderBottom:
                  i < services.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              }}
            >
              <span
                className="text-[#D7E2EA] font-black leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-3">
                <h3
                  className="font-medium uppercase text-[#D7E2EA]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl text-[#D7E2EA]"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.5 }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
