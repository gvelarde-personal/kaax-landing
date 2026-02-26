import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Agent<span className="text-primary">Flow</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block">
            How it Works
          </a>
          <Link href="/admin">
            <Button variant="outline" className="hidden sm:flex border-white/10 hover:bg-white/5">
              Dashboard
            </Button>
          </Link>
          <a href="#capture">
            <Button className="bg-white text-black hover:bg-zinc-200 group transition-all">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
