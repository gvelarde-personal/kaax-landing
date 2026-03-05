import type { Metadata } from "next";
import TermsOfService from "@/pages/TermsOfService";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Kaax AI",
  description: "Términos y condiciones de uso del servicio Kaax AI",
};

export default function Page() {
  return <TermsOfService />;
}
