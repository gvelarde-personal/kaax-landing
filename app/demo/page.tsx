import type { Metadata } from "next";
import DemoClient from "@/pages/DemoClient";

export const metadata: Metadata = {
  title: "Demo Interactiva — Kaax AI",
  description: "Mira cómo el agente de Kaax AI atiende a tus clientes en tiempo real con escenarios interactivos.",
};

export default function Page() {
  return <DemoClient />;
}
