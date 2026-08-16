export type Lang = "en" | "pt" | "es";

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  pt: "PT",
  es: "ES",
};

export const translations: Record<
  Lang,
  {
    nav: { services: string; about: string; area: string; contact: string };
    textUs: string;
    badge: string;
    heroTitle: string;
    heroBody: string;
    textUsAt: string;
    ourNumber: string;
    call: string;
    differentiators: {
      title: string;
      body: string;
    }[];
    servicesTitle: string;
    servicesSubtitle: string;
    noServices: string;
    perMin: string;
    areaTitle: string;
    spaceCoastTitle: string;
    spaceCoastBody: string;
    treasureCoastTitle: string;
    treasureCoastBody: string;
    ctaTitle: string;
    hours: string;
    footerRights: string;
  }
> = {
  en: {
    nav: {
      services: "Services",
      about: "About",
      area: "Service Area",
      contact: "Contact",
    },
    textUs: "Text Us",
    badge: "Space Coast & Treasure Coast",
    heroTitle: "Professional cleaning, tailored to you.",
    heroBody:
      "J&A Cleaning Group brings a trained, fully insured team to every home — with a personalized approach built around what you actually need, not a one-size-fits-all checklist.",
    textUsAt: "Text us at",
    ourNumber: "our number",
    call: "Call",
    differentiators: [
      {
        title: "Personalized service",
        body: "Every home is different. We tailor the cleaning plan to your specific needs, not a generic checklist.",
      },
      {
        title: "Trained team",
        body: "Our cleaners are trained and consistent, so you get the same reliable quality every visit.",
      },
      {
        title: "Fully insured",
        body: "Work with confidence — J&A Cleaning Group is insured, protecting your home and peace of mind.",
      },
    ],
    servicesTitle: "Services",
    servicesSubtitle: "Text us and we'll help you pick the right fit.",
    noServices: "Services coming soon — text us for a custom quote.",
    perMin: "min",
    areaTitle: "Where we work",
    spaceCoastTitle: "Space Coast",
    spaceCoastBody: "Brevard County",
    treasureCoastTitle: "Treasure Coast",
    treasureCoastBody: "Indian River County — Vero Beach",
    ctaTitle: "Ready for a cleaner home?",
    hours: "Monday–Friday, 8am–6pm",
    footerRights: "All rights reserved.",
  },
  pt: {
    nav: {
      services: "Serviços",
      about: "Sobre",
      area: "Área de Atendimento",
      contact: "Contato",
    },
    textUs: "Mande SMS",
    badge: "Space Coast & Treasure Coast",
    heroTitle: "Limpeza profissional, feita sob medida pra você.",
    heroBody:
      "A J&A Cleaning Group leva uma equipe treinada e segurada pra cada casa — com um atendimento personalizado baseado no que você realmente precisa, não uma lista genérica.",
    textUsAt: "Mande SMS pra",
    ourNumber: "nosso número",
    call: "Ligar",
    differentiators: [
      {
        title: "Atendimento personalizado",
        body: "Cada casa é diferente. Ajustamos o plano de limpeza pra sua necessidade específica, não uma lista genérica.",
      },
      {
        title: "Equipe treinada",
        body: "Nossas profissionais são treinadas e consistentes, então você recebe a mesma qualidade confiável em toda visita.",
      },
      {
        title: "Seguro incluso",
        body: "Trabalhe com confiança — a J&A Cleaning Group tem seguro, protegendo sua casa e sua tranquilidade.",
      },
    ],
    servicesTitle: "Serviços",
    servicesSubtitle: "Mande uma mensagem que a gente te ajuda a escolher o certo.",
    noServices: "Serviços em breve — mande mensagem pra um orçamento personalizado.",
    perMin: "min",
    areaTitle: "Onde atendemos",
    spaceCoastTitle: "Space Coast",
    spaceCoastBody: "Brevard County",
    treasureCoastTitle: "Treasure Coast",
    treasureCoastBody: "Indian River County — Vero Beach",
    ctaTitle: "Pronta pra uma casa mais limpa?",
    hours: "Segunda a sexta, 8h às 18h",
    footerRights: "Todos os direitos reservados.",
  },
  es: {
    nav: {
      services: "Servicios",
      about: "Nosotros",
      area: "Área de Servicio",
      contact: "Contacto",
    },
    textUs: "Escríbenos",
    badge: "Space Coast & Treasure Coast",
    heroTitle: "Limpieza profesional, hecha a tu medida.",
    heroBody:
      "J&A Cleaning Group lleva un equipo capacitado y asegurado a cada hogar — con un servicio personalizado basado en lo que realmente necesitas, no una lista genérica.",
    textUsAt: "Escríbenos al",
    ourNumber: "nuestro número",
    call: "Llamar",
    differentiators: [
      {
        title: "Servicio personalizado",
        body: "Cada hogar es diferente. Ajustamos el plan de limpieza a tus necesidades específicas, no una lista genérica.",
      },
      {
        title: "Equipo capacitado",
        body: "Nuestro personal está capacitado y es consistente, así obtienes la misma calidad confiable en cada visita.",
      },
      {
        title: "Totalmente asegurados",
        body: "Trabaja con confianza — J&A Cleaning Group está asegurada, protegiendo tu hogar y tu tranquilidad.",
      },
    ],
    servicesTitle: "Servicios",
    servicesSubtitle: "Escríbenos y te ayudamos a elegir la opción correcta.",
    noServices: "Servicios próximamente — escríbenos para una cotización personalizada.",
    perMin: "min",
    areaTitle: "Dónde trabajamos",
    spaceCoastTitle: "Space Coast",
    spaceCoastBody: "Condado de Brevard",
    treasureCoastTitle: "Treasure Coast",
    treasureCoastBody: "Condado de Indian River — Vero Beach",
    ctaTitle: "¿Lista para un hogar más limpio?",
    hours: "Lunes a viernes, 8am–6pm",
    footerRights: "Todos los derechos reservados.",
  },
};
