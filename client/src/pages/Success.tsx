import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Link } from "wouter";

export default function Success() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");
  const [verified, setVerified] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!sessionId) { setVerified("error"); return; }
    setVerified("ok");
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <Logo className="w-10 h-10" />
          <span className="font-display font-bold text-xl">Kaax <span className="text-primary">AI</span></span>
        </Link>

        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 ring-4 ring-primary/30">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>

        <h1 className="text-4xl font-display font-bold mb-4">¡Suscripción Activada!</h1>
        <p className="text-zinc-400 text-lg mb-2">Tu pago fue procesado exitosamente.</p>
        <p className="text-zinc-500 text-sm mb-10">
          Recibirás un correo de confirmación pronto. Nuestro equipo se pondrá en contacto contigo para iniciar la configuración de tu agente.
        </p>

        {sessionId && (
          <p className="text-xs text-zinc-600 font-mono mb-8 bg-white/5 px-4 py-2 rounded-lg break-all">
            Referencia: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/525658618626?text=${encodeURIComponent("Hola! Acabo de suscribirme a Kaax AI. Mi referencia es: " + sessionId)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#1ea34d] text-white font-bold h-12">
              <MessageCircle className="w-4 h-4 mr-2" /> Contactar por WhatsApp
            </Button>
          </a>
          <Link href="/">
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 h-12">
              Volver al inicio <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
