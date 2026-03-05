"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-10 h-10 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all" />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Kaax <span className="text-primary">AI</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          {isHome && (
            <>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block">
                Funciones
              </a>
              <a href="#servicios" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block">
                Servicios
              </a>
              <a href="#precios" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block">
                Precios
              </a>
            </>
          )}
          <Link
            href="/demo"
            data-testid="link-demo-nav"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Demo
          </Link>
          <a href={isHome ? "#capture" : "/#capture"}>
            <Button className="bg-transparent text-white border-0 shadow-none hover:bg-white/10 px-2 text-sm md:bg-white md:text-black md:hover:bg-zinc-200 md:px-4 group transition-all">
              Empezar
              <ArrowRight className="w-3 h-3 ml-1 md:w-4 md:h-4 md:ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
