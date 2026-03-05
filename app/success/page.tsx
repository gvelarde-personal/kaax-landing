import type { Metadata } from "next";
import SuccessClient from "@/pages/SuccessClient";

export const metadata: Metadata = {
  title: "Suscripción Exitosa — Kaax AI",
  description: "Tu suscripción se ha procesado correctamente",
};

export default function Page() {
  return <SuccessClient />;
}
