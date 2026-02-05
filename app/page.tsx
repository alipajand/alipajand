import { Nav } from "components/Nav/Nav";
import { Hero } from "components/Hero/Hero";
import { About } from "components/About/About";
import { Experience } from "components/Experience/Experience";
import { Skills } from "components/Skills/Skills";
import { Contact } from "components/Contact/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
