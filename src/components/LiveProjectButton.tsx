export default function LiveProjectButton({ href = '#' }: { href?: string }) {
  return (
    <a
      href={href}
      target={href !== '#' ? '_blank' : undefined}
      rel={href !== '#' ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] px-8 py-3 sm:px-10 sm:py-3.5 text-[#D7E2EA] font-medium uppercase tracking-widest text-sm sm:text-base transition-colors duration-200 hover:bg-[#D7E2EA]/10 whitespace-nowrap"
    >
      Live Project
    </a>
  );
}
