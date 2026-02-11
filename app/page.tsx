import { Nav } from "components/Nav/Nav";
import { Hero } from "components/Hero/Hero";
import { About } from "components/About/About";
import { Experience } from "components/Experience/Experience";
import { Projects } from "components/Projects/Projects";
import { Innovation } from "components/Innovation/Innovation";
import { Testimonials } from "components/Testimonials/Testimonials";
import { Writing } from "components/Writing/Writing";
import { Skills } from "components/Skills/Skills";
import { Contact } from "components/Contact/Contact";
import { MainReveal } from "components/MainReveal/MainReveal";
import { getLatestPosts } from "lib/posts";
import { Education } from "../components/Education/Education";

export default function Home() {
  const latestPosts = getLatestPosts(2);

  return (
    <>
      <Nav />
      <MainReveal>
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Innovation />
          <Testimonials />
          <Writing posts={latestPosts} />
          <Skills />
          <Contact />
          <Education />
        </main>
      </MainReveal>
    </>
  );
}
