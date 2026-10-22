import About from "./components/site/About";
import Certificates from "./components/site/Certificates";
import Contact from "./components/site/Contact";
import Experience from "./components/site/Experience";
import Hero from "./components/site/Hero";
import Projects from "./components/site/Projects";
import Skills from "./components/site/Skills";
import { getCertificados } from "@/app/lib/data/certificados";
import { getProyectos } from "@/app/lib/data/proyectos";

/** Regenera la home en segundo plano; las mutaciones API llaman revalidarPortafolio(). */
export const revalidate = 60;

export default async function HomePage() {
  const [proyectos, certificados] = await Promise.all([getProyectos(), getCertificados()]);

  return (
    <>
      <Hero proyectos={proyectos} />
      <About />
      <Projects proyectos={proyectos} />
      <Skills proyectos={proyectos} />
      <Experience />
      <Certificates certificados={certificados} />
      <Contact />
    </>
  );
}
