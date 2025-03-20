import Image, { StaticImageData } from "next/image";

interface IconLink {
  href: string;
  imgSrc: StaticImageData; // Changed to any since Next.js image imports are objects
  alt: string;
  width?: number;
  height?: number;
}

interface IconLinkProps {
  links: IconLink[];
}

export default function IconLink({ links }: IconLinkProps) {
  return (
    <div className="grid grid-cols-2 gap-2 items-center justify-items-center w-full mx-auto">
      {links.map((link, index) => (
        <a key={index} target="_blank" rel="noreferrer" href={link.href}>
          <Image
            className="w-14 h-auto m-2 dark:invert-0 not-dark:invert-100"
            src={link.imgSrc}
            alt={link.alt}
            width={56} // 14 * 4 = 56px (w-14 in Tailwind)
            height={56}
            priority={index < 4} // Prioritize loading first 4 icons
          />
        </a>
      ))}
    </div>
  );
}
