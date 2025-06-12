import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portafolio Deiby Ramirez",
  description: "Contacta al mejor ingeniero de Software y Computación",
};


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* SPA con navegación por secciones y organización modular */}

        {/* Parte Superior header superior derecho */}
        <header className="bg-transparent text-white p-10 absolute top-0 right-0 left-150 flex justify-between items-center">
          <div />
          <nav className="flex gap-4 justify-between w-full max-w-md mx-auto">
            <a href="#inicio">Inicio</a>
            <a href="#d_movil">Desarrollo Movil</a>
            <a href="#d_web">Desarrollo Web</a>
            <a href="#logros">Certificaciones</a>
          </nav>
          <div />
        </header>
        {/* Contenido de otras paginas */}
        <section className="flex-1 p-4 br-gray-100">{children}</section>

        {/* Footer */}
        <footer className="bg-graty-800 text-white text-center p-4">
          @ 2025 Portafolio ING.Deiby Alejandro Ramirez Galvis
        </footer>
      </body>
    </html>
  );
}
