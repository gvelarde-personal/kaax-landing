import type { Metadata } from "next";
import { Suspense } from "react";
import SuccessClient from "@/pages/SuccessClient";

export const metadata: Metadata = {
  title: "Suscripción Exitosa — Kaax AI",
  description: "Tu suscripción se ha procesado correctamente",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="animate-pulse">Cargando...</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessClient />
    </Suspense>
  );
}
