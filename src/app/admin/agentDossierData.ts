export interface AgentDossier {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'STANDBY';
  statusLabel: string;
  whatItDoes: string;
  whyItDoes: string;
  howItDoes: string;
  humanRoi: string;
}

export const AGENTS_DOSSIER: Record<string, AgentDossier> = {
  lincoln: {
    id: 'lincoln',
    name: 'Maestro Lincoln',
    role: 'Orquestrador Geral Técnico & Copiloto',
    department: '🏛️ Diretoria Executiva (Conselho dos 4 Sócios)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Coordena a arquitetura técnica, audita o código, mantém o handover de persistência e lidera os demais agentes sob a regência soberana do Genera e do Conselho.',
    whyItDoes: 'Garante que nenhuma decisão estratégica se perca e que o desenvolvimento siga a Metodologia do Machado (planejamento meticuloso antes da execução sem quebras).',
    howItDoes: 'Revisa cada detalhe antes de ir ao ar, testando todo o sistema para garantir que tudo funcione em harmonia e sem quebras operacionais.',
    humanRoi: 'Nenhum dos sócios precisa atuar como gerente técnico de TI nem gastar fortunas contratando CTO ou agências para traduzir demandas de negócios para código.'
  },
  cobrador_consenso: {
    id: 'cobrador_consenso',
    name: 'Cobrador de Consenso 4/4',
    role: 'Urna de Votação & Régua WhatsApp / E-mail',
    department: '🏛️ Diretoria Executiva (Conselho dos 4 Sócios)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Gerencia a Urna de Votação Societária em pautas críticas (como Precificação e Margens) e cobra automaticamente por WhatsApp e E-mail os sócios que ainda não votaram.',
    whyItDoes: 'Impede que decisões estratégicas vitais fiquem travadas por esquecimento ou sejam tomadas unilateralmente com risco de erro de preço.',
    howItDoes: 'Monitora os 4 crachás de voto (Armando, Flávio, Tripoint e Gustavo) na esteira e dispara lembretes insistentes no celular e e-mail dos pendentes até fechar o consenso.',
    humanRoi: 'Acaba com o desgaste pessoal de um sócio ter que ficar cobrando o outro no grupo de WhatsApp; o robô assume o papel de cobrar a decisão.'
  },
  sprint_prioritizer: {
    id: 'sprint_prioritizer',
    name: 'Sprint Prioritizer',
    role: 'Guardião de Metas & Prazos Comerciais',
    department: '🏛️ Diretoria Executiva (Conselho dos 4 Sócios)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Controla o cronograma da alta temporada (Inauguração de Natal em 01/Dezembro) e prioriza as tarefas de maior impacto comercial.',
    whyItDoes: 'Evita a dispersão de tempo da equipe com recursos secundários antes de garantir a operação das vendas.',
    howItDoes: 'Cruza os prazos de confecção das amostras na Dimona com o calendário de lançamento e reporta gargalos na Fila de Decisões.',
    humanRoi: 'Os sócios não perdem tempo criando cronogramas em planilhas que ninguém segue; o agente aponta exatamente o foco do dia.'
  },
  dr_lex: {
    id: 'dr_lex',
    name: 'Dr. Lex',
    role: 'Consultor Jurídico, Fiscal & Compliance',
    department: '01 · Jurídico & Compliance (Titular: Flávio)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Orienta a governança societária dos 4 sócios (Contrato Social 25% cada), a transição tributária MEI ➔ LTDA (Simples Nacional), o registro de marca no INPI e os termos legais (CDC e LGPD).',
    whyItDoes: 'Protege o patrimônio pessoal dos sócios contra multas fiscais da Receita Federal e autuações do Procon.',
    howItDoes: 'Aplica a legislação brasileira de comércio eletrônico (Lei 13.709/18, CDC Art. 49) e responde a consultas interativas no painel /admin/juridico.',
    humanRoi: 'Elimina custos com pareceres advocatícios avulsos para rotinas de e-commerce e protege a empresa contra processos de clientes mal-intencionados.'
  },
  software_architect: {
    id: 'software_architect',
    name: 'Software Architect',
    role: 'Arquiteto de Contratos & APIs',
    department: '03 · Engenharia & TI (Titular: Armando)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Desenha e valida os fluxos de integração entre o Next.js, o Bling ERP v3, o catálogo da Meta e webhooks.',
    whyItDoes: 'Impede que atualizações em serviços de terceiros derrubem a vitrine ou comprometam a segurança dos pagamentos.',
    howItDoes: 'Garante que todos os sistemas conversem na mesma língua — conectando a loja, o ERP e o Instagram sem ruídos ou dados truncados.',
    humanRoi: 'Os sócios nunca precisam abrir manuais técnicos de APIs para conectar marketplaces ou gateways.'
  },
  database_optimizer: {
    id: 'database_optimizer',
    name: 'Database Optimizer',
    role: 'Guardião da Integridade ACID & PostgreSQL',
    department: '03 · Engenharia & TI (Titular: Armando)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Resguarda a consistência relacional das tabelas de produtos, coleções, pedidos e usuários no PostgreSQL.',
    whyItDoes: 'Impede o pior pesadelo do e-commerce: o "overselling" (vender a mesma peça para dois clientes simultâneos por falha de estoque).',
    howItDoes: 'Trava a gaveta digital no milésimo de segundo da compra, assegurando que ninguém compre uma peça que já foi reservada por outro cliente.',
    humanRoi: 'Elimina totalmente a necessidade de conferir e acertar estoque manualmente no fim do expediente.'
  },
  minimal_change: {
    id: 'minimal_change',
    name: 'Minimal Change Engineer',
    role: 'Auditor de Escopo Cirúrgico',
    department: '03 · Engenharia & TI (Titular: Armando)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Inspeciona cada alteração no sistema para garantir que apenas o estritamente solicitado seja modificado (menor diff viável).',
    whyItDoes: 'Evita regressões (quando um desenvolvedor mexe em uma tela e quebra o layout de outra sem perceber).',
    howItDoes: 'Atua como um cirurgião que só toca no ponto exato do problema, impedindo alterações desnecessárias que possam estragar o que já está funcionando.',
    humanRoi: 'Acaba com o ciclo frustrante de "conserta uma coisa e estraga três", garantindo estabilidade permanente.'
  },
  sentinel_security: {
    id: 'sentinel_security',
    name: 'Sentinel Security',
    role: 'Segurança Cibernética & Portaria Digital',
    department: '03 · Engenharia & TI (Titular: Armando)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Vigia a loja 24 horas por dia contra invasões, tentativas de roubo de senhas, ataques de robôs maliciosos e fraudes em pagamentos.',
    whyItDoes: 'Uma grife lida com dados confidenciais e pagamentos. Qualquer brecha de segurança causaria prejuízo financeiro e pesadas multas da LGPD aos sócios.',
    howItDoes: 'Age como um vigilante patrimonial na porta da empresa: bloqueia na hora qualquer tentativa suspeita de forçar senhas ou acessar áreas restritas do sistema.',
    humanRoi: 'Economiza entre R$ 3.000 a R$ 8.000 mensais com consultorias de cibersegurança ou ferramentas externas caras de proteção.'
  },
  telemetria_infra: {
    id: 'telemetria_infra',
    name: 'Telemetria de Infraestrutura',
    role: 'Monitor da VPS Contabo & PM2',
    department: '03 · Engenharia & TI (Titular: Armando)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Supervisiona a saúde do servidor na nuvem (31.220.102.2), portas de rede, HTTPS Let\'s Encrypt e processo PM2.',
    whyItDoes: 'Garante que a loja permaneça veloz e no ar durante picos de tráfego de anúncios no Instagram.',
    howItDoes: 'Mede o pulso e a respiração do servidor a cada segundo; se houver qualquer lentidão ou queda, aciona o alarme imediatamente.',
    humanRoi: 'Nenhum sócio precisa aprender comandos complicados de terminal Linux para saber se a loja está operando com segurança.'
  },
  auditor_precos: {
    id: 'auditor_precos',
    name: 'Auditor de Preços Multi-Supplier',
    role: 'Auditor Preventivo de Custos (2 Horas)',
    department: '04 · Produção & Fornecedores (Titular: Armando)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Lê os catálogos públicos e custos de insumos da Dimona Dropsimples e Reserva a cada 2 horas.',
    whyItDoes: 'Se a fábrica reajustar o custo de uma malha, a margem de lucro da AVA é protegida imediatamente sem tomar prejuízo.',
    howItDoes: 'Compara os valores vigentes com o custo base no banco e dispara alerta ou aciona a Chave de 2 Posições homologada pelo Conselho.',
    humanRoi: 'Nenhum sócio precisa entrar todo dia nos sites dos fornecedores para conferir tabelas de preços.'
  },
  gestor_amostras: {
    id: 'gestor_amostras',
    name: 'Gestor de Amostras Físicas PoD',
    role: 'Controle de Lotes & Qualidade Fabril',
    department: '04 · Produção & Fornecedores (Titular: Armando)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Rastreia o pedido de amostras físicas Dimona (#755-460-927) e organiza o checklist de avaliação técnica na entrega.',
    whyItDoes: 'Garante que nenhuma peça vá para a vitrine pública sem que a Mesa Redonda aprove toque, peso e fixação da estampa.',
    howItDoes: 'Registra comprovantes de PIX, códigos de rastreio, notas de malha e laudos de teste de lavagem.',
    humanRoi: 'Evita a perda de informações de pedidos em chats do WhatsApp e organiza o histórico físico da confecção.'
  },
  concierge_virtual: {
    id: 'concierge_virtual',
    name: 'Concierge Virtual 24/7',
    role: 'Assistente de Vendas & Informações da Loja',
    department: '05 · Atendimento & SAC (Titular: Gustavo)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Tira dúvidas dos visitantes em tempo real sobre modelagens (Oversized vs Prime), tecidos, prazos de entrega e cuidados de lavagem.',
    whyItDoes: 'Converte visitantes indecisos em compradores na hora, sem deixar o cliente sem resposta de madrugada ou no fim de semana.',
    howItDoes: 'Atende o cliente educadamente e na hora com conhecimento profundo de tecidos, medidas e conceitos de estilo da AVA.',
    humanRoi: 'Os sócios não precisam ficar de plantão no celular respondendo dezenas de mensagens repetidas com dúvidas sobre tabela de medidas.'
  },
  discriminador_sac: {
    id: 'discriminador_sac',
    name: 'Agente Discriminador SAC',
    role: 'Triagem de Trocas (CDC 49 vs Garantia)',
    department: '05 · Atendimento & SAC (Titular: Gustavo)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Analisa pedidos de troca no portal, separando Desistência Legal em 7 dias (Art. 49 CDC) de Defeitos de Fabricação (90 dias).',
    whyItDoes: 'Garante que os custos de peças com defeito sejam cobrados da fábrica (Dimona) e agiliza a logística reversa do cliente.',
    howItDoes: 'Checa a data de recebimento da encomenda, valida fotos de defeito e monta o dossiê da decisão.',
    humanRoi: 'Economiza horas de discussão por e-mail com clientes; o sócio apenas aperta um botão para emitir a autorização.'
  },
  escalador_omissao: {
    id: 'escalador_omissao',
    name: 'Escalador Anti-Omissão',
    role: 'Transbordo Societário (Zagueiro-Artilheiro)',
    department: '05 · Atendimento & SAC (Titular: Gustavo)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Monitora o tempo de resposta aos chamados de clientes. Se o sócio titular não agir em 2 horas, aciona os outros 3 sócios com link de 1 clique.',
    whyItDoes: 'Garante SLA zero omissão, impedindo que a AVA receba reclamações públicas no Reclame Aqui ou Procon.',
    howItDoes: 'Dispara notificações com links diretos que permitem aprovar ou orientar o chamado de qualquer smartphone.',
    humanRoi: 'Tira das costas de um único sócio o peso do atendimento; qualquer sócio livre pode marcar o gol e resguardar a empresa.'
  },
  analista_trafego: {
    id: 'analista_trafego',
    name: 'Analista de Tráfego & ROAS',
    role: 'Impulsionamento, Conversão & Funil',
    department: '06 · Vendas & Canais (Titular: Gustavo)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Monitora o retorno sobre investimento dos anúncios (ROAS), a taxa de cliques na vitrine 9:16 e o comportamento do cliente até o pagamento.',
    whyItDoes: 'Detecta imediatamente se o preço está travando a conversão (alto demais) ou se o anúncio está trazendo público desqualificado.',
    howItDoes: 'Acompanha quantas pessoas entram na loja, quantas clicam nas peças e quantas finalizam a compra, alertando o sócio de Vendas onde colocar verba.',
    humanRoi: 'Economiza milhares de reais que seriam queimados em impulsionamentos cegos e dispensa agências caras de tráfego pago.'
  },
  gestor_canais: {
    id: 'gestor_canais',
    name: 'Gestor dos 10 Canais',
    role: 'Relacionamento & Performance Multicanal',
    department: '06 · Vendas & Canais (Titular: Gustavo)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Supervisiona a presença comercial e o catálogo da AVA nos 10 canais (Vitrine Oficial, Instagram Shopping, TikTok Shop, Mercado Livre, Shopee, etc.).',
    whyItDoes: 'Multiplica os pontos de venda da marca sem depender de uma única fonte de clientes.',
    howItDoes: 'Sincroniza fotos, títulos e disponibilidade com os canais parceiros e aponta qual vitrine está trazendo mais vendas no mês.',
    humanRoi: 'O sócio comercial não precisa cadastrar produto por produto manualmente em 10 plataformas diferentes.'
  },
  trios_balenciaga: {
    id: 'trios_balenciaga',
    name: 'Trios 3x3 Balenciaga',
    role: 'Estrategista de Branding & Feed Instagram',
    department: '07 · Marketing & Branding (Titular: Tripoint)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Organiza o planejamento de postagens no Instagram em blocos de 3 fotos simultâneas no formato vertical 9:16.',
    whyItDoes: 'Espelha a vitrine do site no Instagram, transmitindo a autoridade estética de marcas de ultra-luxo internacionais.',
    howItDoes: 'Mapeia a sequência visual perfeita: 1. Foto Editorial no Modelo + 2. Close da Estampa Silk HD + 3. Conceito Urbano.',
    humanRoi: 'Elimina a dúvida diária sobre "o que postar hoje" e impede postagens desorganizadas que quebram o layout do perfil.'
  },
  vault_coupon: {
    id: 'vault_coupon',
    name: 'Vault Coupon',
    role: 'Motor de Senhas Virais (10% a 50% OFF)',
    department: '07 · Marketing & Branding (Titular: Tripoint)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Gera senhas únicas de cupom cujo primeiro dígito (1... a 5...) destrava a Vitrine Secreta para escoar o estoque físico remanescente.',
    whyItDoes: 'Permite liquidar as peças antigas com lucro e sem queimar o posicionamento de preço cheio da Nova Coleção PoD.',
    howItDoes: 'Lê as interações de comentários nas redes e calcula na hora descontos exclusivos para queima de estoque físico.',
    humanRoi: 'Os sócios não precisam criar dezenas de cupons avulsos e nem controlar senhas em papéis ou planilhas.'
  },
  lookbook_ia: {
    id: 'lookbook_ia',
    name: 'Lookbook 9:16',
    role: 'Diretor de Fotografia IA & Moda',
    department: '08 · Atelier Criativo & Mídias (Titular: Tripoint)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Define a direção visual, enquadramento vertical de 9:16, iluminação e manequins virtuais para as fotos de produtos.',
    whyItDoes: 'Produz catálogos editoriais de alto padrão sem a necessidade de locar estúdios fotográficos caros para cada drop.',
    howItDoes: 'Conduz a geração de fotografias hiper-realistas de modelos e manequins no padrão de proporção vertical da vitrine.',
    humanRoi: 'Economiza milhares de reais em cachês de modelos, fotógrafos, maquiagem e locação de estúdio físico.'
  },
  curador_matrizes: {
    id: 'curador_matrizes',
    name: 'Curador de Matrizes 300 DPI',
    role: 'Auditor de Gabaritos & Direitos Autorais (MDV 26)',
    department: '08 · Atelier Criativo & Mídias (Titular: Tripoint)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Valida os arquivos mestres nos gabaritos industriais da Dimona (3435×4680) e Reserva (4200×4800) e gera a hash SHA-256 de autoria.',
    whyItDoes: 'Impede que peças saiam com estampas pixeladas ou cortadas na fábrica e protege o direito autoral das ilustrações da AVA.',
    howItDoes: 'Inspeciona a nitidez milimétrica da estampa e confere se as medidas batem exatamente com as máquinas da fábrica.',
    humanRoi: 'Os sócios não precisam ser experts em Photoshop para checar se a resolução do arquivo serve para estamparia profissional.'
  },
  content_creator: {
    id: 'content_creator',
    name: 'Content Creator',
    role: 'Redator & Voz da Marca Streetwear',
    department: '08 · Atelier Criativo & Mídias (Titular: Tripoint)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Escreve os manifestos das coleções, descrições dos produtos, histórias de cada peça e comunicações da marca.',
    whyItDoes: 'Assegura que a AVA fale com o público jovem e exigente com sofisticação, rebeldia elegante e atitude autêntica.',
    howItDoes: 'Calibra o tom de voz com base nos 3 pilares da AVA (Atitude, Valorização, Amizade) e arquétipos de marca.',
    humanRoi: 'Acaba com o bloqueio criativo dos sócios na hora de criar copies impactantes para a vitrine e redes sociais.'
  },
  whimsy_injector: {
    id: 'whimsy_injector',
    name: 'Whimsy Injector',
    role: 'Designer de Interação & UX/UI de Luxo',
    department: '08 · Atelier Criativo & Mídias (Titular: Tripoint)',
    status: 'STANDBY',
    statusLabel: 'Em Prontidão',
    whatItDoes: 'Desenha as micro-interações elegantes da loja: a inspeção ativa no 1º clique, o vidro leitoso cobrindo os 8 vizinhos e o carrossel limpo.',
    whyItDoes: 'Garante que o cliente sinta que está navegando em uma boutique digital internacional do nível Balenciaga.',
    howItDoes: 'Cria efeitos visuais fluidos e transições elegantes que fazem a loja parecer um aplicativo de alta costura.',
    humanRoi: 'Dispensa a contratação de consultorias de design de interface caras para criar uma loja com visual de grife.'
  },
  unit_economics: {
    id: 'unit_economics',
    name: 'Unit Economics & DRE',
    role: 'Simulador de Lucro Líquido & Propostas para Urna',
    department: '02 · Financeiro, Fiscal & ERP (Titular: Flávio)',
    status: 'ACTIVE',
    statusLabel: 'Em Operação Ativa',
    whatItDoes: 'Calcula o lucro líquido real de cada peça deduzindo custo PoD, imposto do Simples Nacional e taxas de cartão, preparando as pautas de precificação para votação dos 4 sócios.',
    whyItDoes: 'Evita o duplo abismo da precificação ("preço baixo morre na praia; preço alto não sai do lugar") munindo os 4 sócios com números reais antes do voto.',
    howItDoes: 'Subtrai na hora o custo da peça, frete, imposto e taxas da maquininha, mostrando na tela quanto dinheiro sobra de verdade no bolso e enviando a proposta para a Urna.',
    humanRoi: 'Os sócios não precisam perder tempo preenchendo planilhas financeiras complexas para saber quanto sobrou de lucro.'
  }
};
