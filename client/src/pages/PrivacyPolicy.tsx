import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/5 py-5 px-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Logo className="w-8 h-8" />
          <span className="font-display font-bold text-lg">Kaax <span className="text-primary">AI</span></span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Política de Privacidad</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Última actualización: enero 2026</p>
          </div>
        </div>

        <div className="space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">1. Quiénes somos</h2>
            <p>
              Kaax AI es un servicio de implementación de agentes de inteligencia artificial para WhatsApp, orientado a empresas B2B que desean automatizar su proceso de captación de clientes y atención al cliente. Operamos en México y nos comprometemos a tratar los datos de nuestros usuarios con responsabilidad y transparencia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">2. Datos que recopilamos</h2>
            <p className="mb-3">
              Únicamente recopilamos los datos que tú nos proporcionas de forma voluntaria a través del formulario de contacto de nuestro sitio web:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Nombre de empresa (opcional)</li>
              <li>Notas o comentarios adicionales (opcional)</li>
            </ul>
            <p className="mt-3">
              No recopilamos datos de navegación, cookies de rastreo ni información sensible de ningún tipo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">3. Para qué usamos tus datos</h2>
            <p className="mb-3">
              Tus datos se utilizan exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>Contactarte y darte seguimiento sobre los servicios de Kaax AI que solicitaste</li>
              <li>Responder a tus preguntas o solicitudes de información</li>
              <li>Enviarte información relevante sobre nuestra oferta de servicios</li>
            </ul>
            <p className="mt-3">
              Nunca utilizaremos tus datos con fines publicitarios de terceros ni para propósitos distintos a la comunicación directa contigo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">4. Almacenamiento de datos</h2>
            <p>
              Tus datos se almacenan en una base de datos segura accesible únicamente por el equipo interno de Kaax AI. Implementamos medidas técnicas razonables para proteger tu información contra accesos no autorizados. Los datos se conservan únicamente durante el tiempo necesario para gestionar tu solicitud o relación comercial con nosotros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">5. No vendemos ni compartimos tus datos</h2>
            <p>
              Kaax AI <strong className="text-white">no vende, alquila ni comparte</strong> tus datos personales con terceros bajo ninguna circunstancia. Tu información es confidencial y se usa únicamente para comunicarnos contigo directamente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">6. Tus derechos</h2>
            <p className="mb-3">
              En cualquier momento puedes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>Solicitar acceso a los datos que tenemos sobre ti</li>
              <li>Solicitar la corrección de datos incorrectos</li>
              <li>Solicitar la eliminación completa de tus datos</li>
              <li>Revocar tu consentimiento para que te contactemos</li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, escríbenos a través de WhatsApp al{" "}
              <a
                href="https://wa.me/525658989637"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +52 565 861 8626
              </a>{" "}
              y atenderemos tu solicitud en un plazo máximo de 5 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">7. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Cualquier cambio significativo será notificado en esta misma página con la fecha de actualización. Te recomendamos revisarla periódicamente.
            </p>
          </section>

          <section className="border-t border-white/5 pt-8">
            <p className="text-zinc-500 text-sm">
              Si tienes alguna pregunta sobre esta política de privacidad, puedes contactarnos directamente por WhatsApp o visitar nuestra{" "}
              <Link href="/" className="text-primary hover:underline">página principal</Link>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-zinc-600 text-sm">
        © 2026 Kaax AI. Todos los derechos reservados.
      </footer>
    </div>
  );
}
