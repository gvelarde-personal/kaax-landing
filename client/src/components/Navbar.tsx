import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  const [location] = useLocation();
  const isHome = location === "/";

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
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors hidden md:block"
          >
            Demo
          </Link>
          <a href={isHome ? "#capture" : "/#capture"}>
            <Button className="bg-white text-black hover:bg-zinc-200 group transition-all">
              Empezar
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
