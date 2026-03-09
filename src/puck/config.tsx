"use client";

import type { Config } from "@measured/puck";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { Reviews } from "@/components/Reviews";
import { Location } from "@/components/Location";
import { FAQ } from "@/components/FAQ";
import { BookingForm } from "@/components/BookingForm";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Footer } from "@/components/Footer";

// Puck configuration: registers existing Innovakine components as drag-and-drop blocks
// Each component is wrapped so Puck can render it on the canvas and in the final output

type PuckProps = {
  HeroBlock: Record<string, never>;
  AboutBlock: Record<string, never>;
  ServicesBlock: Record<string, never>;
  TeamBlock: Record<string, never>;
  ReviewsBlock: Record<string, never>;
  LocationBlock: Record<string, never>;
  FAQBlock: Record<string, never>;
  BookingFormBlock: Record<string, never>;
  InstagramFeedBlock: Record<string, never>;
  FooterBlock: Record<string, never>;
  TextBlock: {
    text: string;
    alignment: "left" | "center" | "right";
    variant: "heading" | "subheading" | "body";
  };
  SpacerBlock: {
    height: number;
  };
};

export const puckConfig: Config<PuckProps> = {
  categories: {
    "Secciones Principales": {
      components: [
        "HeroBlock",
        "AboutBlock",
        "ServicesBlock",
        "TeamBlock",
        "ReviewsBlock",
      ],
    },
    "Secciones Secundarias": {
      components: [
        "LocationBlock",
        "FAQBlock",
        "BookingFormBlock",
        "InstagramFeedBlock",
        "FooterBlock",
      ],
    },
    "Elementos Básicos": {
      components: ["TextBlock", "SpacerBlock"],
    },
  },
  components: {
    HeroBlock: {
      label: "🏠 Hero (Portada)",
      fields: {},
      defaultProps: {},
      render: () => <Hero />,
    },
    AboutBlock: {
      label: "ℹ️ Acerca de Nosotros",
      fields: {},
      defaultProps: {},
      render: () => <About />,
    },
    ServicesBlock: {
      label: "⚕️ Servicios",
      fields: {},
      defaultProps: {},
      render: () => <Services />,
    },
    TeamBlock: {
      label: "👥 Equipo",
      fields: {},
      defaultProps: {},
      render: () => <Team />,
    },
    ReviewsBlock: {
      label: "⭐ Reseñas",
      fields: {},
      defaultProps: {},
      render: () => <Reviews />,
    },
    LocationBlock: {
      label: "📍 Ubicación",
      fields: {},
      defaultProps: {},
      render: () => <Location />,
    },
    FAQBlock: {
      label: "❓ Preguntas Frecuentes",
      fields: {},
      defaultProps: {},
      render: () => <FAQ />,
    },
    BookingFormBlock: {
      label: "📅 Formulario de Reserva",
      fields: {},
      defaultProps: {},
      render: () => <BookingForm />,
    },
    InstagramFeedBlock: {
      label: "📸 Feed de Instagram",
      fields: {},
      defaultProps: {},
      render: () => <InstagramFeed />,
    },
    FooterBlock: {
      label: "🔗 Footer",
      fields: {},
      defaultProps: {},
      render: () => <Footer />,
    },
    TextBlock: {
      label: "📝 Bloque de Texto",
      fields: {
        text: {
          type: "textarea",
          label: "Contenido",
        },
        alignment: {
          type: "select",
          label: "Alineación",
          options: [
            { label: "Izquierda", value: "left" },
            { label: "Centro", value: "center" },
            { label: "Derecha", value: "right" },
          ],
        },
        variant: {
          type: "select",
          label: "Estilo",
          options: [
            { label: "Título", value: "heading" },
            { label: "Subtítulo", value: "subheading" },
            { label: "Párrafo", value: "body" },
          ],
        },
      },
      defaultProps: {
        text: "Escribe tu texto aquí...",
        alignment: "left",
        variant: "body",
      },
      render: ({ text, alignment, variant }) => {
        const styles: Record<string, string> = {
          heading: "text-3xl md:text-4xl font-black text-navy",
          subheading: "text-xl md:text-2xl font-bold text-navy/80",
          body: "text-base md:text-lg text-text-muted font-medium leading-relaxed",
        };
        return (
          <div className={`container py-8 text-${alignment}`}>
            <p className={styles[variant]}>{text}</p>
          </div>
        );
      },
    },
    SpacerBlock: {
      label: "↕️ Espaciador",
      fields: {
        height: {
          type: "number",
          label: "Altura (px)",
          min: 8,
          max: 200,
        },
      },
      defaultProps: {
        height: 48,
      },
      render: ({ height }) => <div style={{ height: `${height}px` }} />,
    },
  },
};
