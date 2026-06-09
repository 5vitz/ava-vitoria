"use client";

import React, { useState, useEffect } from "react";
import { saveDesignSystem } from "./actions";
import styles from "./design-system.module.css";

// Seleção cirúrgica de 50 fontes do Google Fonts (Títulos de impacto, corpo legível e mono conceitual)
const GOOGLE_FONTS = [
  // Serif (Títulos Expressivos / Clássicos / Luxo)
  "Playfair Display", "Cormorant Garamond", "Cinzel Decorative", "Cinzel", "Fraunces", 
  "Bodoni Moda", "Prata", "Italiana", "Cardo", "DM Serif Display",
  
  // Sans-Serif (Títulos Streetwear / Bold / Modernos)
  "Outfit", "Syne", "Unbounded", "Space Grotesk", "Archivo", 
  "Montserrat", "Bebas Neue", "Oswald", "Syncopate", "Lexend", 
  "Archivo Black", "Anton", "Kanit", "Heebo", "Tenor Sans", 
  "Julius Sans One", "Righteous", "Sora", "Urbanist", "Manrope",
  
  // Sans-Serif (Corpo de Texto / Legibilidade)
  "Plus Jakarta Sans", "Poppins", "Inter", "Roboto", "Lato", 
  "Open Sans", "Nunito", "Fira Sans", "Work Sans", "DM Sans", 
  "Rubik", "Quicksand", "Josefin Sans", "Barlow", "Raleway", 
  "Albert Sans", "Spline Sans", "Chivo",
  
  // Monospace (Conceitual / Tech / Detalhes)
  "Space Mono", "Sometype Mono"
];

interface DesignSystemFormProps {
  initialData: {
    theme: string;
    colors: {
      bg: string;
      accent: string;
      text_primary: string;
      text_secondary: string;
      border: string;
    };
    fonts: {
      title_family: string;
      body_family: string;
      title_weight: string;
      body_weight: string;
    };
    effects: {
      border_width: string;
      backdrop_blur: string;
    };
  };
}

export default function DesignSystemForm({ initialData }: DesignSystemFormProps) {
  const [colors, setColors] = useState(initialData.colors);
  const [fonts, setFonts] = useState(initialData.fonts);
  const [effects, setEffects] = useState(initialData.effects);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  // Carregar as fontes selecionadas no head dinamicamente apenas para o preview visual do formulário
  useEffect(() => {
    const linkId = "google-fonts-preview-link";
    let linkElement = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = linkId;
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }

    const titleFontUrl = fonts.title_family.replace(/ /g, "+");
    const bodyFontUrl = fonts.body_family.replace(/ /g, "+");
    linkElement.href = `https://fonts.googleapis.com/css2?family=${titleFontUrl}:wght@400;700&family=${bodyFontUrl}:wght@300;400;700&display=swap`;
  }, [fonts.title_family, fonts.body_family]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const result = await saveDesignSystem({
        colors,
        fonts,
        effects,
      });

      if (result.success) {
        setStatus({
          type: "success",
          message: "Design System atualizado com sucesso! As novas configurações foram aplicadas à vitrine.",
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Ocorreu um erro ao tentar salvar as configurações.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.formGrid}>
      
      {/* 1. SEÇÃO DE CORES */}
      <section className={styles.panelSection}>
        <h3 className={styles.sectionTitle}>Paleta de Cores</h3>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Fundo Principal (Vinho/Escuro)</label>
          <div className={styles.colorPickerWrapper}>
            <input
              type="color"
              className={styles.colorPicker}
              value={colors.bg}
              onChange={(e) => setColors({ ...colors, bg: e.target.value })}
            />
            <input
              type="text"
              className={styles.colorInput}
              value={colors.bg}
              onChange={(e) => setColors({ ...colors, bg: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Cor de Destaque (Dourado)</label>
          <div className={styles.colorPickerWrapper}>
            <input
              type="color"
              className={styles.colorPicker}
              value={colors.accent}
              onChange={(e) => setColors({ ...colors, accent: e.target.value })}
            />
            <input
              type="text"
              className={styles.colorInput}
              value={colors.accent}
              onChange={(e) => setColors({ ...colors, accent: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Texto Principal</label>
          <div className={styles.colorPickerWrapper}>
            <input
              type="color"
              className={styles.colorPicker}
              value={colors.text_primary}
              onChange={(e) => setColors({ ...colors, text_primary: e.target.value })}
            />
            <input
              type="text"
              className={styles.colorInput}
              value={colors.text_primary}
              onChange={(e) => setColors({ ...colors, text_primary: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Texto Secundário</label>
          <div className={styles.colorPickerWrapper}>
            <input
              type="color"
              className={styles.colorPicker}
              value={colors.text_secondary}
              onChange={(e) => setColors({ ...colors, text_secondary: e.target.value })}
            />
            <input
              type="text"
              className={styles.colorInput}
              value={colors.text_secondary}
              onChange={(e) => setColors({ ...colors, text_secondary: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Borda / Divisor</label>
          <input
            type="text"
            className={styles.colorInput}
            value={colors.border}
            onChange={(e) => setColors({ ...colors, border: e.target.value })}
            placeholder="Ex: rgba(255, 255, 255, 0.1)"
          />
        </div>
      </section>

      {/* 2. SEÇÃO DE TIPOGRAFIA E EFEITOS */}
      <section className={styles.panelSection}>
        <h3 className={styles.sectionTitle}>Tipografia & Efeitos</h3>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Fonte de Título</label>
          <select
            className={styles.select}
            value={fonts.title_family}
            onChange={(e) => setFonts({ ...fonts, title_family: e.target.value })}
          >
            {GOOGLE_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Peso do Título</label>
          <select
            className={styles.select}
            value={fonts.title_weight}
            onChange={(e) => setFonts({ ...fonts, title_weight: e.target.value })}
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="600">Semi-Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra-Bold (800)</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Fonte do Corpo / UI</label>
          <select
            className={styles.select}
            value={fonts.body_family}
            onChange={(e) => setFonts({ ...fonts, body_family: e.target.value })}
          >
            {GOOGLE_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Peso do Corpo</label>
          <select
            className={styles.select}
            value={fonts.body_weight}
            onChange={(e) => setFonts({ ...fonts, body_weight: e.target.value })}
          >
            <option value="200">Extra-Light (200)</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Desfoque do Carrossel (Backdrop Blur px)</label>
          <input
            type="number"
            className={styles.inputNumber}
            value={effects.backdrop_blur.replace("px", "")}
            onChange={(e) => setEffects({ ...effects, backdrop_blur: `${e.target.value}px` })}
            placeholder="Ex: 12"
            min="0"
            max="40"
          />
        </div>
      </section>

      {/* 3. SEÇÃO DE PREVIEW EM TEMPO REAL */}
      <section className={`${styles.panelSection} ${styles.actionsSection}`} style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}>
        <h3 className={styles.sectionTitle}>Visualização em Tempo Real (Live Preview)</h3>
        
        <div 
          className={styles.previewBox}
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h4 
            className={styles.previewTitle}
            style={{
              fontFamily: `"${fonts.title_family}", sans-serif`,
              fontWeight: fonts.title_weight,
              color: colors.text_primary,
            }}
          >
            AVA Streetwear Piece 01
          </h4>
          <p 
            className={styles.previewBody}
            style={{
              fontFamily: `"${fonts.body_family}", sans-serif`,
              fontWeight: fonts.body_weight,
              color: colors.text_secondary,
            }}
          >
            Peça conceitual exclusiva desenvolvida sob o manifesto da alta-costura streetwear com corte oversized e algodão premium de alta gramatura.
          </p>
          <span
            style={{
              fontFamily: `"${fonts.body_family}", sans-serif`,
              fontWeight: "600",
              color: colors.accent,
              fontSize: "1.1rem",
              marginTop: "5px"
            }}
          >
            R$ 499,00
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "15px" }}>
          <div>
            {status.type && (
              <div className={`${styles.statusMessage} ${status.type === "success" ? styles.statusSuccess : styles.statusError}`}>
                {status.message}
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </section>

    </form>
  );
}
