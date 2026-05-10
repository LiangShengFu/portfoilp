import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollAnimations() {
  useGSAP(() => {
    // ──────────────────────────────────────────
    // 1. HERO — parallax + content reveal
    // ──────────────────────────────────────────
    gsap.fromTo(
      '#hero .hero-heading',
      { y: 120, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 1.4, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#hero', start: 'top 80%', end: 'top 30%', scrub: 1,
        },
      },
    );

    gsap.fromTo(
      '#hero p, #hero a, #hero button',
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#hero', start: 'top 70%', end: 'top 40%', scrub: 1,
        },
      },
    );

    // Hero image parallax
    gsap.to('#hero img', {
      y: -80, ease: 'none',
      scrollTrigger: {
        trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true,
      },
    });

    // ──────────────────────────────────────────
    // 2. JOURNEY — scale reveal
    // ──────────────────────────────────────────
    gsap.fromTo(
      '#journey',
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#journey', start: 'top 85%', end: 'top 20%', scrub: 1,
        },
      },
    );

    // ──────────────────────────────────────────
    // 3. ABOUT
    // ──────────────────────────────────────────
    gsap.fromTo(
      '#about .hero-heading',
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about', start: 'top 80%', end: 'top 40%', scrub: 1,
        },
      },
    );

    // About decorative images parallax
    gsap.utils.toArray<HTMLElement>('#about .absolute img').forEach((img, i) => {
      gsap.to(img, {
        y: i % 2 === 0 ? -40 : 40, ease: 'none',
        scrollTrigger: {
          trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true,
        },
      });
    });

    gsap.fromTo(
      '#about p, #about a, #about button',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#about', start: 'top 70%', end: 'top 35%', scrub: 1,
        },
      },
    );

    // ──────────────────────────────────────────
    // 4. ABILITY — staggered rows
    // ──────────────────────────────────────────
    gsap.fromTo(
      '#ability .hero-heading',
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#ability', start: 'top 80%', end: 'top 40%', scrub: 1,
        },
      },
    );

    ScrollTrigger.batch('#ability [class*="flex items-start"]', {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', overwrite: true },
        );
      },
      onLeaveBack: (elements) => {
        gsap.to(elements, { x: -40, opacity: 0, duration: 0.4, stagger: 0.05, overwrite: true });
      },
      start: 'top 85%',
      end: 'bottom 20%',
    });

    // ──────────────────────────────────────────
    // 5. PROJECT — cards stack reveal
    // ──────────────────────────────────────────
    gsap.fromTo(
      '#projects .hero-heading',
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#projects', start: 'top 80%', end: 'top 40%', scrub: 1,
        },
      },
    );

    ScrollTrigger.batch('#projects [class*="project"]', {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { y: 80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', overwrite: true },
        );
      },
      start: 'top 85%',
      end: 'bottom 15%',
    });

    // ──────────────────────────────────────────
    // 6. CONTACT — fade up
    // ──────────────────────────────────────────
    gsap.fromTo(
      '#contact .hero-heading',
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact', start: 'top 85%', end: 'top 45%', scrub: 1,
        },
      },
    );

    gsap.fromTo(
      '#contact p, #contact a',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#contact', start: 'top 80%', end: 'top 50%', scrub: 1,
        },
      },
    );
  }, []);

  return null;
}
