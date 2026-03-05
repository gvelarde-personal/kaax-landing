import type { Metadata } from "next";
import "../client/src/index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Kaax AI",
  description: "Agente de IA en WhatsApp para ventas B2B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
