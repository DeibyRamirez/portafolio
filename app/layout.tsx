import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import Cursor from "./components/motion/Cursor";
import Grain from "./components/motion/Grain";
import Intro from "./components/motion/Intro";
import SmoothScroll from "./components/motion/SmoothScroll";
import Starfield from "./components/motion/Starfield";
import Footer from "./components/site/Footer";
import Header from "./components/site/Header";
import { PERSONA } from "./components/site/content";
import "./globals.css";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const description =
  "Portafolio de Deiby Ramirez, The Cheiviz. Ingeniero de software. Proyectos de desarrollo móvil, web, videojuegos y automatización.";

export const metadata: Metadata = {
  metadataBase: new URL("https://portafolio.cheiviz.com"),
  title: {
    default: "Deiby Ramirez · Ingeniero de software",
    template: "%s · Deiby Ramirez",
  },
  description,
  authors: [{ name: PERSONA.nombreCompleto, url: PERSONA.github }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Deiby Ramirez · Ingeniero de software",
    description,
    locale: "es_CO",
    type: "website",
    images: [{ url: "/YO.jpg", alt: "Retrato de Deiby Ramirez" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSONA.nombreCompleto,
  alternateName: PERSONA.marca,
  jobTitle: PERSONA.rol,
  email: PERSONA.email,
  url: "https://portafolio.cheiviz.com",
  image: "https://portafolio.cheiviz.com/YO.jpg",
  sameAs: [PERSONA.github, PERSONA.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${syne.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <SmoothScroll>
          <Starfield />
          <Grain />
          <Intro />
          <Cursor />
          <a
            href="#contenido"
            className="absolute left-4 top-0 z-[90] -translate-y-full rounded-full bg-light px-4 py-2 text-sm font-semibold text-carbon focus:top-4 focus:translate-y-0"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido" className="relative z-[1]">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
