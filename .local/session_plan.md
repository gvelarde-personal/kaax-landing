# Objective
Add a Services and Pricing section to the Kaax AI landing page reflecting the real product offering: a WhatsApp AI agent for lead automation and customer service at $18,000 MXN + IVA/month with unlimited tokens and CRM integration.

# Tasks

### T001: Add Services section below Features
- **Blocked By**: []
- **Details**:
  - Add a new `#servicios` section between the Features section and the Lead Capture form in `client/src/pages/Home.tsx`
  - Content: Describe the core product — WhatsApp AI Agent that attends customers 24/7 and qualifies leads automatically
  - List what's included:
    - Agente de IA personalizado en WhatsApp
    - Tokens ilimitados (no hay límite de conversaciones)
    - Integración con CRM (licencia corre por cuenta del cliente)
    - Configuración y soporte incluidos
  - Mention compatible CRMs: HubSpot, open source (Odoo, SuiteCRM, etc.), y otros
  - Visual: Use a 2-column layout or feature list cards with icons from lucide-react
  - Files: `client/src/pages/Home.tsx`
  - Acceptance: Section visible on page with correct content and styling consistent with the dark theme

### T002: Add Pricing section
- **Blocked By**: [T001]
- **Details**:
  - Add a `#precios` section after the Services section in `client/src/pages/Home.tsx`
  - Show a single pricing card (one plan for now):
    - Plan name: "Agente Pro" or similar
    - Price: $18,000 MXN + IVA / mes
    - Highlight badge: "Oferta para los primeros 10 clientes"
    - Features list:
      - ✓ Agente de IA en WhatsApp
      - ✓ Tokens ilimitados
      - ✓ Integración con tu CRM actual
      - ✓ Configuración incluida
      - ✓ Soporte mensual incluido
      - ✗ Licencia de CRM no incluida (corre por el cliente)
    - CTA button linking to #capture
  - Visual: Card with primary color accent, contrasting "not included" item in muted color
  - Files: `client/src/pages/Home.tsx`
  - Acceptance: Pricing card renders correctly with all items, badge visible, CTA works

### T003: Update Navbar links
- **Blocked By**: []
- **Details**:
  - Add "Servicios" and "Precios" anchor links to the navbar in `client/src/components/Navbar.tsx`
  - These should scroll to `#servicios` and `#precios` sections respectively
  - Files: `client/src/components/Navbar.tsx`
  - Acceptance: Navbar links scroll to new sections smoothly
