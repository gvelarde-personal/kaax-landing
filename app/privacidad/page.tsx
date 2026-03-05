import type { Metadata } from "next";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Política de Privacidad — Kaax AI",
  description: "Política de privacidad y manejo de datos de Kaax AI",
};

export default function Page() {
  return <PrivacyPolicy />;
}
