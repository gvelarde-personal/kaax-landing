import type { Metadata } from "next";
import HomeClient from "@/pages/HomeClient";

export const metadata: Metadata = {
  title: "Kaax AI — Agente de IA en WhatsApp para ventas B2B · México",
  description: "Implementamos un agente de IA en tu WhatsApp que califica leads automáticamente y atiende clientes 24/7. Tokens ilimitados · Integración CRM · $18,000 MXN/mes.",
  openGraph: {
    type: "website",
    url: "https://kaax.ai/",
    title: "Kaax AI — Agente de IA en WhatsApp para ventas B2B · México",
    description: "Implementamos un agente de IA en tu WhatsApp que califica leads automáticamente y atiende clientes 24/7. Tokens ilimitados · Integración CRM · $18,000 MXN/mes.",
    images: [
      {
        url: "https://kaax.ai/og-image.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaax AI — Agente de IA en WhatsApp para ventas B2B · México",
    description: "Implementamos un agente de IA en tu WhatsApp que califica leads automáticamente y atiende clientes 24/7. Tokens ilimitados · Integración CRM · $18,000 MXN/mes.",
    images: ["https://kaax.ai/og-image.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}
