interface HeroDisplayCharProps {
  char: string;
}

export const HeroDisplayChar = ({ char }: HeroDisplayCharProps) => {
  return (
    <span className="inline-block hero-char" data-char>
      {char === " " ? "\u00A0" : char}
    </span>
  );
};
