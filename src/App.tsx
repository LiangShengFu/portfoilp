import HeroSection from './components/HeroSection';
import DomeGallery from './components/DomeGallery';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Silk from './components/Silk';
import SplashCursor from './components/SplashCursor';
import ScrollAnimations from './components/ScrollAnimations';

export default function App() {
  return (
    <main style={{ backgroundColor: '#0C0C0C', overflowX: 'clip' }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Silk
          speed={5}
          scale={1}
          color="#593f6c"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1440}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
      />
      <ScrollAnimations />
      <HeroSection />
      <DomeGallery />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
