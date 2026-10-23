import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import Cursor from "./components/motion/Cursor";
import Grain from "./components/motion/Grain";
import SmoothScroll from "./components/motion/SmoothScroll";
import Footer from "./components/site/Footer";
import Header from "./components/site/Header";
import { PERSONA } from "./components/site/content";
import "./globals.css";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const description =
  "Portafolio de Deiby Ramirez, The Cheiviz. Ingeniero de software. Proyectos de desarrollo móvil, web, videojuegos y automatización.";

const title = "Deiby Ramirez · Ingeniero de software";

export const metadata: Metadata = {
  metadataBase: new URL("https://portafolio.cheiviz.com"),
  title: {
    default: title,
    template: "%s · Deiby Ramirez",
  },
  description,
  authors: [{ name: PERSONA.nombreCompleto, url: PERSONA.github }],
  creator: PERSONA.nombreCompleto,
  keywords: [
    "Deiby Ramirez",
    "The Cheiviz",
    "ingeniero de software",
    "portafolio",
    "desarrollo web",
    "desarrollo móvil",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: "https://portafolio.cheiviz.com",
    siteName: "Deiby Ramirez",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/YO.jpg", alt: "Retrato de Deiby Ramirez" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/YO.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070708",
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
      <head>
        <link rel="preload" href="/hero-poster.svg" as="image" fetchPriority="high" />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <Grain />
          <Cursor />
          <a
            href="#contenido"
            className="absolute left-4 top-0 z-[90] -translate-y-full bg-light px-4 py-2 text-sm font-semibold text-carbon focus:top-4 focus:translate-y-0"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido" className="relative z-[2]">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
