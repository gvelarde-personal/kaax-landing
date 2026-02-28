const BASE_HTML = (title: string, description: string, path: string, body: string) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="https://kaax.ai${path}" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kaax.ai${path}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="https://kaax.ai/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="es_MX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://kaax.ai${path}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://kaax.ai/og-image.png" />
</head>
<body>
${body}
</body>
</html>`;

export const PRERENDERED: Record<string, string> = {
  "/": BASE_HTML(
    "Kaax AI - Vende más con Agentes Inteligentes de WhatsApp",
    "Implementamos agentes de IA en WhatsApp que califican leads automáticamente y atienden clientes 24/7. $18,000 MXN/mes · Tokens ilimitados · Integración CRM.",
    "/",
    `
<header>
  <nav>
    <a href="/">Kaax AI</a>
    <a href="#funciones">Funciones</a>
    <a href="#servicios">Servicios</a>
    <a href="#precios">Precios</a>
  </nav>
</header>

<main>
  <section id="hero">
    <h1>Vende más con Agentes Inteligentes en WhatsApp</h1>
    <p>Implementamos agentes de IA que atienden a tus clientes 24/7, califican leads automáticamente y los entregan listos a tu equipo de ventas — sin que pierdas ninguna oportunidad.</p>
    <a href="#precios">Ver planes</a>
    <a href="#capture">Solicitar información</a>
  </section>

  <section id="funciones">
    <h2>Todo lo que necesitas para escalar tus ventas</h2>
    <ul>
      <li>
        <h3>Respuesta Inmediata 24/7</h3>
        <p>Tu agente responde en segundos, a cualquier hora, sin importar el volumen de conversaciones.</p>
      </li>
      <li>
        <h3>Calificación Automática de Leads</h3>
        <p>El agente hace las preguntas correctas, identifica prospectos calificados y los prioriza automáticamente.</p>
      </li>
      <li>
        <h3>Integración con tu CRM</h3>
        <p>Sincroniza cada conversación y lead directamente con HubSpot, Odoo, Zoho, SuiteCRM y más.</p>
      </li>
      <li>
        <h3>Tokens Ilimitados</h3>
        <p>Sin límite de conversaciones ni cargos extra. Escala sin preocuparte por costos de uso.</p>
      </li>
      <li>
        <h3>Personalización Total</h3>
        <p>El agente aprende el tono y las respuestas de tu marca para que cada interacción se sienta auténtica.</p>
      </li>
      <li>
        <h3>Análisis y Reportes</h3>
        <p>Panel de administración con métricas de leads capturados, calificados y tasa de conversión.</p>
      </li>
    </ul>
  </section>

  <section id="servicios">
    <h2>¿Qué incluye el servicio?</h2>
    <p>Implementamos, configuramos y mantenemos tu agente de IA en WhatsApp. Tú te enfocas en cerrar ventas.</p>
    <ul>
      <li>Agente de IA personalizado para tu negocio en WhatsApp Business</li>
      <li>Tokens ilimitados — sin costo adicional por volumen de conversaciones</li>
      <li>Integración con tu CRM actual (HubSpot, Salesforce, Odoo, SuiteCRM, Zoho y más)</li>
      <li>Configuración e implementación completa incluida</li>
      <li>Soporte técnico mensual y ajustes continuos</li>
      <li>Disponibilidad 24/7 sin interrupciones</li>
    </ul>
    <p><strong>Nota:</strong> La licencia de CRM corre por cuenta del cliente. Nosotros hacemos la integración técnica con el CRM que ya tienes.</p>
    <div>
      <h3>Compatible con los principales CRMs</h3>
      <ul>
        <li>HubSpot</li>
        <li>Salesforce</li>
        <li>Odoo</li>
        <li>SuiteCRM</li>
        <li>Zoho CRM</li>
      </ul>
    </div>
  </section>

  <section id="precios">
    <h2>Sin sorpresas. Un solo plan claro.</h2>
    <div>
      <h3>Agente Pro</h3>
      <p>Agente de IA en WhatsApp para tu negocio</p>
      <p><strong>$18,000 MXN + IVA / mes</strong></p>
      <p>Oferta para los primeros 10 clientes</p>
      <ul>
        <li>✓ Agente de IA personalizado en WhatsApp</li>
        <li>✓ Tokens ilimitados (sin costo adicional)</li>
        <li>✓ Integración con tu CRM actual</li>
        <li>✓ Configuración e implementación completa</li>
        <li>✓ Soporte mensual incluido</li>
        <li>✓ Disponibilidad 24/7 sin interrupciones</li>
        <li>✗ Licencia de CRM (corre por el cliente)</li>
      </ul>
      <p>Sin contratos anuales · Cancela cuando quieras</p>
    </div>
  </section>

  <section id="capture">
    <h2>¿Listo para escalar tus ventas?</h2>
    <p>Déjanos tus datos y un especialista de Kaax AI se pondrá en contacto contigo para mostrarte cómo funciona el agente para tu negocio específico.</p>
    <form>
      <input type="text" name="name" placeholder="Nombre completo" />
      <input type="email" name="email" placeholder="Correo electrónico" />
      <input type="tel" name="phone" placeholder="Teléfono (WhatsApp)" />
      <input type="text" name="company" placeholder="Nombre de empresa" />
      <button type="submit">Quiero más información</button>
    </form>
  </section>
</main>

<footer>
  <p>© 2026 Kaax AI. Todos los derechos reservados.</p>
  <a href="/privacidad">Política de Privacidad</a>
  <a href="/terminos">Términos y Condiciones</a>
</footer>
`
  ),

  "/privacidad": BASE_HTML(
    "Política de Privacidad - Kaax AI",
    "Conoce cómo Kaax AI maneja tus datos personales. Solo recopilamos los datos necesarios para comunicarnos contigo y nunca los vendemos ni compartimos con terceros.",
    "/privacidad",
    `
<header><a href="/">Kaax AI</a></header>
<main>
  <h1>Política de Privacidad</h1>
  <p>Última actualización: enero 2026</p>
  <h2>1. Quiénes somos</h2>
  <p>Kaax AI es un servicio de implementación de agentes de inteligencia artificial para WhatsApp, orientado a empresas B2B en México.</p>
  <h2>2. Datos que recopilamos</h2>
  <p>Únicamente recopilamos los datos que tú nos proporcionas voluntariamente: nombre, correo electrónico, teléfono (opcional) y empresa (opcional).</p>
  <h2>3. Para qué usamos tus datos</h2>
  <p>Tus datos se utilizan exclusivamente para contactarte sobre los servicios de Kaax AI que solicitaste. Nunca los usamos con fines publicitarios de terceros.</p>
  <h2>4. No vendemos ni compartimos tus datos</h2>
  <p>Kaax AI no vende, alquila ni comparte tus datos personales con terceros bajo ninguna circunstancia.</p>
  <h2>5. Tus derechos</h2>
  <p>Puedes solicitar acceso, corrección o eliminación de tus datos contactándonos por WhatsApp al +52 56 5898 9637.</p>
</main>
<footer><p>© 2026 Kaax AI</p><a href="/">Inicio</a> · <a href="/terminos">Términos y Condiciones</a></footer>
`
  ),

  "/terminos": BASE_HTML(
    "Términos y Condiciones - Kaax AI",
    "Términos y condiciones del servicio de Kaax AI. Agentes de IA para WhatsApp a $18,000 MXN + IVA/mes. Contrato mensual sin permanencia forzosa.",
    "/terminos",
    `
<header><a href="/">Kaax AI</a></header>
<main>
  <h1>Términos y Condiciones de Servicio</h1>
  <p>Última actualización: enero 2026</p>
  <h2>1. Descripción del servicio</h2>
  <p>Kaax AI implementa agentes de inteligencia artificial en WhatsApp Business para automatización de ventas y atención al cliente B2B.</p>
  <h2>2. Precio</h2>
  <p>El servicio tiene un costo de $18,000 MXN mensuales más IVA (16%), bajo modalidad de suscripción mensual renovable.</p>
  <h2>3. Vigencia</h2>
  <p>Contrato mensual renovable automáticamente. Cancelación con 5 días hábiles de aviso previo al siguiente ciclo.</p>
  <h2>4. Servicios incluidos</h2>
  <ul>
    <li>Agente de IA personalizado en WhatsApp Business</li>
    <li>Tokens ilimitados de procesamiento</li>
    <li>Integración con CRM del cliente</li>
    <li>Soporte técnico mensual</li>
  </ul>
  <p>La licencia del CRM corre por cuenta del cliente.</p>
  <h2>5. Jurisdicción</h2>
  <p>Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Jurisdicción: tribunales de la Ciudad de México.</p>
</main>
<footer><p>© 2026 Kaax AI</p><a href="/">Inicio</a> · <a href="/privacidad">Política de Privacidad</a></footer>
`
  ),
};

export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true; // no UA → prerender
  // Only serve prerender to clearly-identified non-browser agents.
  // When in doubt, return false so real users always get the SPA.
  return /googlebot|google-inspectiontool|bingbot|yandexbot|duckduckbot|slurp|bingpreview|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot-linkexpanding|telegrambot|discordbot|applebot|whatsapp\/|iframely|embedly|vkshare|ahrefsbot|semrushbot|mj12bot|ia_archiver|gptbot|chatgpt-user|oai-searchbot|anthropic-ai|claudebot|googleother|python-requests|python-urllib|curl\/|wget\/|go-http-client|java\/|ruby\/|axios\/|node-fetch|undici|node\.js/i.test(userAgent);
}
