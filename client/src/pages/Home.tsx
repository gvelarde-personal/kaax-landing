import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { type LeadInput } from "@shared/routes";
import { useCreateLead } from "@/hooks/use-leads";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, BarChart3, Clock, Sparkles, Target, CheckCircle2, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { Logo } from "@/components/Logo";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { mutate: createLead, isPending } = useCreateLead();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWhatsappTooltip, setShowWhatsappTooltip] = useState(false);

  const form = useForm<LeadInput>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    }
  });

  const onSubmit = (data: LeadInput) => {
    createLead(data, {
      onSuccess: () => setIsSubmitted(true)
    });
  };

  const whatsappNumber = "525500000000"; // Placeholder number, user should update this
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola Kaax AI, me gustaría obtener más información sobre sus agentes inteligentes.")}`;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showWhatsappTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="bg-white text-black p-3 rounded-2xl shadow-2xl mb-2 mr-2 text-sm font-medium relative max-w-[200px]"
            >
              <button 
                onClick={() => setShowWhatsappTooltip(false)}
                className="absolute -top-2 -right-2 bg-zinc-200 rounded-full p-1 hover:bg-zinc-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              ¿Tienes dudas? ¡Chatea con nosotros por WhatsApp!
            </motion.div>
          )}
        </AnimatePresence>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowWhatsappTooltip(true)}
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-[#25D366]/40"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ y: -4 }}
        >
          <SiWhatsapp className="w-8 h-8" />
        </motion.a>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Vende más, más rápido</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight text-foreground">
              Aumenta tus ventas con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-accent text-glow">agentes inteligentes.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Identifica leads calificados, interactúa con ellos al instante y cierra más acuerdos con un sistema CRM impulsado por IA que atiende 24/7.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#capture" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-[#22C55E] hover:bg-[#1ea34d] text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover-elevate border-none">
                  Empezar a Capturar Leads
                </Button>
              </a>
              <a href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-white/10 hover:bg-white/5">
                  Ver Funciones
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Ventaja Competitiva.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Equipa a tu equipo con herramientas que convierten el tráfico frío en oportunidades de venta automáticamente.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl hover-elevate group">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Calificación Instantánea</h3>
              <p className="text-muted-foreground leading-relaxed">La IA analiza a los prospectos al instante, separando el ruido de los compradores con alta intención para que te enfoques en lo que importa.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl hover-elevate group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Disponibilidad 24/7</h3>
              <p className="text-muted-foreground leading-relaxed">Atiende a los usuarios en el momento en que muestran interés, sin importar la zona horaria. La velocidad de respuesta es tu nuevo superpoder.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl hover-elevate group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Información Valiosa</h3>
              <p className="text-muted-foreground leading-relaxed">Panel de control completo para rastrear tasas de conversión, velocidad del embudo y métricas de rendimiento del equipo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="capture" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">¿Listo para escalar tus ventas?</h2>
              <p className="text-xl text-muted-foreground mb-8">Únete a las empresas tecnológicas que utilizan Kaax AI para potenciar su crecimiento.</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg text-zinc-200">Configuración en menos de 5 minutos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg text-zinc-200">Integración fluida con CRMs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg text-zinc-200">Comportamientos de IA personalizables</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-8 md:p-10 rounded-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl pointer-events-none" />
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4 text-white">¡Solicitud Recibida!</h3>
                  <p className="text-muted-foreground mb-8 text-lg">Nuestro agente de IA ya ha procesado tus datos. Nos pondremos en contacto contigo pronto.</p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)} className="border-white/10 text-white">
                    Enviar Otro
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300">Nombre Completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Juan Pérez" 
                      className="bg-black/50 border-white/10 focus-visible:border-primary h-12 text-white"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Correo Electrónico</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="juan@empresa.com" 
                      className="bg-black/50 border-white/10 focus-visible:border-primary h-12 text-white"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-zinc-300">Empresa (Opcional)</Label>
                      <Input 
                        id="company" 
                        placeholder="Acme Inc" 
                        className="bg-black/50 border-white/10 focus-visible:border-primary h-12 text-white"
                        {...form.register("company")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-zinc-300">Teléfono (Opcional)</Label>
                      <Input 
                        id="phone" 
                        placeholder="+52 (55) 0000-0000" 
                        className="bg-black/50 border-white/10 focus-visible:border-primary h-12 text-white"
                        {...form.register("phone")}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg mt-4 bg-primary hover:bg-primary/90 text-white"
                    disabled={isPending}
                  >
                    {isPending ? "Procesando..." : "Obtener Acceso Prioritario"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-white/5 py-12 text-center text-zinc-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Logo className="w-6 h-6" />
          <span className="font-display font-semibold text-white">Kaax AI</span>
        </div>
        <p>© 2024 Kaax AI. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
