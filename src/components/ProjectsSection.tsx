import FadeIn from './FadeIn';
import ProjectCard from './ProjectCard';

const BASE = import.meta.env.BASE_URL;

const projects = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    images: [`${BASE}images/1-1.png`, `${BASE}images/1-2.png`, `${BASE}images/1-3.png`] as [string, string, string],
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    images: [`${BASE}images/2-1.png`, `${BASE}images/2-2.png`, `${BASE}images/2-3.png`] as [string, string, string],
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    images: [`${BASE}images/3-1.png`, `${BASE}images/3-2.png`, `${BASE}images/3-3.png`] as [string, string, string],
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] pb-10 sm:pb-12 md:pb-16"
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
