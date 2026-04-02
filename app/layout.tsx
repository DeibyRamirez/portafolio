import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portafolio Profesional | Deiby Ramirez",
  description: "Ingeniero de Software y Computacion con enfoque en proyectos web, moviles, game dev y ciberseguridad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 border-b border-[color:var(--outline)] bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
            <a href="#inicio" className="text-lg font-semibold text-slate-900 md:text-xl">
              Deiby<span className="text-[color:var(--brand)]">Ramirez</span>
            </a>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#inicio" className="transition-colors hover:text-[color:var(--brand)]">Inicio</a>
              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 transition-colors hover:text-[color:var(--brand)]"
                  aria-haspopup="menu"
                >
                  Secciones
                  <span className="text-xs">▾</span>
                </button>
                <div className="invisible absolute right-0 top-8 z-50 w-52 rounded-xl border border-[color:var(--outline)] bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <a href="#arquitectura" className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[color:var(--brand)]">Arquitectura</a>
                  <a href="#d_movil" className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[color:var(--brand)]">Movil</a>
                  <a href="#d_web" className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[color:var(--brand)]">Web</a>
                  <a href="#d_game_dev" className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[color:var(--brand)]">Game Dev</a>
                  <a href="#d_ciberseguridad" className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[color:var(--brand)]">Ciberseguridad</a>
                  <a href="#logros" className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[color:var(--brand)]">Logros</a>
                </div>
              </div>
            </nav>
          </div>
          <div className="border-t border-[color:var(--outline)] bg-white/70 px-5 py-2 text-xs text-slate-600 md:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between font-medium">
              <a href="#inicio">Inicio</a>
              <details className="relative">
                <summary className="cursor-pointer list-none">Secciones ▾</summary>
                <div className="absolute right-0 top-6 z-50 w-44 rounded-xl border border-[color:var(--outline)] bg-white p-2 shadow-lg">
                  <a href="#arquitectura" className="block rounded-md px-2 py-1.5 hover:bg-slate-50">Arquitectura</a>
                  <a href="#d_movil" className="block rounded-md px-2 py-1.5 hover:bg-slate-50">Movil</a>
                  <a href="#d_web" className="block rounded-md px-2 py-1.5 hover:bg-slate-50">Web</a>
                  <a href="#d_game_dev" className="block rounded-md px-2 py-1.5 hover:bg-slate-50">Game Dev</a>
                  <a href="#d_ciberseguridad" className="block rounded-md px-2 py-1.5 hover:bg-slate-50">Ciberseguridad</a>
                  <a href="#logros" className="block rounded-md px-2 py-1.5 hover:bg-slate-50">Logros</a>
                </div>
              </details>
              </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-20 border-t border-[color:var(--outline)] bg-slate-950 text-slate-200">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="text-2xl font-semibold">Deiby Ramirez</h2>
              <p className="mt-2 max-w-lg text-sm text-slate-400">
                Portafolio orientado a crecimiento continuo con lineas de trabajo en desarrollo movil, web, game dev y ciberseguridad.
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-slate-400">Repositorio profesional en evolucion</p>
              <p className="mt-1 text-sm text-slate-400">Preparado para agregar nuevos proyectos por categoria y nivel tecnico.</p>
            </div>
          </div>
          <div className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500 md:px-8">
            © {new Date().getFullYear()} Deiby Alejandro Ramirez Galvis. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
