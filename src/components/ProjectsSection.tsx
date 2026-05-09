import FadeIn from './FadeIn';
import ProjectCard from './ProjectCard';

const projects = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    images: ['/images/1-1.png', '/images/1-2.png', '/images/1-3.png'] as [string, string, string],
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    images: ['/images/2-1.png', '/images/2-2.png', '/images/2-3.png'] as [string, string, string],
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    images: ['/images/3-1.png', '/images/3-2.png', '/images/3-3.png'] as [string, string, string],
  },
];

export default function ProjectsSection() {
  return (
    <section 
      id="projects" 
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] pb-10 sm:pb-12 md:pb-16"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center pt-16 sm:pt-20 md:pt-28 mb-8 sm:mb-12 md:mb-16"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      <div className="px-5 sm:px-8 md:px-10">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.number}
            index={i}
            totalCards={projects.length}
            number={project.number}
            category={project.category}
            name={project.name}
            images={project.images}
          />
        ))}
      </div>
    </section>
  );
}
