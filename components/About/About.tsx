import { ABOUT_HEADING, ABOUT_PARAGRAPHS } from "data/about";

export const About = () => {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div>
        <h2 id="about-heading">{ABOUT_HEADING}</h2>
        <div>
          {ABOUT_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
