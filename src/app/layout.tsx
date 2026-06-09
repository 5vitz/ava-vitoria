import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/db";
import { CartProvider } from "@/lib/cartContext";
import CartDrawer from "@/app/components/CartDrawer";

export const metadata: Metadata = {
  title: "AVA Vitória — Streetwear de Luxo",
  description: "Marca conceitual de streetwear inspirada na cultura urbana de Vitória.",
};

// Fallback de configurações estéticas caso o banco esteja inacessível ou sem dados
const defaultSettings = {
  theme: "dark",
  colors: {
    bg: "#1F080F",
    accent: "#D4AF37",
    text_primary: "#FFFFFF",
    text_secondary: "#A0A0A0",
    border: "rgba(255, 255, 255, 0.1)",
  },
  fonts: {
    title_family: "Outfit",
    body_family: "Plus Jakarta Sans",
    title_weight: "700",
    body_weight: "300",
  },
  effects: {
    border_width: "1px",
    backdrop_blur: "12px",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let config = defaultSettings;

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: {
        config_key: "design_system",
      },
    });
    if (settings) {
      config = settings.config_value as typeof defaultSettings;
    }
  } catch (error) {
    console.error("Erro ao carregar design system do banco, usando fallback:", error);
  }

  // Sanitizar os nomes das fontes para a URL do Google Fonts
  const titleFontFamily = config.fonts.title_family || "Outfit";
  const bodyFontFamily = config.fonts.body_family || "Plus Jakarta Sans";
  
  const titleFontUrl = titleFontFamily.replace(/ /g, "+");
  const bodyFontUrl = bodyFontFamily.replace(/ /g, "+");
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${titleFontUrl}:wght@400;600;700;800&family=${bodyFontUrl}:wght@200;300;400;500&display=swap`;

  return (
    <html lang="pt-BR">
      <head>
        {/* Pré-conexões recomendadas para melhorar performance de fontes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Importação dinâmica das fontes salvas no banco */}
        <link rel="stylesheet" href={googleFontsUrl} />

        {/* Injeção em tempo real das variáveis CSS estéticas da Alma da marca */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-bg: ${config.colors.bg};
            --color-accent: ${config.colors.accent};
            --color-text-primary: ${config.colors.text_primary};
            --color-text-secondary: ${config.colors.text_secondary};
            --color-border: ${config.colors.border};
            --font-title: "${titleFontFamily}", sans-serif;
            --font-body: "${bodyFontFamily}", sans-serif;
            --font-title-weight: ${config.fonts.title_weight || "700"};
            --font-body-weight: ${config.fonts.body_weight || "300"};
            --backdrop-blur: ${config.effects.backdrop_blur || "12px"};
            --border-width: ${config.effects.border_width || "1px"};
          }
        `}} />
      </head>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
