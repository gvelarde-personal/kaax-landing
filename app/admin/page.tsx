import type { Metadata } from "next";
import AdminClient from "@/pages/AdminClient";

export const metadata: Metadata = {
  title: "Panel de Administración — Kaax AI",
  description: "Gestión de leads y suscripciones",
};

export default function Page() {
  return <AdminClient />;
}
