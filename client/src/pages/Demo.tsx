import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type MessageSender = "user" | "agent";

interface Message {
  id: number;
  from: MessageSender;
  text: string;
  delay: number;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  messages: Message[];
}

const scenarios: Scenario[] = [
  {
    id: "calificacion",
    title: "Calificación de Leads",
    description: "El agente identifica prospectos calientes automáticamente",
    icon: TrendingUp,
    color: "text-green-400",
    messages: [
      { id: 1, from: "user", text: "Hola, vi su anuncio sobre la automatización de ventas", delay: 500 },
      { id: 2, from: "agent", text: "¡Hola! 👋 Bienvenido. Soy Kaax, el asistente de ventas. Me da gusto que te hayas comunicado. ¿Qué fue lo que más te llamó la atención del anuncio?", delay: 1800 },
      { id: 3, from: "user", text: "Quiero saber si sirve para mi negocio, vendemos software B2B", delay: 900 },
      { id: 4, from: "agent", text: "¡Perfecto, el software B2B es justo donde mejor funcionamos! 🎯\n\nPara darte una respuesta más precisa: ¿cuántos prospectos nuevos reciben por mes aproximadamente?", delay: 2200 },
      { id: 5, from: "user", text: "Como 150 al mes, pero solo cerramos unos 10", delay: 800 },
      { id: 6, from: "agent", text: "Entiendo — eso es una tasa de conversión del 6.7%. Nuestros clientes B2B típicamente la suben al 18-25% porque el agente califica y calienta a los 150 antes de que tu equipo los toque.\n\n¿Tu equipo de ventas tiene tiempo para atender a todos esos prospectos hoy?", delay: 2800 },
      { id: 7, from: "user", text: "No, de hecho muchos se pierden porque no los contactamos a tiempo", delay: 1000 },
      { id: 8, from: "agent", text: "Eso es exactamente lo que resolvemos ✅\n\nEl agente responde en segundos, 24/7, califica con preguntas clave y le pasa a tu equipo *solo* los que ya están listos para comprar.\n\n¿Te gustaría ver una demo personalizada para tu caso esta semana?", delay: 2500 },
      { id: 9, from: "user", text: "Sí, me interesa mucho", delay: 700 },
      { id: 10, from: "agent", text: "Excelente 🚀 Voy a conectarte con uno de nuestros especialistas ahora mismo.\n\nElige el horario que mejor te acomode: *[link al calendario]*\n\nEn menos de 30 minutos verás exactamente cómo funciona para tu negocio.", delay: 2000 },
    ],
  },
  {
    id: "atencion",
    title: "Atención al Cliente",
    description: "Resolución de dudas y problemas sin intervención humana",
    icon: ShoppingCart,
    color: "text-blue-400",
    messages: [
      { id: 1, from: "user", text: "Hola, mi pedido no ha llegado y ya pasaron 6 días 😤", delay: 500 },
      { id: 2, from: "agent", text: "Hola 👋 Lamento el inconveniente, entiendo lo frustrante que es esperar. Voy a revisarlo de inmediato.\n\n¿Me compartes tu número de pedido o el correo con el que compraste?", delay: 1800 },
      { id: 3, from: "user", text: "#PED-45892", delay: 700 },
      { id: 4, from: "agent", text: "Gracias. Consultando tu pedido... 🔍", delay: 1200 },
      { id: 5, from: "agent", text: "Listo. Tu pedido *#PED-45892* salió de bodega el martes y está con la paquetería. El sistema indica entrega *hoy antes de las 7pm* 📦\n\nTe comparto el tracking: *[link de rastreo]*", delay: 2000 },
      { id: 6, from: "user", text: "Ah ok, muchas gracias. ¿Y si no llega hoy?", delay: 900 },
      { id: 7, from: "agent", text: "Si no llega hoy, escríbeme y lo gestiono de inmediato — ya sea reenvío prioritario o reembolso, lo que prefieras 🙌\n\n¿Quieres que te avise cuando el repartidor esté en camino a tu dirección?", delay: 2200 },
      { id: 8, from: "user", text: "Sí por favor", delay: 600 },
      { id: 9, from: "agent", text: "Perfecto ✅ Recibirás una notificación en cuanto salga hacia ti.\n\n¿Hay algo más en lo que te pueda ayudar?", delay: 1800 },
    ],
  },
  {
    id: "seguimiento",
    title: "Seguimiento Automático",
    description: "Reactiva leads fríos sin que tu equipo haga nada",
    icon: Users,
    color: "text-purple-400",
    messages: [
      { id: 1, from: "agent", text: "¡Hola! 👋 Soy Kaax, asistente de [Empresa]. Hace unos días te interesaste en nuestra solución. ¿Pudiste revisar la información que te enviamos?", delay: 500 },
      { id: 2, from: "user", text: "Sí la vi pero no he tenido tiempo de analizarla bien", delay: 1200 },
      { id: 3, from: "agent", text: "Entiendo completamente — el tiempo es lo más valioso 😊\n\n¿Te mando un resumen de los 3 puntos clave? Es menos de 1 minuto de lectura.", delay: 2000 },
      { id: 4, from: "user", text: "Sí ándale", delay: 700 },
      { id: 5, from: "agent", text: "Aquí va 👇\n\n✅ *Implementación en 7 días* — sin interrumpir tu operación\n✅ *Ahorra 20+ hrs/semana* de tu equipo en tareas repetitivas\n✅ *Soporte incluido* — nunca estás solo en el proceso\n\n¿Alguno te genera alguna duda?", delay: 2500 },
      { id: 6, from: "user", text: "El precio me preocupa un poco, no sé si podemos pagarlo", delay: 1000 },
      { id: 7, from: "agent", text: "Es una pregunta muy válida y te la respondo directamente 💯\n\nNuestros clientes recuperan la inversión en el primer mes porque el agente cierra ventas que antes se perdían. ¿Cuánto te cuesta hoy perder un lead que no fue atendido a tiempo?", delay: 2800 },
      { id: 8, from: "user", text: "Pues bastante... cada cliente nos deja unos $15,000", delay: 800 },
      { id: 9, from: "agent", text: "Exacto. Si el agente recupera *solo 2 leads perdidos al mes*, ya pagó su costo y genera ganancia neta.\n\n¿Agendamos 15 minutos esta semana para mostrarte los números con tu caso específico? Sin compromiso 🤝", delay: 2500 },
    ],
  },
  {
    id: "objeciones",
    title: "Manejo de Objeciones",
    description: "Responde dudas de precio y competencia con inteligencia",
    icon: AlertCircle,
    color: "text-orange-400",
    messages: [
      { id: 1, from: "user", text: "Me parece muy caro comparado con otras opciones del mercado", delay: 500 },
      { id: 2, from: "agent", text: "Gracias por ser directo, lo aprecio mucho 🙏\n\n¿Me dices con qué lo estás comparando? Así puedo ayudarte a ver si tiene sentido para tu negocio — o no.", delay: 2000 },
      { id: 3, from: "user", text: "Hay opciones que cuestan la mitad o menos", delay: 800 },
      { id: 4, from: "agent", text: "Totalmente entendible. La diferencia está en el resultado:\n\nLas opciones más baratas te dan *herramientas*.\nNosotros entregamos *conversaciones que convierten* 🎯\n\nNuestros clientes promedian 40% más cierres con el mismo equipo. ¿Vale la diferencia si el retorno es 3x?", delay: 2800 },
      { id: 5, from: "user", text: "¿Tienen pruebas de eso?", delay: 900 },
      { id: 6, from: "agent", text: "Absolutamente 💪 Tenemos casos de estudio de empresas muy similares a la tuya.\n\n¿Prefieres que te los mande ahora, o mejor hablamos 15 minutos con alguien de nuestro equipo que te explique los números en detalle?", delay: 2200 },
      { id: 7, from: "user", text: "Mándame los casos primero", delay: 700 },
      { id: 8, from: "agent", text: "¡Perfecto! Te los mando ahora 📄\n\n*[Caso 1: Empresa de software B2B — +43% en cierres]*\n*[Caso 2: Distribuidora — recuperó 35 leads fríos en el primer mes]*\n*[Caso 3: Agencia — redujo 80% el tiempo de calificación]*\n\nDespués de leerlos, ¿me dices qué te parece? Estoy aquí 😊", delay: 2500 },
    ],
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        K
      </div>
      <div className="bg-[#202C33] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL as string;

function ChatBubble({ msg }: { msg: Message }) {
  const isAgent = msg.from === "agent";
  const lines = msg.text.split("\n");

  return (
    <div
      className={`flex items-end gap-2 mb-2 animate-msg-in ${isAgent ? "flex-row" : "flex-row-reverse"}`}
    >
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
          K
        </div>
      )}
      <div
        className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isAgent
            ? "bg-[#202C33] text-zinc-100 rounded-bl-none"
            : "bg-[#005C4B] text-white rounded-br-none"
        }`}
      >
        {lines.map((line, i) => {
          const formatted = line
            .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
            .replace(
              /\[link al calendario\]/g,
              `<a href="${CALENDLY_URL}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-green-400 underline font-medium hover:text-green-300 transition-colors">📅 Elegir horario</a>`
            )
            .replace(/\[((?!link al calendario)[^\]]*)\]/g, '<span class="text-green-400/70 text-xs italic">[$1]</span>');
          return (
            <span key={i}>
              <span dangerouslySetInnerHTML={{ __html: formatted }} />
              {i < lines.length - 1 && <br />}
            </span>
          );
        })}
        <div className={`flex items-center gap-1 mt-1 ${isAgent ? "justify-start" : "justify-end"}`}>
          <span className="text-[10px] text-zinc-500">
            {new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isAgent && <CheckCheck className="w-3 h-3 text-green-400" />}
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const playScenario = (scenario: Scenario) => {
    clearTimeouts();
    setVisibleMessages([]);
    setIsTyping(false);
    setDone(false);
    setIsPlaying(true);

    let cumulativeDelay = 600;

    scenario.messages.forEach((msg, idx) => {
      cumulativeDelay += msg.delay;

      if (msg.from === "agent") {
        const typingStart = cumulativeDelay;
        const typingDuration = Math.min(msg.text.length * 18, 2200);
        cumulativeDelay += typingDuration;

        const t1 = setTimeout(() => setIsTyping(true), typingStart);
        const t2 = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages((prev) => [...prev, msg.id]);
        }, typingStart + typingDuration);

        timeoutsRef.current.push(t1, t2);
      } else {
        const t = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, msg.id]);
        }, cumulativeDelay);
        timeoutsRef.current.push(t);
        cumulativeDelay += 200;
      }

      if (idx === scenario.messages.length - 1) {
        const t = setTimeout(() => {
          setIsPlaying(false);
          setDone(true);
        }, cumulativeDelay + 500);
        timeoutsRef.current.push(t);
      }
    });
  };

  useEffect(() => {
    playScenario(activeScenario);
    return () => clearTimeouts();
  }, [activeScenario]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  const handleScenarioChange = (scenario: Scenario) => {
    setActiveScenario(scenario);
  };

  const handleReplay = () => {
    playScenario(activeScenario);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <Link href="/">
              <button data-testid="link-back-home" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </button>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Demo interactiva
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
              Así trabaja <span className="text-primary">Kaax AI</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Selecciona un escenario y mira cómo el agente atiende a tus clientes en tiempo real.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            <div className="w-full lg:w-72 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Escenarios</p>
              {scenarios.map((s) => {
                const Icon = s.icon;
                const isActive = s.id === activeScenario.id;
                return (
                  <button
                    key={s.id}
                    data-testid={`scenario-${s.id}`}
                    onClick={() => handleScenarioChange(s)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? "bg-white/8 border-primary/40 shadow-md shadow-primary/10"
                        : "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-primary/20" : "bg-white/5"}`}>
                        <Icon className={`w-4 h-4 ${isActive ? "text-primary" : s.color}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-zinc-300"}`}>
                          {s.title}
                        </p>
                        <p className="text-xs text-zinc-500 leading-tight mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}

              <a
                href={import.meta.env.VITE_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-cta-demo"
                className="block mt-4"
              >
                <Button
                  className="w-full bg-primary text-black hover:bg-primary/90 font-semibold group"
                >
                  Quiero esto para mi negocio
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>

            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10" style={{ fontFamily: "system-ui, sans-serif" }}>

                <div className="bg-[#1F2C34] px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    K
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight">Kaax AI</p>
                    <p className="text-green-400 text-xs">
                      {isPlaying ? (isTyping ? "escribiendo..." : "en línea") : "en línea"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-zinc-400">WhatsApp</span>
                  </div>
                </div>

                <div
                  ref={chatContainerRef}
                  className="bg-[#0B141A] px-4 py-4 overflow-y-auto"
                  style={{
                    minHeight: "420px",
                    maxHeight: "520px",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <span className="text-[11px] bg-[#182229] text-zinc-500 px-3 py-1 rounded-full">
                      HOY
                    </span>
                  </div>

                  {activeScenario.messages
                    .filter((msg) => visibleMessages.includes(msg.id))
                    .map((msg) => (
                      <ChatBubble
                        key={`${activeScenario.id}-${msg.id}`}
                        msg={msg}
                      />
                    ))}

                  {isTyping && <TypingIndicator />}
                </div>

                <div className="bg-[#1F2C34] px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-sm text-zinc-500">
                    Escribe un mensaje
                  </div>
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
                    </svg>
                  </div>
                </div>
              </div>

              {done && (
                <div className="mt-4 flex justify-center">
                  <button
                    data-testid="button-replay"
                    onClick={handleReplay}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/10 hover:border-white/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Repetir demo
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-500 text-sm mb-6">¿Listo para tener tu propio agente de IA?</p>
            <a
              href={import.meta.env.VITE_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-cta-bottom"
            >
              <Button
                size="lg"
                className="bg-primary text-black hover:bg-primary/90 font-semibold px-8 group"
              >
                Agendar demostración real
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
