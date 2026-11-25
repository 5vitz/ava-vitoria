export interface WritingMatrix26 {
  // I. Eixo Ontológico (01-07)
  "01_ontological_essence": string;
  "02_archetypal_symbolism": string;
  "03_emotional_gravity": string;
  "04_primary_subject": string;
  "05_satellite_elements": string;
  "06_narrative_context": string;
  "07_typography_and_epigraphy": string;

  // II. Eixo Epistemológico (08-16)
  "08_spatial_density_ratio": string;
  "09_compositional_geometry": string;
  "10_focal_anchor_point": string;
  "11_dynamic_force_vectors": string;
  "12_lighting_source_and_angle": string;
  "13_chiaroscuro_depth": string;
  "14_chromatic_hierarchy": string;
  "15_scale_and_proportions": string;
  "16_visual_silence_level": string;

  // III. Eixo Metodológico (17-24)
  "17_linework_typology": string;
  "18_stroke_weight_and_pressure": string;
  "19_mass_and_fill_treatment": string;
  "20_edge_definition": string;
  "21_texture_and_surface_grain": string;
  "22_optical_effects": string;
  "23_framing_and_containment": string;
  "24_medium_simulation": string;

  // IV. Extensão MDV Avançada (25-26)
  "25_zonal_complexity_map": string;
  "26_autonomous_signature_dna": string;
}

export interface MatrixKeyMetadata {
  key: keyof WritingMatrix26;
  number: string;
  label: string;
  axis: "I_ONTOLOGICO" | "II_EPISTEMOLOGICO" | "III_METODOLOGICO" | "IV_EXTENSAO_MDV";
  axisTitle: string;
  mutationZone: "ZONA_1_IDENTIDADE" | "ZONA_2_GEOMETRIA" | "ZONA_3_HERANCA_FISICA";
  mutationZoneLabel: string;
  description: string;
}

export const MATRIX_26_KEYS_METADATA: MatrixKeyMetadata[] = [
  // EIXO I — ONTOLÓGICO
  {
    key: "01_ontological_essence",
    number: "01",
    label: "Essência Ontológica",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Tese central e mensagem nuclear conectada ao Manifesto da Marca."
  },
  {
    key: "02_archetypal_symbolism",
    number: "02",
    label: "Simbolismo Arquetípico",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Arquétipos primordiais e símbolos presentes (Criador, Rebelde, Explorador, Amante)."
  },
  {
    key: "03_emotional_gravity",
    number: "03",
    label: "Gravidade Emocional",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Peso anímico evocado: solenidade, triunfo contido, serenidade, potência."
  },
  {
    key: "04_primary_subject",
    number: "04",
    label: "Sujeito Primário (Protagonista)",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Identificação anatômica, traje e morfologia autoral do protagonista da cena."
  },
  {
    key: "05_satellite_elements",
    number: "05",
    label: "Elementos Satélites",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Elementos orbitais ou secundários submetidos ao filtro rigoroso da Estética da Subtração."
  },
  {
    key: "06_narrative_context",
    number: "06",
    label: "Contexto Narrativo & Plano de Fundo",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Cenário espacial e temporal (vácuo atemporal #000000 ou fundo pedra/marfim #DDDDD8 / #FEFCF5)."
  },
  {
    key: "07_typography_and_epigraphy",
    number: "07",
    label: "Tipografia & Epigrafia",
    axis: "I_ONTOLOGICO",
    axisTitle: "I. Eixo Ontológico (Significado, Alma & Arquétipo)",
    mutationZone: "ZONA_1_IDENTIDADE",
    mutationZoneLabel: "🔴 Zona 1: Mutação de Identidade",
    description: "Tratamento de micropoesia, coordenadas ou ausência pura de texto sobre a arte."
  },

  // EIXO II — EPISTEMOLÓGICO
  {
    key: "08_spatial_density_ratio",
    number: "08",
    label: "Razão de Densidade Espacial (Ma)",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Imposição mandatória de 60% a 70% de espaço negativo livre vs. massa gráfica ativa."
  },
  {
    key: "09_compositional_geometry",
    number: "09",
    label: "Geometria Composicional & Escorço 3D",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_2_GEOMETRIA",
    mutationZoneLabel: "🟡 Zona 2: Quebra Geométrica/Angular",
    description: "Estrutura geométrica e perspectiva óptica (ex: Extreme Z-Axis 3D Foreshortening 75°)."
  },
  {
    key: "10_focal_anchor_point",
    number: "10",
    label: "Ponto de Ancoragem Focal",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_2_GEOMETRIA",
    mutationZoneLabel: "🟡 Zona 2: Quebra Geométrica/Angular",
    description: "Coordenadas do centro de gravidade visual na peça (ex: x: 50%, y: 40-45%)."
  },
  {
    key: "11_dynamic_force_vectors",
    number: "11",
    label: "Vetores de Força Dinâmica",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_2_GEOMETRIA",
    mutationZoneLabel: "🟡 Zona 2: Quebra Geométrica/Angular",
    description: "Direcionalidade e choque angular do movimento (ex: propulsão diagonal 45°/60° vs. gravidade 90°)."
  },
  {
    key: "12_lighting_source_and_angle",
    number: "12",
    label: "Fonte e Ângulo de Iluminação",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_2_GEOMETRIA",
    mutationZoneLabel: "🟡 Zona 2: Quebra Geométrica/Angular",
    description: "Origem, direção e natureza da luz (rim light de recorte, zênite, contra-luz)."
  },
  {
    key: "13_chiaroscuro_depth",
    number: "13",
    label: "Profundidade Chiaroscuro",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Alto contraste dramático sem sombras sujas, garantindo nitidez na malha."
  },
  {
    key: "14_chromatic_hierarchy",
    number: "14",
    label: "Hierarquia Cromática (HEX)",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Paleta estrita com códigos HEX dominantes, acentos metálicos/nobres e fundo."
  },
  {
    key: "15_scale_and_proportions",
    number: "15",
    label: "Escala e Proporções",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_2_GEOMETRIA",
    mutationZoneLabel: "🟡 Zona 2: Quebra Geométrica/Angular",
    description: "Relação de proporções corporais/espaciais (haute-couture 1:8.5 ou amplificação em perspectiva)."
  },
  {
    key: "16_visual_silence_level",
    number: "16",
    label: "Nível de Silêncio Visual (E = mc²)",
    axis: "II_EPISTEMOLOGICO",
    axisTitle: "II. Eixo Epistemológico (Leis Visuais & Espaço)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Máxima densidade de significado com o mínimo de linhas e zero ruído de fundo."
  },

  // EIXO III — METODOLÓGICO
  {
    key: "17_linework_typology",
    number: "17",
    label: "Tipologia do Traço & Terminação",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Bico de pena 1px hairline, hachuras ou Sumi-e com terminações abertas (open-ended tapered)."
  },
  {
    key: "18_stroke_weight_and_pressure",
    number: "18",
    label: "Espessura e Pressão do Traço",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Distribuição matemática de linhas finas (1-3px), médias e blocos sólidos."
  },
  {
    key: "19_mass_and_fill_treatment",
    number: "19",
    label: "Tratamento de Massa e Preenchimento",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Volumetria expressa por densidade de traço e sombras vazadas (toque zero / soft-hand)."
  },
  {
    key: "20_edge_definition",
    number: "20",
    label: "Definição de Bordas (Canal Alfa)",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Bordas nítidas sem halos cinzentos; transição vetorial pura para canal alfa 100%."
  },
  {
    key: "21_texture_and_surface_grain",
    number: "21",
    label: "Textura e Grão Superficial",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Compatibilidade física com trama de algodão penteado Prime 180g e Oversized 220g."
  },
  {
    key: "22_optical_effects",
    number: "22",
    label: "Efeitos Ópticos & Ilusão Cinética",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Luminosidade do traço fino, profundidade 3D ou modulação cinética Op-Art."
  },
  {
    key: "23_framing_and_containment",
    number: "23",
    label: "Enquadramento e Contenção",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Silhueta aberta respirando na malha (proibição de borda retangular 'quadro na parede')."
  },
  {
    key: "24_medium_simulation",
    number: "24",
    label: "Simulação de Meio & Gabarito Industrial",
    axis: "III_METODOLOGICO",
    axisTitle: "III. Eixo Metodológico (Fisiologia do Traço & Técnica 300 DPI)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Matriz 300 DPI homologada para Dimona Silk HD (3435x4680px) e Reserva INK (4200x4800px)."
  },

  // EIXO IV — EXTENSÃO MDV AVANÇADA
  {
    key: "25_zonal_complexity_map",
    number: "25",
    label: "Mapa Zonal de Complexidade & Subtração (3x3)",
    axis: "IV_EXTENSAO_MDV",
    axisTitle: "IV. Extensão MDV Avançada (Mapa Zonal & Assinatura DNA)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "Mapeamento de onde se concentra a densidade de traços vs. zonas de subtração extrema (ex: rosto em sombra anônima)."
  },
  {
    key: "26_autonomous_signature_dna",
    number: "26",
    label: "Assinatura Autônoma DNA (Molho Secreto)",
    axis: "IV_EXTENSAO_MDV",
    axisTitle: "IV. Extensão MDV Avançada (Mapa Zonal & Assinatura DNA)",
    mutationZone: "ZONA_3_HERANCA_FISICA",
    mutationZoneLabel: "🟢 Zona 3: Herança Física Estética",
    description: "O fenômeno singular descoberto pelo MDV e reinterpretado na nova obra autoral."
  }
];

export interface ArtworkRecord {
  id: string;
  code: string;
  title: string;
  concept: string;
  project_folder: string;
  is_registered: boolean;
  coa_hash_sha256: string;
  mutated_keys_count: number;
  writing_matrix_26: WritingMatrix26;
  master_print_dimona_url: string;
  master_print_reserva_url: string;
  preview_image_url: string;
  default_supplier: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Compila automaticamente o Prompt to Image estruturado a partir das 26 Chaves Canônicas
 */
export function compilePromptFromMatrix26(matrix: WritingMatrix26, title?: string): string {
  if (!matrix) return "";

  const segments = [
    `[MASTER ARTWORK BLUEPRINT${title ? `: ${title.toUpperCase()}` : ""}]`,
    `• SUBJECT & ARCHETYPE: ${matrix["04_primary_subject"]} (${matrix["02_archetypal_symbolism"]}). ${matrix["01_ontological_essence"]}`,
    `• PERSPECTIVE & GEOMETRY: ${matrix["09_compositional_geometry"]}. Focal Anchor: ${matrix["10_focal_anchor_point"]}. Proportions: ${matrix["15_scale_and_proportions"]}.`,
    `• KINETIC FORCE VECTORS: ${matrix["11_dynamic_force_vectors"]}. Satellite Accents: ${matrix["05_satellite_elements"]}.`,
    `• BACKGROUND & NEGATIVE SPACE: ${matrix["06_narrative_context"]}. Spatial Ratio: ${matrix["08_spatial_density_ratio"]}. Framing: ${matrix["23_framing_and_containment"]}.`,
    `• CHROMATIC & LIGHTING: ${matrix["14_chromatic_hierarchy"]}. Lighting: ${matrix["12_lighting_source_and_angle"]}. Chiaroscuro: ${matrix["13_chiaroscuro_depth"]}.`,
    `• LINEWORK & DTG PHYSIOLOGY: ${matrix["17_linework_typology"]}. Stroke Weight: ${matrix["18_stroke_weight_and_pressure"]}. Mass Treatment: ${matrix["19_mass_and_fill_treatment"]}. Edge Quality: ${matrix["20_edge_definition"]}.`,
    `• ZONAL COMPLEXITY & SIGNATURE DNA: ${matrix["25_zonal_complexity_map"]}. Signature: ${matrix["26_autonomous_signature_dna"]}.`,
    `• NEGATIVE GUARDS: zero rectangular border, zero cartoon/clipart, zero literal camera/lens equipment on floor, zero text overlay (${matrix["07_typography_and_epigraphy"]}).`
  ];

  return segments.join("\n");
}

export const DEFAULT_MATRIX_JAZZ_3D: WritingMatrix26 = {
  "01_ontological_essence": "A suspensão gravitacional no ápice da liberdade humana: o corpo que rompe o espaço tridimensional sem limites.",
  "02_archetypal_symbolism": "A Bailarina de Jazz Contemporâneo em Voo Orbital (Fusões de Criador, Rebelde e Explorador).",
  "03_emotional_gravity": "Êxtase contido, potência atlética silenciosa e soberania estética de galeria.",
  "04_primary_subject": "Bailarina de jazz contemporâneo ultra-esguia em salto aéreo longo, vestindo macacão/body de malha colante preta esculpida (sleek form-fitting black jazz unitard, zero tutu, zero saia).",
  "05_satellite_elements": "Fitas caligráficas em ouro ocre metálico (#C29E5D), cortes diagonais de nanquim Sumi-e (#0A0C0E) e cortina gravitacional de fios capilares verticais a 90°.",
  "06_narrative_context": "Fundo pedra/marfim quente minimalista (#DDDDD8 / #FEFCF5) com 63% de espaço vazio aberto, sem objetos ou equipamentos no solo.",
  "07_typography_and_epigraphy": "Ausência total de texto ou tipografia sobre a obra (100% pureza gráfica).",
  "08_spatial_density_ratio": "63% de espaço negativo livre (conceito oriental de Ma) vs. 37% de massa gráfica ativa.",
  "09_compositional_geometry": "Extreme Z-Axis 3D Foreshortening (75° upward three-quarter floor viewpoint: foreground limb looming large, trailing limb receding in depth).",
  "10_focal_anchor_point": "Ancoragem dinâmica no centro-superior do peito (x: 50%, y: 42%), projetando o salto sobre o observador.",
  "11_dynamic_force_vectors": "Choque cinético bipartido: vetor de propulsão diagonal em perspectiva 3D no eixo Z vs. fios gravitacionais estritos a 90° caindo até uma linha horizontal mínima na base.",
  "12_lighting_source_and_angle": "Iluminação de recorte (rim light) zenital-lateral esculpindo o volume 3D por baixo do tronco arqueado e pernas com reflexos branco puro (#FFFFFF).",
  "13_chiaroscuro_depth": "Chiaroscuro volumétrico 3D de altíssimo contraste entre o preto obsidiana (#0A0C0E) do traje e a luz de recorte branca.",
  "14_chromatic_hierarchy": "Tríade rigorosa: Preto Obsidiana (#0A0C0E) dominante (16%), Ouro Ocre Escovado (#C29E5D) em acento nobre (4%) e Branco Puro (#FFFFFF) de luz sobre fundo pedra (#DDDDD8).",
  "15_scale_and_proportions": "Proporções alongadas de alta-costura (1:8.5) amplificadas pelo escorço tridimensional no eixo Z.",
  "16_visual_silence_level": "Estado E = mc²: máxima tensão cinética e profundidade 3D com zero poluição de cenário.",
  "17_linework_typology": "Fusão de traço bico de pena 1px hairline, pinceladas gestuais de Action Painting / Sumi-e e terminações abertas (open-ended tapered strokes).",
  "18_stroke_weight_and_pressure": "72.4% de linhas finas (1px a 3px), 20.8% de pinceladas médias caligráficas e apenas 6.8% de ancoragem sólida no núcleo.",
  "19_mass_and_fill_treatment": "Corpo esculpido por contraste de sombra vazada e feixes direcionais, garantindo toque leve (soft-hand) na fibra do algodão.",
  "20_edge_definition": "Bordas nítidas e pontas afiladas que se dissolvem organicamente na malha, sem halo cinza e sem moldura retangular.",
  "21_texture_and_surface_grain": "Textura orgânica de nanquim seco e folha de ouro escovada compatível com algodão penteado Prime 180g / Oversized 220g.",
  "22_optical_effects": "Ilusão cinética de voo tridimensional acima do observador gerada pelo escorço de 75° e pelo contraponto dos fios verticais.",
  "23_framing_and_containment": "Silhueta 100% aberta respirando na peça (proibição absoluta do efeito 'quadro pregado na parede').",
  "24_medium_simulation": "Matriz autoral Fine-Art 300 DPI para estamparia industrial Silk HD (Dimona 3435x4680px) e DTG Kornit (Reserva INK 4200x4800px).",
  "25_zonal_complexity_map": "Subtração extrema nos quadrantes superiores laterais e rosto 100% em sombra preta anônima (sem feições faciais); alta densidade no núcleo torácico; ritmo vertical de alta frequência no quadrante inferior central.",
  "26_autonomous_signature_dna": "Desconstrução Cinética Bipartida em Escorço 3D (75° Z-Axis): o corpo salta por cima do ponto de vista em perspectiva profunda enquanto derrete em fios gravitacionais de 90° de nanquim e ouro."
};

export const DEFAULT_MATRIX_CUBISTA: WritingMatrix26 = {
  ...DEFAULT_MATRIX_JAZZ_3D,
  "01_ontological_essence": "A desconstrução geométrica da metrópole insular: Vitória/ES vista sob o prisma do cubismo urbano contemporâneo.",
  "02_archetypal_symbolism": "O Criador & O Explorador Urbano (Arquitetura, Ritmo e Identidade Capixaba).",
  "03_emotional_gravity": "Vanguarda intelectual, presença arquitetônica e sofisticação cosmopolita.",
  "04_primary_subject": "Composição cubista multifacetada integrando perfis humanos abstratos, relevos da baía e blocos geométricos de grafite de galeria.",
  "05_satellite_elements": "Linhas de construção áurea, planos angulares intersectados e micro-hachuras de gravura.",
  "06_narrative_context": "Vácuo transparente pensado para fusão direta em malha Preta ou Off-White 100% algodão.",
  "09_compositional_geometry": "Triangulação cubista assimétrica equilibrada no eixo vertical central (Proporção Áurea Phi).",
  "11_dynamic_force_vectors": "Planos angulares convergentes a 30° e 60° com estabilização ortogonal.",
  "14_chromatic_hierarchy": "Alto contraste autoral adaptado para camada alfa transparente 300 DPI.",
  "25_zonal_complexity_map": "Concentração poliédrica no núcleo peitoral (78% densidade) com dissipação angular nas bordas externas.",
  "26_autonomous_signature_dna": "Geometria Cubista Têxtil: planos facetados que utilizam a própria cor da malha de algodão como sombra estrutural."
};

export const DEFAULT_MATRIX_CORUJA: WritingMatrix26 = {
  ...DEFAULT_MATRIX_JAZZ_3D,
  "01_ontological_essence": "A sabedoria vigilante que enxerga na escuridão: visão soberana acima do ruído urbano.",
  "02_archetypal_symbolism": "A Coruja Guardiã (O Sábio + O Rebelde Noturno).",
  "03_emotional_gravity": "Mistério, foco penetrante e serenidade inabalável.",
  "04_primary_subject": "Coruja em voo frontal simétrico com plumagem desconstruída em linhas geométricas sagradas e olhar hipnótico.",
  "05_satellite_elements": "Arcos orbitais finos de 1px e feixes geométricos radiais sutis.",
  "06_narrative_context": "Isolamento absoluto em canal alfa transparente para aplicação em peito ou costas.",
  "09_compositional_geometry": "Simetria bilateral sagrada em formato de escudo/V ascendente.",
  "11_dynamic_force_vectors": "Envergadura radial expansiva partindo do centro do peito para os ombros.",
  "25_zonal_complexity_map": "Foco magnético de alta precisão na região dos olhos e bico; extremidades das asas em traço aberto.",
  "26_autonomous_signature_dna": "Plumagem Bionômica Vetorial: fusão de gravura clássica estilo Dürer com geometria sagrada minimalista."
};

export const DEFAULT_MATRIX_ALTINHA: WritingMatrix26 = {
  ...DEFAULT_MATRIX_JAZZ_3D,
  "01_ontological_essence": "A arte do improviso coletivo nas areias de Vitória: a bola que nunca toca o chão.",
  "02_archetypal_symbolism": "O Amante, O Explorador & A Amizade (Tríade AVA: Atitude, Valorização, Amizade).",
  "03_emotional_gravity": "Fluidez solar, camaradagem autêntica e plasticidade acrobática.",
  "04_primary_subject": "Políptico de 4 movimentos plásticos da Altinha (Escorpião, Bicicleta, Shark Attack e Chapa) extraídos da matriz vetorial ALTA.ai.",
  "05_satellite_elements": "Selo tipográfico circular 'Passa a Bola — Altinha Addict' e linhas de movimento cinético.",
  "06_narrative_context": "Composição limpa sem fundo para estamparia Frente + Costas em algodão Prime 180g.",
  "09_compositional_geometry": "Grid modular equilibrado (4 quadros de ação + selo de nuca/peito).",
  "11_dynamic_force_vectors": "Vetores acrobáticos circulares mantendo a bola no centro gravitacional.",
  "25_zonal_complexity_map": "Distribuição harmônica entre os 4 movimentos com amplo respiro entre os atletas.",
  "26_autonomous_signature_dna": "Acrobacia Praiana Minimalista: captura vetorial da anatomia em suspensão."
};
