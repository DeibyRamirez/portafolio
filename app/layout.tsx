import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
        <header className="bg-transparent text-white p-10 absolute top-0 right-0 left-150 flex justify-end items-center gap-7">
          <div />
          <nav className="flex m-8 gap-5 text-2xl font-extralight justify-center items-center ">
            <a href="#inicio" className="hover:text-black border-b-2 border-transparent hover:border-black transition-duration-300">Inicio</a>
            <a href="#d_movil" className="hover:text-black border-b-2 border-transparent hover:border-black transition-duration-300">Desarrollo Movil</a>
            <a href="#d_web" className="hover:text-black border-b-2 border-transparent hover:border-black transition-duration-300">Desarrollo Web</a>
            <a href="#logros" className="hover:text-black border-b-2 border-transparent hover:border-black transition-duration-300">Certificaciones</a>
          </nav>
          <div />
        </header>
        {/* Contenido de otras paginas */}
        {/* Fondo del Portafolio */}
        <section className="flex-1 p-4 bg-yellow-500">{children}
          
        </section>

        {/* Footer */}
        <footer className="bg-graty-800 text-white text-center p-4">
          @ 2025 Portafolio Ing.Deiby Alejandro Ramirez Galvis
        </footer>
      </body>
    </html>
  );
}
