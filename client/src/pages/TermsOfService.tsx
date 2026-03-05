import Link from "next/link";
import { Logo } from "@/components/Logo";
import { FileText } from "lucide-react";

export default function TermsOfService() {
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
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Términos y Condiciones de Servicio</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Última actualización: enero 2026</p>
          </div>
        </div>

        <div className="space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">1. Partes del contrato</h2>
            <p>
              Los presentes Términos y Condiciones regulan la relación comercial entre <strong className="text-white">Kaax AI</strong> (en adelante "el Proveedor") y la persona física o moral que contrata los servicios (en adelante "el Cliente"). Al contratar cualquier servicio de Kaax AI, el Cliente manifiesta su aceptación expresa a las condiciones establecidas en este documento, conforme a lo dispuesto por el Código Civil Federal de los Estados Unidos Mexicanos y la Ley Federal de Protección al Consumidor (PROFECO).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">2. Descripción de los servicios</h2>
            <p className="mb-3">Kaax AI provee los siguientes servicios:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Diseño, configuración e implementación de agentes de inteligencia artificial en la plataforma WhatsApp Business API</li>
              <li>Automatización de flujos de conversación para calificación de prospectos y atención al cliente</li>
              <li>Integración con sistemas CRM del Cliente (sujeto a disponibilidad técnica de la plataforma CRM elegida por el Cliente)</li>
              <li>Soporte técnico mensual para mantenimiento y ajuste del agente</li>
              <li>Acceso a infraestructura de procesamiento de lenguaje natural con tokens ilimitados durante la vigencia del contrato</li>
            </ul>
            <p className="mt-3 text-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <strong className="text-white">Nota importante:</strong> La licencia o suscripción del sistema CRM que el Cliente desee integrar no está incluida en el servicio de Kaax AI y corre por cuenta exclusiva del Cliente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">3. Vigencia y modalidad del contrato</h2>
            <p>
              El servicio se contrata bajo modalidad de suscripción mensual renovable. El contrato inicia en la fecha en que se acredita el primer pago y se renueva automáticamente cada mes calendario salvo que el Cliente notifique su intención de cancelar con al menos <strong className="text-white">5 días hábiles</strong> de anticipación al siguiente ciclo de facturación.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">4. Precios y condiciones de pago</h2>
            <p className="mb-3">
              El costo del servicio es de <strong className="text-white">$18,000 MXN mensuales más IVA</strong> (16%), para un total de $20,880 MXN con impuesto incluido, salvo que se haya pactado una tarifa distinta por escrito entre las partes.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>El pago deberá realizarse de forma anticipada al inicio de cada periodo mensual</li>
              <li>Los pagos se procesan a través de Stripe con tarjeta de crédito o débito; el Cliente es responsable de mantener un método de pago válido y activo</li>
              <li>En caso de fallo de pago, Kaax AI podrá suspender el servicio hasta regularizar el adeudo</li>
              <li>Los precios podrán ajustarse notificando al Cliente con un mínimo de <strong className="text-white">30 días naturales</strong> de anticipación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">5. Obligaciones del Proveedor</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Implementar el agente de IA en los tiempos acordados al inicio del contrato</li>
              <li>Mantener la disponibilidad del servicio con un objetivo de operación continua</li>
              <li>Atender solicitudes de soporte técnico en un plazo no mayor a <strong className="text-white">48 horas hábiles</strong></li>
              <li>Guardar confidencialidad sobre la información del Cliente y sus clientes finales</li>
              <li>Notificar con anticipación cualquier mantenimiento programado que pueda afectar la disponibilidad del agente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">6. Obligaciones del Cliente</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Proporcionar acceso a las plataformas necesarias para la integración (WhatsApp Business API, CRM, etc.)</li>
              <li>Mantener al día sus pagos mensuales</li>
              <li>Usar el servicio conforme a la ley aplicable y las políticas de uso de Meta (WhatsApp Business)</li>
              <li>No utilizar el agente para envío masivo no solicitado (spam), actividades fraudulentas, o cualquier uso que contravenga la legislación mexicana vigente</li>
              <li>Obtener el consentimiento de sus propios clientes finales para recibir comunicaciones automatizadas, en cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">7. Limitación de responsabilidad</h2>
            <p className="mb-3">
              Kaax AI no será responsable por:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Interrupciones del servicio causadas por Meta/WhatsApp, proveedores de nube o terceros fuera del control del Proveedor</li>
              <li>Resultados comerciales específicos (conversiones, ventas o ingresos generados por el uso del agente)</li>
              <li>Daños indirectos, pérdida de datos o lucro cesante derivados del uso o imposibilidad de uso del servicio</li>
              <li>Cambios en las políticas de WhatsApp Business API que afecten la funcionalidad del agente</li>
            </ul>
            <p className="mt-3">
              La responsabilidad máxima de Kaax AI ante el Cliente, bajo cualquier circunstancia, se limita al monto pagado en el último mes de servicio activo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">8. Cancelación y terminación</h2>
            <p className="mb-3">
              Cualquiera de las partes puede dar por terminado el contrato:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong className="text-white">El Cliente:</strong> notificando por escrito con 5 días hábiles de anticipación al siguiente ciclo. No se realizan reembolsos proporcionales del mes en curso</li>
              <li><strong className="text-white">Kaax AI:</strong> en caso de incumplimiento de pago, uso indebido del servicio, o por causa justificada, notificando al Cliente con 15 días naturales de anticipación salvo en casos de incumplimiento grave</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">9. Confidencialidad</h2>
            <p>
              Ambas partes se comprometen a mantener confidencialidad sobre la información comercial, técnica y estratégica compartida durante la vigencia del contrato y por un periodo de <strong className="text-white">2 años</strong> posteriores a su terminación. Esta obligación no aplica a información que sea de dominio público o que deba divulgarse por mandato legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">10. Propiedad intelectual</h2>
            <p>
              Los modelos, flujos de conversación, configuraciones y desarrollos creados por Kaax AI para el Cliente son de uso exclusivo del Cliente durante la vigencia del contrato. Kaax AI conserva la propiedad intelectual sobre su metodología, herramientas propias y código base. Al terminar el contrato, Kaax AI podrá reutilizar aprendizajes generales siempre que no exponga datos específicos del Cliente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">11. Legislación aplicable y jurisdicción</h2>
            <p>
              Los presentes Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia derivada de la interpretación o cumplimiento de este documento, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">12. Modificaciones</h2>
            <p>
              Kaax AI se reserva el derecho de actualizar estos Términos y Condiciones. Los cambios serán notificados al Cliente con al menos <strong className="text-white">15 días naturales</strong> de anticipación. El uso continuado del servicio posterior a dicha notificación implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-white mb-3">13. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos Términos y Condiciones, puedes comunicarte con nosotros a través de WhatsApp al{" "}
              <a
                href="https://wa.me/525658989637"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +52 565 861 8626
              </a>{" "}
              o visitar nuestra <Link href="/" className="text-primary hover:underline">página principal</Link>.
            </p>
          </section>

          <section className="border-t border-white/5 pt-8">
            <p className="text-zinc-500 text-sm">
              Al contratar los servicios de Kaax AI, el Cliente declara haber leído, comprendido y aceptado íntegramente los presentes Términos y Condiciones.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-zinc-600 text-sm">
        © 2026 Kaax AI. Todos los derechos reservados. ·{" "}
        <Link href="/privacidad" className="hover:text-zinc-400 transition-colors">Política de Privacidad</Link>
      </footer>
    </div>
  );
}
