import React, { useState, useEffect, useMemo } from "react";

// =====================================================================
// BASE DE DADOS — extraída automaticamente das suas planilhas
// =====================================================================

// [código, dimensões, sacolas por folha 66x96cm]
const MODELOS_BASE = [
  ["SP 9001", "09x13x04", 9], ["SP 8000", "10x14x05", 8],
  ["SP 7002", "12x12x05", 7], ["SP 5000", "11x19x05", 5],
  ["SP 4003", "13x18x06", 4], ["SP 4004", "18x17x08", 4],
  ["SP 4005", "24x16x6,5", 4], ["SP 3006", "18x25x07", 3],
  ["SP 3007", "22x24x8,5", 3], ["SAT 03", "24,5x22x07", 3],
  ["SP 2000", "18x25x14", 2], ["SM 2009", "33x23x11", 2],
  ["SM 2009 PLUS", "35,5x23x11", 2], ["SAT 01", "20x31x11", 2],
  ["SAT 02", "22x37x12,5", 1], ["SM 1008", "25x32x12", 1],
  ["SM 1008 PLUS", "26x36x14", 1], ["SM 1008 B", "25x32x12", 1],
  ["SM 1008 B PLUS", "27,5x36x13,2", 1], ["SM 1008 B PLUS 2", "27,5x36x13,3", 1],
  ["SAT 04", "30,5x26,5x22", 1], ["SM 1010", "35x30x11", 1],
  ["SG 1011", "29x40x14", 1], ["VINHO 01", "15x40x11", 1],
  ["VINHO 02", "21x40x11", 1], ["SG 15013", "41,5x36x12", 1],
  ["SAT 05", "32x42x17", 0.5], ["SAT 06", "45x40,5x13", 0.5],
];

// Logo da empresa (pétalas brancas extraídas, fundo transparente)
const LOGO_DATA_URL = "data:image/png;base64,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";

// [tipo, nome, preço folha 66x96cm]
const PAPEIS_BASE = [
  ["offset_120", "Offset 120g", 0.96],
  ["offset_150", "Offset 150g", 1.01],
  ["offset_180", "Offset 180g", 1.25],
  ["offset_240", "Offset 240g", 1.65],
  ["kraft_110", "Kraft 110g", 0.49],
  ["kraft_140", "Kraft 140g", 0.62],
  ["kraft_180", "Kraft 180g", 0.80],
  ["kraft_200", "Kraft 200g", 0.89],
  ["eco_120", "Ecomillenium 120g", 0.72],
  ["eco_150", "Ecomillenium 150g", 0.86],
  ["eco_180", "Ecomillenium 180g", 1.03],
  ["eco_240", "Ecomillenium 240g", 1.39],
];

// Alças: cada uma tem `custo` (R$ por sacola, com markup já aplicado se for o caso).
// Opcionalmente, `precoMilheiro` (R$ por mil unidades) — quando preenchido,
// o custo por sacola é derivado automaticamente: (milheiro / 1000) × 2 alças.
const ALCAS_BASE = [
  ["cordao", "Cordão", 0.46, null],
  ["gorgurao", "Gorgurão", 0.72, null],
  ["cetim", "Cetim", 0.88, null],
  ["torcida_parda", "Torcida Parda", 0.23, null],
  ["torcida_branca", "Torcida Branca", 0.30, null],
  ["torcida_preta", "Torcida Preta", 0.34, null],
  ["sem_alca", "Sem alça", 0, null],
];

const ALCAS_POR_SACOLA = 2;

// Custo unitário de laminação (fosca ou brilhosa) — varia por modelo
const LAMINACAO_BASE = {
  "SP 9001": 0.13, "SP 8000": 0.19, "SP 7002": 0.16, "SP 5000": 0.20,
  "SP 4003": 0.24, "SP 4004": 0.33, "SP 4005": 0.39, "SP 3006": 0.45,
  "SP 3007": 0.55, "SAT 03": 0.57, "SP 2000": 0.54, "SM 2009": 0.79,
  "SM 2009 PLUS": 0.84, "SAT 01": 0.71, "SAT 02": 0.87, "SM 1008": 0.85,
  "SM 1008 PLUS": 0.99, "SM 1008 B": 1.49, "SM 1008 B PLUS": 1.49,
  "SM 1008 B PLUS 2": null, "SAT 04": 0.95, "SM 1010": 1.05,
  "SG 1011": 1.34, "VINHO 01": 0.82, "VINHO 02": 1.01, "SG 15013": 1.34,
  "SAT 05": 1.52, "SAT 06": 1.81,
};

// Faixas de quantidade
const FAIXAS = [
  { key: "q300",  label: "300 a 499 un.",     min: 300,  max: 499 },
  { key: "q500",  label: "500 a 999 un.",     min: 500,  max: 999 },
  { key: "q1000", label: "1.000 a 4.999 un.", min: 1000, max: 4999 },
  { key: "q5000", label: "5.000+ un.",        min: 5000, max: 999999 },
];

// Tabela Nova Clicheria — chapa de hot stamping em zinco 3,0mm
// (acrescenta-se 1cm de borda em cada lado para calcular a área)
const HOT_CHAPA_FAIXAS_BASE = [
  { ate: 20,   preco: 90,  porCm2: null },
  { ate: 40,   preco: 105, porCm2: null },
  { ate: 60,   preco: 120, porCm2: null },
  { ate: 80,   preco: 135, porCm2: null },
  { ate: 100,  preco: 150, porCm2: null },
  { ate: null, preco: null, porCm2: 1.50 }, // acima de 100 cm²
];

// =====================================================================
// MODELOS DE PLÁSTICO — extraídos da TABELAS_FLOR__PLASTICO.xlsx
// =====================================================================

const PLASTIC_CATEGORIAS_BASE = [
  {
    id: "camiseta_hd_branca",
    nome: "Camiseta — HD Branca",
    faixas: [
      { min: 1000, max: 1999,   label: "1.000 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Branca"],
    observacoes: [],
    modelos: [
      { code: "PAC 24",   dim: "24X34X0,3 - 2KG",   precos: [0.4575, 0.3192, 0.2829] },
      { code: "PAC 20",   dim: "30X40X0,4 - 3KG",   precos: [0.5375, 0.396, 0.3565] },
      { code: "PAC 16",   dim: "35X45X0,4",         precos: [0.645, 0.4512, 0.4094] },
      { code: "PAC 12",   dim: "40X50X0,4 - 7KG",   precos: [0.8, 0.6, 0.552] },
      { code: "PAC 09",   dim: "45X60X0,4 - 10KG",  precos: [1, 0.792, 0.736] },
      { code: "PAC 04",   dim: "50X60X0,4",         precos: [1.15, 0.936, 0.874] },
      { code: "PAC 03",   dim: "50X70X0,4 - 20KG",  precos: [1.3, 1.08, 1.012] },
      { code: "PAC 01",   dim: "60X80X0,6 - 30KG",  precos: [1.625, 1.392, 1.311] },
      { code: "PAC 07-B", dim: "70X90X0,70",        precos: [2.225, 2.136, 2.047] },
      { code: "PAC 08-B", dim: "90X100X0,70",       precos: [3.05, 2.76, 2.622] },
    ],
  },
  {
    id: "camiseta_hd_colorida",
    nome: "Camiseta — HD Colorida/Transparente",
    faixas: [
      { min: 1000, max: 1999,   label: "1.000 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Prata", "Ouro", "Azul", "Roxo", "Vermelho", "Laranja", "Amarelo", "Verde Água", "Verde Limão", "Marrom", "Verde Bandeira", "Rosa", "Rosa Neon", "Rosa Bebê", "Transparente"],
    observacoes: [
      "Tamanhos 70x90 e 90x100 disponíveis nas cores: Amarelo, Transparente, Rosa, Azul, Vermelho e Prata.",
    ],
    modelos: [
      { code: "PAC 24",   dim: "24X34X0,3 - 2KG (só preto)",       precos: [0.485, 0.3456, 0.3082] },
      { code: "PAC 20",   dim: "30X40X0,4 - 3KG",                  precos: [0.575, 0.432, 0.391] },
      { code: "PAC 16",   dim: "35X45X0,4 (só amarelo)",           precos: [0.6875, 0.492, 0.4485] },
      { code: "PAC 12",   dim: "40X50X0,4 - 7KG",                  precos: [0.875, 0.672, 0.621] },
      { code: "PAC 09",   dim: "45X60X0,4 - 10KG",                 precos: [1.11, 0.8976, 0.8372] },
      { code: "PAC 04",   dim: "50X60X0,4 (só preto)",             precos: [1.275, 1.056, 0.989] },
      { code: "PAC 03",   dim: "50X70X0,4 - 20KG",                 precos: [1.45, 1.224, 1.15] },
      { code: "PAC 01",   dim: "60X80X0,6 - 30KG",                 precos: [1.925, 1.68, 1.587] },
      { code: "PAC 07-B", dim: "70X90X0,70",                       precos: [2.575, 2.304, 2.185] },
      { code: "PAC 08-B", dim: "90X100X0,70",                      precos: [3.75, 3.432, 3.266] },
    ],
  },
  {
    id: "camiseta_bd",
    nome: "Camiseta — BD",
    faixas: [
      { min: 1000, max: 1999,   label: "1.000 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Prata", "Ouro", "Azul", "Roxo", "Vermelho", "Laranja", "Amarelo", "Verde Água", "Verde Limão", "Branco", "Preto", "Rosa", "Cobre", "Salmão", "Transparente", "Creme", "Verde Bandeira"],
    observacoes: [
      "A medida 25x30x0,10 está disponível nas cores: Branca, Prata, Preta, Amarela, Azul, Rosa, Vermelha, Ouro e Transparente.",
      "A medida 60x80x0,14 está disponível nas cores: Branca, Prata, Preta, Cobre, Ouro, Transparente, Rosa.",
    ],
    modelos: [
      { code: "PAC B 01", dim: "25x30x0,10", precos: [0.725, 0.576, 0.529] },
      { code: "PAC B 02", dim: "30x40x0,10", precos: [0.925, 0.768, 0.713] },
      { code: "PAC B 03", dim: "40x50x0,11", precos: [1.525, 1.296, 1.219] },
      { code: "PAC B 04", dim: "45x60x0,12", precos: [2, 1.752, 1.656] },
      { code: "PAC B 05", dim: "50x70x0,13", precos: [2.825, 2.544, 2.415] },
      { code: "PAC B 06", dim: "60x80x0,14", precos: [3.9, 3.576, 3.404] },
    ],
  },
  {
    id: "fita_hd",
    nome: "Alça Fita — HD (Alta Densidade)",
    faixas: [
      { min: 1000, max: 1999,   label: "1.000 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Prata", "Ouro", "Roxo", "Lilás", "Azul", "Vermelho", "Laranja", "Amarelo", "Verde Água", "Verde Limão", "Rosa", "Rosa Neon", "Rosa Bebê", "Transparente", "Marrom", "Branca", "Preta"],
    observacoes: [
      "PFT 07 26x36x0,15 disponível nas cores: Preta, Branca, Transp., Rosa Bebê, Rosa, Vermelho, Azul, Amarelo e Ouro.",
      "Cor Rosa Neon é mais cara — consultar valores.",
    ],
    modelos: [
      { code: "PFT 02", dim: "45X55X0,15", precos: [2.9, 2.616, 2.484] },
      { code: "PFT 04", dim: "40X50X0,15", precos: [2.5, 2.232, 2.116] },
      { code: "PFT 06", dim: "30X45X0,15", precos: [1.875, 1.632, 1.541] },
      { code: "PFT 07", dim: "26X36X0,15", precos: [1.475, 1.248, 1.173] },
    ],
  },
  {
    id: "fita_bd",
    nome: "Alça Fita — BD (Baixa Densidade)",
    faixas: [
      { min: 1000, max: 1999,   label: "1.000 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Prata", "Preta", "Branca", "Amarelo"],
    observacoes: [],
    modelos: [
      { code: "PFT B 01", dim: "30X45X0,15", precos: [2.1, 1.848, 1.748] },
      { code: "PFT B 02", dim: "40x50x0,15", precos: [2.725, 2.448, 2.323] },
      { code: "PFT B 03", dim: "45x55x0,15", precos: [3.125, 2.832, 2.691] },
    ],
  },
  {
    id: "vazada_vegetal",
    nome: "Alça Vazada Vegetal — HD",
    faixas: [
      { min: 1000, max: 1999,   label: "1.000 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: [],
    observacoes: ["Cores disponíveis: cadastrar em Configurações."],
    modelos: [
      { code: "PADV 01", dim: "30x35x13", precos: [1.55, 1.32, 1.242] },
      { code: "PADV 02", dim: "43x48x13", precos: [2.55, 2.28, 2.162] },
      { code: "PADV 03", dim: "50x60x13", precos: [3.675, 3.36, 3.197] },
    ],
  },
  {
    id: "vazada_hd",
    nome: "Alça Vazada — HD (Alta Densidade)",
    faixas: [
      { min: 500,  max: 1999,   label: "500 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Branca", "Preta", "Roxo", "Lilás", "Azul Bebê", "Azul", "Vermelho", "Laranja", "Amarelo", "Verde Água", "Verde Limão", "Verde Bandeira", "Rosa", "Rosa Neon", "Rosa Bebê", "Transparente", "Marrom", "Vinho", "Prata", "Ouro"],
    observacoes: [
      "PAD 06 (16x22) disponível nas cores: Transparente, Rosa, Rosa Bebê, Vermelho, Azul, Marrom.",
      "PAD 08 (45x60x0,12) disponível nas cores: Amarelo e Transparente.",
    ],
    modelos: [
      { code: "PAD 01", dim: "20x30x0,7",   precos: [0.575, 0.432, 0.391] },
      { code: "PAD 02", dim: "25x37x0,7",   precos: [0.75, 0.552, 0.506] },
      { code: "PAD 03", dim: "30x43x0,7",   precos: [0.925, 0.72, 0.667] },
      { code: "PAD 04", dim: "36x48x0,7",   precos: [1.15, 0.936, 0.874] },
      { code: "PAD 05", dim: "37x55x0,7",   precos: [1.6, 1.368, 1.288] },
      { code: "PAD 06", dim: "16x22x0,10",  precos: [0.525, 0.384, 0.345] },
      { code: "PAD 07", dim: "40x50x0,10",  precos: [1.725, 1.488, 1.403] },
      { code: "PAD 08", dim: "45x60x0,12",  precos: [2.2, 1.944, 1.84] },
    ],
  },
  {
    id: "vazada_bd",
    nome: "Alça Vazada — BD (Baixa Densidade)",
    faixas: [
      { min: 500,  max: 1999,   label: "500 a 1.999" },
      { min: 2000, max: 4999,   label: "2.000 a 4.999" },
      { min: 5000, max: 999999, label: "5.000+" },
    ],
    pinturaApenasUmLado: false,
    cores: ["Prata", "Ouro", "Cobre", "Roxo", "Azul Bebê", "Azul", "Vermelho", "Laranja", "Amarelo", "Verde Água", "Verde Limão", "Verde Bandeira", "Rosa", "Rosa Bebê", "Creme", "Transparente", "Vinho", "Preta", "Branca"],
    observacoes: [
      "PBD 07 (16x20) disponível nas cores: Branco, Preto, Amarelo, Azul, Vermelho, Ouro, Prata, Laranja, Rosa, Rosa Bebê, Azul Bebê, Verde Limão, Verde Água, Roxo.",
    ],
    modelos: [
      { code: "PBD 02", dim: "37x52x12 (BRANCA)", precos: [1.8, 1.56, 1.472] },
      { code: "PBD 03", dim: "36x48x0,12",        precos: [1.575, 1.344, 1.265] },
      { code: "PBD 04", dim: "30x40x0,12",        precos: [1.2, 0.984, 0.92] },
      { code: "PBD 05", dim: "25x35x0,11",        precos: [0.925, 0.72, 0.667] },
      { code: "PBD 06", dim: "20x30x0,10",        precos: [0.655, 0.5088, 0.4646] },
      { code: "PBD 07", dim: "16x20x0,10",        precos: [0.525, 0.384, 0.345] },
    ],
  },
];

// Configuração padrão
const CONFIG_PADRAO = {
  modelos: MODELOS_BASE.map(([code, dim, sf]) => ({ code, dim, sacolasPorFolha: sf })),
  papeis: PAPEIS_BASE.map(([id, nome, preco]) => ({ id, nome, preco })),
  alcas: ALCAS_BASE.map(([id, nome, custo, precoMilheiro]) => ({ id, nome, custo, precoMilheiro })),
  laminacao: { ...LAMINACAO_BASE },
  hotChapaFaixas: [...HOT_CHAPA_FAIXAS_BASE],
  hotChapaFrete: 50.00, // frete por chapa (Nova Clicheria é de fora)
  hotFilme: {
    largura_mm: 640,
    comprimento_m: 122,
    preco_total: 179.61,
    margem_sobra: 0.08,
    aproveitamento_sobra: 0, // 0 = pior caso (nada da sobra é reaproveitada)
  },
  impressaoPorFolha: 0.15,
  colaPorSacola: 0.25,
  vernizPorSacola: 0,
  ilhosPorUnidade: 0,
  ilhosPorSacola: 4,
  custoChapaUnitario: 60.00,
  tarifaFrete: 1.40,
  markupPadrao: 3.0,
  // Plástico
  plasticCategorias: PLASTIC_CATEGORIAS_BASE.map(c => ({ ...c })),
  pinturaPorCorPorLado: 0.30,
};

// =====================================================================
// PERSISTÊNCIA
// =====================================================================

const STORAGE_KEY = "calc_sacolas_papel_v9";

async function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...CONFIG_PADRAO, ...JSON.parse(raw) };
    }
  } catch (e) { /* não existe ainda */ }
  return CONFIG_PADRAO;
}

async function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Erro ao salvar config:", e);
    return false;
  }
}

// =====================================================================
// FORMATAÇÃO E CÁLCULOS
// =====================================================================

const fmt = (v) =>
  (v == null || isNaN(v))
    ? "—"
    : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 4 });

const fmtSimple = (v) =>
  (v == null || isNaN(v))
    ? "—"
    : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });

function getFaixaKey(qty) {
  if (qty < 300) return null;
  if (qty < 500) return "q300";
  if (qty < 1000) return "q500";
  if (qty < 5000) return "q1000";
  return "q5000";
}

// Calcula o custo por sacola de uma alça.
// Se houver precoMilheiro cadastrado, deriva: (milheiro/1000) × 2 alças.
// Caso contrário, usa o custo manual.
function custoAlcaPorSacola(alca) {
  if (alca.precoMilheiro != null && alca.precoMilheiro > 0) {
    return (alca.precoMilheiro / 1000) * ALCAS_POR_SACOLA;
  }
  return alca.custo || 0;
}

function calcChapa(largura_cm, altura_cm, config) {
  if (!largura_cm || !altura_cm) return { area: 0, custoBase: 0, frete: 0, custo: 0 };
  const areaChapa = (Number(largura_cm) + 2) * (Number(altura_cm) + 2);
  let custoBase = 0;
  for (const faixa of config.hotChapaFaixas) {
    if (faixa.ate !== null && areaChapa <= faixa.ate) {
      custoBase = faixa.preco;
      break;
    }
    if (faixa.ate === null) {
      custoBase = areaChapa * faixa.porCm2;
      break;
    }
  }
  const frete = Number(config.hotChapaFrete) || 0;
  return { area: areaChapa, custoBase, frete, custo: custoBase + frete };
}

const HOT_LADOS_SACOLA = 2; // impressão nos dois lados da sacola

// Cálculo do filme por sacola.
// Cada batida consome uma FAIXA da bobina: largura_total × altura_da_arte
// (a máquina desperdiça a largura toda da bobina em cada batida).
// O parâmetro `aproveitamento_sobra` (0..1) reduz esse desperdício se a sobra
// da bobina for reaproveitada em outros pedidos.
function calcFilmePorSacola(largura_cm, altura_cm, config, lados = HOT_LADOS_SACOLA) {
  if (!largura_cm || !altura_cm) {
    return { areaArte: 0, areaFilmeBatida: 0, areaEfetivaBatida: 0, batidas: 0, areaFilmeSacola: 0, custo: 0, custoPorCm2: 0 };
  }
  const areaArte = Number(largura_cm) * Number(altura_cm);
  const bobinaLarguraCm = config.hotFilme.largura_mm / 10;
  const areaBobina_cm2 = bobinaLarguraCm * (config.hotFilme.comprimento_m * 100);
  const custoPorCm2 = config.hotFilme.preco_total / areaBobina_cm2;

  // Área desperdiçada por batida: largura da bobina × altura da arte
  const areaFilmeBatida = bobinaLarguraCm * Number(altura_cm);
  const aproveitamento = Math.max(0, Math.min(1, config.hotFilme.aproveitamento_sobra || 0));
  const areaEfetivaBatida = areaFilmeBatida * (1 - aproveitamento);

  const areaFilmeSacola = areaEfetivaBatida * lados;
  const custo = areaFilmeSacola * custoPorCm2 * (1 + config.hotFilme.margem_sobra);

  return {
    areaArte,
    areaFilmeBatida,        // área bruta consumida por batida
    areaEfetivaBatida,      // após aproveitamento
    batidas: lados,
    areaFilmeSacola,        // área efetiva por sacola
    custoPorCm2,
    custo,
  };
}

function calcOrcamento(input, config) {
  const {
    modelCode, paperId, qty, alcaId, coresLogomarca,
    usaLaminacao, usaVerniz, usaIlhos, usaHotStamp,
    hotLarg, hotAlt,
    markup, desconto,
  } = input;

  const modelo = config.modelos.find((m) => m.code === modelCode);
  const papel = config.papeis.find((p) => p.id === paperId);
  const alca = config.alcas.find((a) => a.id === alcaId);
  const faixaKey = getFaixaKey(qty);

  if (!modelo || !papel || !alca || !faixaKey) {
    return { erro: !faixaKey ? "Quantidade mínima é 300 unidades" : "Configuração incompleta" };
  }

  // 1) Papel + impressão (por sacola)
  const custoPapelImpressao =
    (papel.preco + config.impressaoPorFolha) / modelo.sacolasPorFolha;

  // 2) Cola
  const custoCola = config.colaPorSacola;

  // 3) Chapas offset (1 inclusa + extras conforme nº de cores da logomarca)
  const numChapas = Math.max(1, coresLogomarca || 1);
  const chapasExtras = numChapas - 1;
  const custoChapa = (numChapas * config.custoChapaUnitario) / qty;

  // 4) Alça (custo embutindo ilhós no caso padrão)
  const custoAlca = custoAlcaPorSacola(alca);

  // 5) Ilhós opcional separado (para projetos sem ilhós embutido)
  const custoIlhos = usaIlhos ? (config.ilhosPorUnidade * config.ilhosPorSacola) : 0;

  // 6) Laminação
  const lamUnit = config.laminacao[modelCode];
  const custoLaminacao = (usaLaminacao && lamUnit != null) ? lamUnit : 0;
  const laminacaoIndisponivel = usaLaminacao && lamUnit == null;

  // 7) Verniz
  const custoVerniz = usaVerniz ? config.vernizPorSacola : 0;

  // 8) Hot stamping (chapa amortizada pela tiragem + filme por sacola)
  let chapaInfo = { area: 0, custo: 0 };
  let filmeInfo = { areaArte: 0, custo: 0 };
  let hotChapaPorSacola = 0;
  let hotFilmePorSacola = 0;
  if (usaHotStamp) {
    chapaInfo = calcChapa(hotLarg, hotAlt, config);
    filmeInfo = calcFilmePorSacola(hotLarg, hotAlt, config);
    hotChapaPorSacola = chapaInfo.custo / qty;
    hotFilmePorSacola = filmeInfo.custo;
  }

  const custoUnitarioTotal =
    custoPapelImpressao + custoCola + custoChapa +
    custoAlca + custoIlhos + custoLaminacao + custoVerniz +
    hotChapaPorSacola + hotFilmePorSacola;

  const precoVendaUnit = custoUnitarioTotal * markup;
  const precoVendaUnitComDesconto = precoVendaUnit * (1 - desconto);
  const totalCusto = custoUnitarioTotal * qty;
  const totalVenda = precoVendaUnitComDesconto * qty;
  const totalLucro = totalVenda - totalCusto;

  return {
    modelo, papel, alca, faixaKey, qty,
    componentes: {
      papelImpressao: custoPapelImpressao,
      cola: custoCola,
      chapaAmortizada: custoChapa,
      alca: custoAlca,
      ilhos: custoIlhos,
      laminacao: custoLaminacao,
      verniz: custoVerniz,
      hotChapa: hotChapaPorSacola,
      hotFilme: hotFilmePorSacola,
    },
    extras: { chapaInfo, filmeInfo, laminacaoIndisponivel, numChapas, chapasExtras },
    custoUnitarioTotal,
    precoVendaUnit,
    precoVendaUnitComDesconto,
    totalCusto,
    totalVenda,
    totalLucro,
    markup,
    desconto,
  };
}

// =====================================================================
// COMPONENTES UI
// =====================================================================

// Senha simples do modo admin. Para trocar, edite abaixo.
const ADMIN_KEY = "florzinha";

function isAdmin() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("admin") === ADMIN_KEY;
  } catch (e) {
    return false;
  }
}

function App() {
  const [config, setConfig] = useState(CONFIG_PADRAO);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("calc");
  const admin = isAdmin();

  useEffect(() => {
    loadConfig().then((c) => {
      setConfig(c);
      setLoaded(true);
    });
  }, []);

  const updateConfig = async (newConfig) => {
    setConfig(newConfig);
    await saveConfig(newConfig);
  };

  const resetConfig = async () => {
    if (!confirm("Restaurar todas as configurações para os valores padrão?")) return;
    setConfig(CONFIG_PADRAO);
    await saveConfig(CONFIG_PADRAO);
  };

  if (!loaded) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  return (
    <div style={styles.app}>
      <style>{globalCSS}</style>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerBrand}>
            <img src={LOGO_DATA_URL} alt="Flor de Maria" style={styles.logo} />
            <div>
              <h1 style={styles.title}>Calculadora de Sacolas</h1>
              <p style={styles.subtitle}>Papel e plástico · custos, markup e preço final</p>
            </div>
          </div>
          <nav style={styles.nav}>
            <button
              style={{ ...styles.navBtn, ...(tab === "calc" ? styles.navBtnActive : {}) }}
              onClick={() => setTab("calc")}>
              Sacola de papel
            </button>
            <button
              style={{ ...styles.navBtn, ...(tab === "plastic" ? styles.navBtnActive : {}) }}
              onClick={() => setTab("plastic")}>
              Sacola de plástico
            </button>
            <button
              style={{ ...styles.navBtn, ...(tab === "cotacao" ? styles.navBtnActive : {}) }}
              onClick={() => setTab("cotacao")}>
              Cotação
            </button>
            {admin && (
              <button
                style={{ ...styles.navBtn, ...(tab === "config" ? styles.navBtnActive : {}) }}
                onClick={() => setTab("config")}>
                Configurações
              </button>
            )}
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        {tab === "calc" && <Calculator config={config} />}
        {tab === "plastic" && <PlasticCalculator config={config} />}
        {tab === "cotacao" && <QuotationHub config={config} onUpdate={updateConfig} />}
        {admin && tab === "config" && <Settings config={config} onUpdate={updateConfig} onReset={resetConfig} />}
      </main>

      <footer style={styles.footer}>
        {admin
          ? "Modo administrador · As configurações ficam salvas neste navegador."
          : "Para consultar preço, escolha o modelo, quantidade e acabamentos. Descontos podem ser negociados diretamente com o vendedor."
        }
      </footer>
    </div>
  );
}

// ---------- Calculadora principal ----------

function Calculator({ config }) {
  const [modelCode, setModelCode]   = useState(config.modelos[4].code); // SP 4003 default
  const [paperId, setPaperId]       = useState(config.papeis[2].id);    // OFFSET 180 default
  const [qty, setQty]               = useState(1000);
  const [alcaId, setAlcaId]         = useState(config.alcas[0].id);
  const [coresLogomarca, setCoresLogomarca] = useState(1);
  const [usaLaminacao, setUsaLaminacao] = useState(false);
  const [usaVerniz, setUsaVerniz]   = useState(false);
  const [usaIlhos, setUsaIlhos]     = useState(false);
  const [usaHotStamp, setUsaHotStamp] = useState(false);
  const [hotLarg, setHotLarg]       = useState(5);
  const [hotAlt, setHotAlt]         = useState(3);
  const [markup, setMarkup]         = useState(config.markupPadrao);
  const [desconto, setDesconto]     = useState(0);

  const orcamento = useMemo(() => calcOrcamento({
    modelCode, paperId, qty, alcaId, coresLogomarca,
    usaLaminacao, usaVerniz, usaIlhos, usaHotStamp,
    hotLarg, hotAlt, markup, desconto,
  }, config), [modelCode, paperId, qty, alcaId, coresLogomarca, usaLaminacao, usaVerniz,
              usaIlhos, usaHotStamp, hotLarg, hotAlt, markup, desconto, config]);

  return (
    <div style={styles.calcGrid}>
      {/* COLUNA ESQUERDA: FORM */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Pedido</h2>

        <Field label="Modelo da sacola">
          <select style={styles.input} value={modelCode}
                  onChange={(e) => setModelCode(e.target.value)}>
            {config.modelos.map((m) => (
              <option key={m.code} value={m.code}>{m.code} — {m.dim}</option>
            ))}
          </select>
        </Field>

        <Field label="Tipo de papel">
          <select style={styles.input} value={paperId}
                  onChange={(e) => setPaperId(e.target.value)}>
            {config.papeis.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </Field>

        <Field label="Quantidade">
          <input type="number" min="0" step="50" style={styles.input}
                 value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} />
          <small style={styles.hint}>
            Faixa atual: {orcamento.faixaKey ? FAIXAS.find(f => f.key === orcamento.faixaKey)?.label : "abaixo do mínimo"}
          </small>
        </Field>

        <Field label="Alça">
          <select style={styles.input} value={alcaId}
                  onChange={(e) => setAlcaId(e.target.value)}>
            {config.alcas.map((a) => (
              <option key={a.id} value={a.id}>{a.nome} — {fmt(custoAlcaPorSacola(a))}/un.</option>
            ))}
          </select>
          <small style={styles.hint}>Ilhós já embutido (exceto "Sem alça")</small>
        </Field>

        <Field label="Cores da embalagem">
          <input type="number" min="1" max="8" step="1" style={styles.input}
                 value={coresLogomarca}
                 onChange={(e) => setCoresLogomarca(Math.max(1, Number(e.target.value) || 1))} />
          <small style={styles.hint}>Total de cores na arte (logomarca + cores da embalagem)</small>
        </Field>

        <h3 style={styles.sectionTitle}>Acabamentos opcionais</h3>

        <CheckRow checked={usaLaminacao} onChange={setUsaLaminacao}
                  label="Laminação (fosca ou brilhosa)" />
        {usaLaminacao && config.laminacao[modelCode] == null && (
          <p style={styles.warn}>⚠ Laminação não disponível para este modelo</p>
        )}

        <CheckRow checked={usaVerniz} onChange={setUsaVerniz}
                  label="Verniz" hint={config.vernizPorSacola === 0 ? "Sem custo cadastrado — defina em Configurações" : `${fmt(config.vernizPorSacola)}/un.`} />

        <CheckRow checked={usaIlhos} onChange={setUsaIlhos}
                  label="Ilhós separado (projeto sem ilhós embutido)"
                  hint={config.ilhosPorUnidade === 0 ? "Sem custo cadastrado — defina em Configurações" : `${fmt(config.ilhosPorUnidade)} × ${config.ilhosPorSacola} ilhoses/sacola`} />

        <CheckRow checked={usaHotStamp} onChange={setUsaHotStamp}
                  label="Hot stamping" />
        {usaHotStamp && (
          <div style={styles.subBox}>
            <div style={styles.row2}>
              <Field label="Largura da arte (cm)" small>
                <input type="number" min="0" step="0.1" style={styles.input}
                       value={hotLarg} onChange={(e) => setHotLarg(Number(e.target.value) || 0)} />
              </Field>
              <Field label="Altura da arte (cm)" small>
                <input type="number" min="0" step="0.1" style={styles.input}
                       value={hotAlt} onChange={(e) => setHotAlt(Number(e.target.value) || 0)} />
              </Field>
            </div>
          </div>
        )}

        <h3 style={styles.sectionTitle}>Margem e desconto</h3>

        <Field label={`Markup (multiplicador): ${markup.toFixed(2)}×`}>
          <input type="range" min="1" max="5" step="0.1"
                 value={markup} onChange={(e) => setMarkup(Number(e.target.value))}
                 style={styles.slider} />
        </Field>

        <Field label={`Desconto: ${(desconto * 100).toFixed(0)}%`}>
          <input type="range" min="0" max="0.5" step="0.01"
                 value={desconto} onChange={(e) => setDesconto(Number(e.target.value))}
                 style={styles.slider} />
        </Field>
      </section>

      {/* COLUNA DIREITA: RESULTADO */}
      <section style={{ ...styles.card, ...styles.resultCard }}>
        {orcamento.erro
          ? <p style={styles.error}>{orcamento.erro}</p>
          : <Resultado o={orcamento} config={config} />
        }
      </section>
    </div>
  );
}

function Resultado({ o, config }) {
  const c = o.componentes;
  const linhas = [
    ["Papel + impressão (por folha)", c.papelImpressao,
     `(${fmt(o.papel.preco)} folha + ${fmt(config.impressaoPorFolha)}) ÷ ${o.modelo.sacolasPorFolha} sacolas/folha`],
    ["Cola hotmelt", c.cola, "fixo por sacola"],
    ["Chapas offset", c.chapaAmortizada,
     `${o.extras.numChapas} chapa${o.extras.numChapas > 1 ? "s" : ""} (1 inclusa${o.extras.chapasExtras > 0 ? ` + ${o.extras.chapasExtras} extra${o.extras.chapasExtras > 1 ? "s" : ""}` : ""}) × ${fmtSimple(config.custoChapaUnitario)} ÷ ${o.qty} un.`],
    ["Alça (" + o.alca.nome + ")", c.alca,
     o.alca.precoMilheiro != null && o.alca.precoMilheiro > 0
       ? `${ALCAS_POR_SACOLA} × ${fmtSimple(o.alca.precoMilheiro / 1000)} (milheiro a ${fmtSimple(o.alca.precoMilheiro)})`
       : "ilhós embutido"],
  ];
  if (c.ilhos > 0) linhas.push(["Ilhós separado", c.ilhos, `${config.ilhosPorSacola} × ${fmt(config.ilhosPorUnidade)}`]);
  if (c.laminacao > 0) linhas.push(["Laminação", c.laminacao, "fosca/brilhosa"]);
  if (c.verniz > 0) linhas.push(["Verniz", c.verniz, ""]);
  if (c.hotChapa > 0) linhas.push([
    "Hot stamping — chapa", c.hotChapa,
    `chapa ${o.extras.chapaInfo.area.toFixed(1)} cm² (${fmtSimple(o.extras.chapaInfo.custoBase)} + frete ${fmtSimple(o.extras.chapaInfo.frete)}) ÷ ${o.qty} un.`,
  ]);
  if (c.hotFilme > 0) linhas.push([
    "Hot stamping — filme", c.hotFilme,
    `${(o.extras.filmeInfo?.areaFilmeSacola || 0).toFixed(0)} cm² de filme/sacola (bobina ${(config.hotFilme.largura_mm/10).toFixed(0)}cm × 2 batidas) + ${(config.hotFilme.margem_sobra * 100).toFixed(0)}% sobra`,
  ]);

  return (
    <>
      <h2 style={styles.cardTitle}>Resultado</h2>
      <p style={styles.subtle}>
        {o.modelo.code} · {o.modelo.dim} · {o.papel.nome} · {o.qty.toLocaleString("pt-BR")} un.
      </p>

      <h3 style={styles.sectionTitle}>Composição do custo unitário</h3>
      <table style={styles.table}>
        <tbody>
          {linhas.map(([lbl, val, det], i) => (
            <tr key={i}>
              <td style={styles.tdLabel}>
                {lbl}
                {det && <div style={styles.tdHint}>{det}</div>}
              </td>
              <td style={styles.tdVal}>{fmt(val)}</td>
            </tr>
          ))}
          <tr style={styles.trTotal}>
            <td style={styles.tdLabel}><strong>Custo unitário total</strong></td>
            <td style={styles.tdVal}><strong>{fmt(o.custoUnitarioTotal)}</strong></td>
          </tr>
        </tbody>
      </table>

      <h3 style={styles.sectionTitle}>Preço de venda</h3>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.tdLabel}>Custo × markup ({o.markup.toFixed(2)}×)</td>
            <td style={styles.tdVal}>{fmt(o.precoVendaUnit)}</td>
          </tr>
          {o.desconto > 0 && (
            <tr>
              <td style={styles.tdLabel}>Após desconto de {(o.desconto * 100).toFixed(0)}%</td>
              <td style={styles.tdVal}>{fmt(o.precoVendaUnitComDesconto)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={styles.priceBox}>
        <div style={styles.priceLabel}>Preço final por sacola</div>
        <div style={styles.priceValue}>{fmtSimple(o.precoVendaUnitComDesconto)}</div>
        <div style={styles.priceTotal}>
          Total do pedido: <strong>{fmtSimple(o.totalVenda)}</strong>
        </div>
        <div style={styles.priceProfit}>
          Lucro estimado: {fmtSimple(o.totalLucro)} ({((o.totalLucro / o.totalVenda) * 100).toFixed(1)}% do faturamento)
        </div>
      </div>

      <p style={styles.disclaimer}>
        ⓘ O markup atual de {o.markup.toFixed(2)}× cobre custo dos insumos + despesas operacionais + lucro + impostos do Simples Nacional. Ajuste com cuidado em pedidos grandes.
      </p>
    </>
  );
}

// =====================================================================
// CALCULADORA DE PLÁSTICO
// =====================================================================

function getFaixaPlasticoIdx(qty, faixas) {
  for (let i = 0; i < faixas.length; i++) {
    if (qty >= faixas[i].min && qty <= faixas[i].max) return i;
  }
  return -1;
}

function calcOrcamentoPlastico(input, config) {
  const { categoriaId, modelCode, qty, cores, lados, desconto } = input;
  const cat = config.plasticCategorias.find((c) => c.id === categoriaId);
  if (!cat) return { erro: "Categoria não encontrada" };

  const modelo = cat.modelos.find((m) => m.code === modelCode);
  if (!modelo) return { erro: "Modelo não encontrado" };

  const faixaMin = cat.faixas[0].min;
  if (qty < faixaMin) {
    return { erro: `Quantidade mínima desta categoria: ${faixaMin.toLocaleString("pt-BR")} unidades` };
  }

  const faixaIdx = getFaixaPlasticoIdx(qty, cat.faixas);
  if (faixaIdx === -1) return { erro: "Quantidade fora das faixas cadastradas" };

  const precoBase = modelo.precos[faixaIdx];
  if (precoBase == null || precoBase === 0) {
    return {
      erro: `Sem preço cadastrado para "${cat.nome} → ${modelo.code}". Vá em Configurações para preencher.`,
    };
  }

  const ladosEfetivos = cat.pinturaApenasUmLado ? 1 : Math.max(1, lados);
  const custoPintura = (cores || 0) * ladosEfetivos * config.pinturaPorCorPorLado;

  const precoUnitarioBruto = precoBase + custoPintura;
  const precoUnitarioFinal = precoUnitarioBruto * (1 - desconto);
  const totalPedido = precoUnitarioFinal * qty;

  return {
    cat, modelo, qty, faixaIdx, faixa: cat.faixas[faixaIdx],
    cores, lados: ladosEfetivos,
    componentes: { base: precoBase, pintura: custoPintura },
    precoUnitarioBruto,
    precoUnitarioFinal,
    totalPedido,
    desconto,
  };
}

function PlasticCalculator({ config }) {
  const [categoriaId, setCategoriaId] = useState(config.plasticCategorias[0].id);
  const cat = config.plasticCategorias.find((c) => c.id === categoriaId);
  const [modelCode, setModelCode] = useState(cat.modelos[0]?.code || "");
  const [qty, setQty]         = useState(cat.faixas[0].min);
  const [cores, setCores]     = useState(1);
  const [lados, setLados]     = useState(1);
  const [desconto, setDesconto] = useState(0);
  const [verCores, setVerCores] = useState(false);

  // Reset model and qty when category changes
  const onCategoriaChange = (id) => {
    setCategoriaId(id);
    const novaCat = config.plasticCategorias.find((c) => c.id === id);
    setModelCode(novaCat.modelos[0]?.code || "");
    setQty(novaCat.faixas[0].min);
    setVerCores(false);
  };

  const orcamento = useMemo(() =>
    calcOrcamentoPlastico({
      categoriaId, modelCode, qty, cores, lados, desconto,
    }, config),
  [categoriaId, modelCode, qty, cores, lados, desconto, config]);

  return (
    <div style={styles.calcGrid}>
      {/* COLUNA ESQUERDA: FORM */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Pedido — sacola de plástico</h2>

        <Field label="Categoria">
          <select style={styles.input} value={categoriaId}
                  onChange={(e) => onCategoriaChange(e.target.value)}>
            {config.plasticCategorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </Field>

        <Field label="Modelo">
          <select style={styles.input} value={modelCode}
                  onChange={(e) => setModelCode(e.target.value)}>
            {cat.modelos.map((m) => (
              <option key={m.code} value={m.code}>{m.code} — {m.dim}</option>
            ))}
          </select>
        </Field>

        <Field label="Quantidade">
          <input type="number" min="0" step="100" style={styles.input}
                 value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} />
          <small style={styles.hint}>
            Faixas: {cat.faixas.map((f) => f.label).join(" · ")}
          </small>
        </Field>

        <h3 style={styles.sectionTitle}>Pintura</h3>

        <div style={styles.row2}>
          <Field label="Número de cores" small>
            <input type="number" min="0" max="8" step="1" style={styles.input}
                   value={cores} onChange={(e) => setCores(Math.max(0, Number(e.target.value) || 0))} />
          </Field>
          <Field label={cat.pinturaApenasUmLado ? "Lados (somente 1)" : "Lados"} small>
            <select style={styles.input}
                    value={cat.pinturaApenasUmLado ? 1 : lados}
                    disabled={cat.pinturaApenasUmLado}
                    onChange={(e) => setLados(Number(e.target.value))}>
              <option value={1}>1 lado</option>
              <option value={2}>2 lados</option>
            </select>
          </Field>
        </div>
        <small style={styles.hint}>
          Acréscimo de {fmt(config.pinturaPorCorPorLado)} por cor por lado
        </small>

        {/* Cores disponíveis — expansível, só mostra ao clicar */}
        {(cat.cores?.length > 0 || cat.observacoes?.length > 0) && (
          <div style={styles.coresWrap}>
            <button style={styles.coresToggle}
                    onClick={() => setVerCores(!verCores)}>
              {verCores ? "▾" : "▸"} Ver cores disponíveis e observações
            </button>
            {verCores && (
              <div style={styles.coresBox}>
                {cat.cores?.length > 0 && (
                  <>
                    <div style={styles.coresLabel}>Cores disponíveis ({cat.cores.length})</div>
                    <div style={styles.coresList}>
                      {cat.cores.map((c) => (
                        <span key={c} style={styles.corChip}>{c}</span>
                      ))}
                    </div>
                  </>
                )}
                {cat.observacoes?.length > 0 && (
                  <>
                    <div style={{ ...styles.coresLabel, marginTop: 12 }}>Observações</div>
                    <ul style={styles.obsList}>
                      {cat.observacoes.map((o, i) => (
                        <li key={i} style={styles.obsItem}>{o}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <h3 style={styles.sectionTitle}>Desconto</h3>
        <Field label={`Desconto: ${(desconto * 100).toFixed(0)}%`}>
          <input type="range" min="0" max="0.5" step="0.01"
                 value={desconto} onChange={(e) => setDesconto(Number(e.target.value))}
                 style={styles.slider} />
          <small style={styles.hint}>
            Os preços de tabela já são preço de venda final. Use o desconto para negociações pontuais.
          </small>
        </Field>
      </section>

      {/* COLUNA DIREITA: RESULTADO */}
      <section style={{ ...styles.card, ...styles.resultCard }}>
        {orcamento.erro
          ? <p style={styles.error}>{orcamento.erro}</p>
          : <ResultadoPlastico o={orcamento} config={config} />
        }
      </section>
    </div>
  );
}

function ResultadoPlastico({ o, config }) {
  const totalPintura = o.cores * o.lados;
  return (
    <>
      <h2 style={styles.cardTitle}>Resultado</h2>
      <p style={styles.subtle}>
        {o.cat.nome} · {o.modelo.code} ({o.modelo.dim}) · {o.qty.toLocaleString("pt-BR")} un.
      </p>

      <h3 style={styles.sectionTitle}>Composição do preço por sacola</h3>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.tdLabel}>
              Sacola pronta
              <div style={styles.tdHint}>preço de tabela · faixa {o.faixa.label}</div>
            </td>
            <td style={styles.tdVal}>{fmt(o.componentes.base)}</td>
          </tr>
          <tr>
            <td style={styles.tdLabel}>
              Pintura
              <div style={styles.tdHint}>
                {o.cores} cor{o.cores !== 1 ? "es" : ""} × {o.lados} lado{o.lados > 1 ? "s" : ""} = {totalPintura} × {fmt(config.pinturaPorCorPorLado)}
              </div>
            </td>
            <td style={styles.tdVal}>{fmt(o.componentes.pintura)}</td>
          </tr>
          <tr style={styles.trTotal}>
            <td style={styles.tdLabel}><strong>Subtotal por sacola</strong></td>
            <td style={styles.tdVal}><strong>{fmt(o.precoUnitarioBruto)}</strong></td>
          </tr>
          {o.desconto > 0 && (
            <tr>
              <td style={styles.tdLabel}>Desconto de {(o.desconto * 100).toFixed(0)}%</td>
              <td style={styles.tdVal}>-{fmt(o.precoUnitarioBruto * o.desconto)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={styles.priceBox}>
        <div style={styles.priceLabel}>Preço final por sacola</div>
        <div style={styles.priceValue}>{fmtSimple(o.precoUnitarioFinal)}</div>
        <div style={styles.priceTotal}>
          Total do pedido: <strong>{fmtSimple(o.totalPedido)}</strong>
        </div>
      </div>
    </>
  );
}

// ---------- Hub de Cotação (com sub-abas) ----------

function QuotationHub({ config, onUpdate }) {
  const [subTab, setSubTab] = useState("papel");

  return (
    <div style={styles.quotWrap}>
      <div style={styles.subTabs}>
        <button
          style={{ ...styles.subTabBtn, ...(subTab === "papel" ? styles.subTabBtnActive : {}) }}
          onClick={() => setSubTab("papel")}>
          Cotação de papel
        </button>
        <button
          style={{ ...styles.subTabBtn, ...(subTab === "alca" ? styles.subTabBtnActive : {}) }}
          onClick={() => setSubTab("alca")}>
          Cotação de alça
        </button>
        <button
          style={{ ...styles.subTabBtn, ...(subTab === "hot" ? styles.subTabBtnActive : {}) }}
          onClick={() => setSubTab("hot")}>
          Hot stamping
        </button>
      </div>

      {subTab === "papel" && <PaperQuotation config={config} onUpdate={onUpdate} />}
      {subTab === "alca"  && <AlcaQuotation  config={config} onUpdate={onUpdate} />}
      {subTab === "hot"   && <HotStampingQuotation config={config} />}
    </div>
  );
}

// ---------- Cotação de alça ----------

function AlcaQuotation({ config, onUpdate }) {
  const [alcaName, setAlcaName]         = useState("");
  const [pesoTotal, setPesoTotal]       = useState(0);
  const [qtdMilheiros, setQtdMilheiros] = useState(1);
  const [precoMilheiro, setPrecoMilheiro] = useState(0);
  const [tarifaFrete, setTarifaFrete]   = useState(config.tarifaFrete);
  const [showSaved, setShowSaved]       = useState(false);

  // Cálculos
  const freteTotal       = (Number(pesoTotal) || 0) * (Number(tarifaFrete) || 0);
  const milheiros        = Math.max(1, Number(qtdMilheiros) || 1);
  const fretePorMilheiro = freteTotal / milheiros;
  const milheiroComFrete = (Number(precoMilheiro) || 0) + fretePorMilheiro;
  const custoPorAlca     = milheiroComFrete / 1000;
  const custoPorSacola   = custoPorAlca * ALCAS_POR_SACOLA;
  const valido           = milheiroComFrete > 0;

  const salvarComoAlca = () => {
    if (!alcaName.trim()) {
      alert("Dê um nome para a alça antes de cadastrar");
      return;
    }
    if (!valido) {
      alert("Preencha os campos da cotação corretamente");
      return;
    }
    const nova = {
      id: `alca_${Date.now()}`,
      nome: alcaName.trim(),
      custo: Number(custoPorSacola.toFixed(4)),
      precoMilheiro: Number(milheiroComFrete.toFixed(2)),
    };
    const novaConfig = { ...config, alcas: [...config.alcas, nova] };
    onUpdate(novaConfig);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <>
      <div style={styles.quotIntro}>
        <h2 style={styles.cardTitle}>Cotação de alça</h2>
        <p style={styles.subtle}>
          Calcule o preço do milheiro com frete incluso e o custo por sacola (cada sacola usa {ALCAS_POR_SACOLA} alças).
        </p>
      </div>

      <div style={styles.quotGrid}>
        {/* FORM */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Dados da proposta</h3>

          <Field label="Nome da alça (descrição)">
            <input type="text" style={styles.input}
                   placeholder="Ex: Cordão Encerado 4mm Vermelho"
                   value={alcaName} onChange={(e) => setAlcaName(e.target.value)} />
          </Field>

          <div style={styles.row2}>
            <Field label="Peso total (kg)" small>
              <input type="number" min="0" step="0.01" style={styles.input}
                     value={pesoTotal}
                     onChange={(e) => setPesoTotal(Number(e.target.value) || 0)} />
            </Field>
            <Field label="Quantidade de milheiros" small>
              <input type="number" min="1" step="1" style={styles.input}
                     value={qtdMilheiros}
                     onChange={(e) => setQtdMilheiros(Number(e.target.value) || 1)} />
            </Field>
          </div>

          <Field label="Preço por milheiro (R$)">
            <input type="number" min="0" step="0.01" style={styles.input}
                   value={precoMilheiro}
                   onChange={(e) => setPrecoMilheiro(Number(e.target.value) || 0)} />
            <small style={styles.hint}>Valor cobrado pelo fornecedor por mil unidades de alça</small>
          </Field>

          <Field label="Tarifa do frete (R$/kg)">
            <input type="number" min="0" step="0.01" style={styles.input}
                   value={tarifaFrete}
                   onChange={(e) => setTarifaFrete(Number(e.target.value) || 0)} />
            <small style={styles.hint}>Padrão: R$ 1,40/kg (configurável)</small>
          </Field>

          <p style={styles.helpText}>
            ⓘ Se a alça vier sem frete (retirada na fábrica ou frete grátis), basta deixar peso total ou tarifa em zero.
          </p>
        </section>

        {/* RESULT */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Cálculo passo a passo</h3>

          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tdLabel}>
                  Frete total
                  <div style={styles.tdHint}>{(Number(pesoTotal) || 0).toLocaleString("pt-BR")} kg × {fmtSimple(tarifaFrete)}</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(freteTotal)}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>
                  Frete por milheiro
                  <div style={styles.tdHint}>{fmtSimple(freteTotal)} ÷ {milheiros} milheiro{milheiros > 1 ? "s" : ""}</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(fretePorMilheiro)}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>
                  Milheiro com frete
                  <div style={styles.tdHint}>{fmtSimple(precoMilheiro)} + {fmtSimple(fretePorMilheiro)}</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(milheiroComFrete)}</td>
              </tr>
              <tr style={styles.trTotal}>
                <td style={styles.tdLabel}>
                  <strong>Custo por alça</strong>
                  <div style={styles.tdHint}>{fmtSimple(milheiroComFrete)} ÷ 1.000</div>
                </td>
                <td style={styles.tdVal}><strong>{fmt(custoPorAlca)}</strong></td>
              </tr>
              <tr style={styles.trTotal}>
                <td style={styles.tdLabel}>
                  <strong>Custo por sacola</strong>
                  <div style={styles.tdHint}>{ALCAS_POR_SACOLA} alças × {fmt(custoPorAlca)}</div>
                </td>
                <td style={styles.tdVal}><strong>{fmt(custoPorSacola)}</strong></td>
              </tr>
            </tbody>
          </table>

          {valido && (
            <>
              <div style={styles.btnRow}>
                <button style={styles.btnPrimary}
                        onClick={salvarComoAlca}>
                  + Cadastrar como alça nova
                </button>
                {showSaved && <span style={styles.savedHint}>✓ Cadastrada em "Configurações &gt; Alças"</span>}
              </div>
              <p style={styles.helpText}>
                ⓘ A alça será cadastrada com o custo por sacola já incluindo as 2 alças e o frete diluído.
              </p>
            </>
          )}
        </section>
      </div>
    </>
  );
}

// ---------- Cotação avulsa de hot stamping ----------

function HotStampingQuotation({ config }) {
  const [larg, setLarg] = useState(5);
  const [alt, setAlt]   = useState(3);
  const [qty, setQty]   = useState(1000);
  const [ladosFilme, setLadosFilme] = useState(2);

  const chapaInfo = useMemo(() => calcChapa(larg, alt, config), [larg, alt, config]);
  const filmeInfo = useMemo(() =>
    calcFilmePorSacola(larg, alt, config, ladosFilme),
  [larg, alt, ladosFilme, config]);

  const qtyValido = qty > 0;
  const chapaPorSacola = qtyValido ? chapaInfo.custo / qty : 0;
  const filmePorSacola = filmeInfo.custo;
  const totalPorSacola = chapaPorSacola + filmePorSacola;
  const totalPedido = totalPorSacola * qty;

  return (
    <>
      <div style={styles.quotIntro}>
        <h2 style={styles.cardTitle}>Cotação avulsa de hot stamping</h2>
        <p style={styles.subtle}>
          Calcule o custo do hot stamping isoladamente, sem embutir em um pedido de sacola. Útil para orçamento avulso ou para conferência.
        </p>
      </div>

      <div style={styles.quotGrid}>
        {/* FORM */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Arte e tiragem</h3>

          <div style={styles.row2}>
            <Field label="Largura da arte (cm)" small>
              <input type="number" min="0" step="0.1" style={styles.input}
                     value={larg}
                     onChange={(e) => setLarg(Number(e.target.value) || 0)} />
            </Field>
            <Field label="Altura da arte (cm)" small>
              <input type="number" min="0" step="0.1" style={styles.input}
                     value={alt}
                     onChange={(e) => setAlt(Number(e.target.value) || 0)} />
            </Field>
          </div>

          <Field label="Tiragem (quantidade de sacolas)">
            <input type="number" min="1" step="100" style={styles.input}
                   value={qty}
                   onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
            <small style={styles.hint}>Usada apenas para diluir o custo da chapa por sacola</small>
          </Field>

          <Field label="Lados da sacola com impressão">
            <select style={styles.input}
                    value={ladosFilme}
                    onChange={(e) => setLadosFilme(Number(e.target.value))}>
              <option value={1}>1 lado</option>
              <option value={2}>2 lados (padrão)</option>
            </select>
            <small style={styles.hint}>
              A chapa é a mesma nos dois casos — só o consumo de filme muda
            </small>
          </Field>

          <p style={styles.helpText}>
            ⓘ Os parâmetros da chapa (Nova Clicheria) e da bobina de filme vêm de <strong>Configurações → Hot stamping</strong>.
          </p>
        </section>

        {/* RESULT */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Chapa (custo total do pedido)</h3>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tdLabel}>
                  Área da chapa
                  <div style={styles.tdHint}>
                    ({larg} + 2) × ({alt} + 2) — 1 cm de borda em cada lado
                  </div>
                </td>
                <td style={styles.tdVal}>{chapaInfo.area.toFixed(1)} cm²</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>
                  Preço da chapa
                  <div style={styles.tdHint}>Nova Clicheria — zinco 3,0mm</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(chapaInfo.custoBase || 0)}</td>
              </tr>
              {(chapaInfo.frete || 0) > 0 && (
                <tr>
                  <td style={styles.tdLabel}>
                    Frete da chapa
                    <div style={styles.tdHint}>envio da clicheria</div>
                  </td>
                  <td style={styles.tdVal}>{fmtSimple(chapaInfo.frete)}</td>
                </tr>
              )}
              <tr style={styles.trTotal}>
                <td style={styles.tdLabel}>
                  <strong>Custo total da chapa</strong>
                  <div style={styles.tdHint}>preço + frete</div>
                </td>
                <td style={styles.tdVal}><strong>{fmtSimple(chapaInfo.custo)}</strong></td>
              </tr>
              {qtyValido && (
                <tr>
                  <td style={styles.tdLabel}>
                    Diluída pela tiragem
                    <div style={styles.tdHint}>{fmtSimple(chapaInfo.custo)} ÷ {qty.toLocaleString("pt-BR")} un.</div>
                  </td>
                  <td style={styles.tdVal}>{fmt(chapaPorSacola)} <span style={styles.tdHint}>/ sacola</span></td>
                </tr>
              )}
            </tbody>
          </table>

          <h3 style={styles.sectionTitle}>Filme (custo por sacola)</h3>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tdLabel}>
                  Filme por batida
                  <div style={styles.tdHint}>
                    largura bobina ({(config.hotFilme.largura_mm/10).toFixed(0)}cm) × altura arte ({alt}cm)
                  </div>
                </td>
                <td style={styles.tdVal}>{(filmeInfo.areaFilmeBatida || 0).toFixed(0)} cm²</td>
              </tr>
              {(config.hotFilme.aproveitamento_sobra || 0) > 0 && (
                <tr>
                  <td style={styles.tdLabel}>
                    Após {((config.hotFilme.aproveitamento_sobra || 0) * 100).toFixed(0)}% de aproveitamento da sobra
                    <div style={styles.tdHint}>reutilizada em outros pedidos</div>
                  </td>
                  <td style={styles.tdVal}>{(filmeInfo.areaEfetivaBatida || 0).toFixed(0)} cm²</td>
                </tr>
              )}
              <tr>
                <td style={styles.tdLabel}>
                  Filme por sacola
                  <div style={styles.tdHint}>{(filmeInfo.areaEfetivaBatida || 0).toFixed(0)} cm² × {ladosFilme} batida{ladosFilme > 1 ? "s" : ""}</div>
                </td>
                <td style={styles.tdVal}>{(filmeInfo.areaFilmeSacola || 0).toFixed(0)} cm²</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>
                  Custo do filme por cm²
                  <div style={styles.tdHint}>
                    {fmtSimple(config.hotFilme.preco_total)} ÷ {((config.hotFilme.largura_mm/10)*(config.hotFilme.comprimento_m*100)).toLocaleString("pt-BR")} cm²
                  </div>
                </td>
                <td style={styles.tdVal}>{fmt(filmeInfo.custoPorCm2 || 0)}</td>
              </tr>
              <tr style={styles.trTotal}>
                <td style={styles.tdLabel}>
                  <strong>Filme por sacola</strong>
                  <div style={styles.tdHint}>com {(config.hotFilme.margem_sobra * 100).toFixed(0)}% de sobra</div>
                </td>
                <td style={styles.tdVal}><strong>{fmt(filmePorSacola)}</strong></td>
              </tr>
            </tbody>
          </table>

          {qtyValido && (
            <div style={styles.priceBox}>
              <div style={styles.priceLabel}>Custo total do hot stamping</div>
              <div style={styles.priceValue}>{fmtSimple(totalPorSacola)}<span style={{ fontSize: 16, opacity: 0.7 }}> / sacola</span></div>
              <div style={styles.priceTotal}>
                No pedido de {qty.toLocaleString("pt-BR")} un.: <strong>{fmtSimple(totalPedido)}</strong>
              </div>
              <div style={styles.priceProfit}>
                Chapa {fmtSimple(chapaInfo.custo)} + Filme {fmtSimple(filmePorSacola * qty)}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

// ---------- Cotação de papel ----------

function PaperQuotation({ config, onUpdate }) {
  const [paperName, setPaperName]       = useState("");
  const [pesoTotal, setPesoTotal]       = useState(0);
  const [qtdPacotes, setQtdPacotes]     = useState(1);
  const [precoPacote, setPrecoPacote]   = useState(0);
  const [folhasPacote, setFolhasPacote] = useState(125);
  const [tarifaFrete, setTarifaFrete]   = useState(config.tarifaFrete);
  const [showSaved, setShowSaved]       = useState(false);

  // Cálculos
  const freteTotal       = (Number(pesoTotal) || 0) * (Number(tarifaFrete) || 0);
  const pacotes          = Math.max(1, Number(qtdPacotes) || 1);
  const fretePorPacote   = freteTotal / pacotes;
  const pacoteComFrete   = (Number(precoPacote) || 0) + fretePorPacote;
  const folhasUnit       = Math.max(1, Number(folhasPacote) || 1);
  const custoPorFolha    = pacoteComFrete / folhasUnit;
  const valido           = custoPorFolha > 0;

  // Custo por sacola para cada modelo (para vendedor visualizar)
  const custosPorModelo = config.modelos.map((m) => {
    const custoPapelImp = (custoPorFolha + config.impressaoPorFolha) / m.sacolasPorFolha;
    return { ...m, custoPapelImp };
  }).sort((a, b) => a.custoPapelImp - b.custoPapelImp);

  const salvarComoPapel = () => {
    if (!paperName.trim()) {
      alert("Dê um nome para o papel antes de cadastrar");
      return;
    }
    if (!valido) {
      alert("Preencha os campos da cotação corretamente");
      return;
    }
    const novo = {
      id: `papel_${Date.now()}`,
      nome: paperName.trim(),
      preco: Number(custoPorFolha.toFixed(4)),
    };
    const novaConfig = { ...config, papeis: [...config.papeis, novo] };
    onUpdate(novaConfig);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <>
      <div style={styles.quotIntro}>
        <h2 style={styles.cardTitle}>Cotação de papel</h2>
        <p style={styles.subtle}>
          Calcule o custo final por folha (com frete incluso) a partir dos dados da proposta comercial do fornecedor.
        </p>
      </div>

      <div style={styles.quotGrid}>
        {/* FORM */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Dados da proposta</h3>

          <Field label="Nome do papel (descrição)">
            <input type="text" style={styles.input}
                   placeholder="Ex: Burano Black Nero 180g 70x100"
                   value={paperName} onChange={(e) => setPaperName(e.target.value)} />
          </Field>

          <div style={styles.row2}>
            <Field label="Peso total (kg)" small>
              <input type="number" min="0" step="0.01" style={styles.input}
                     value={pesoTotal}
                     onChange={(e) => setPesoTotal(Number(e.target.value) || 0)} />
            </Field>
            <Field label="Quantidade de pacotes" small>
              <input type="number" min="1" step="1" style={styles.input}
                     value={qtdPacotes}
                     onChange={(e) => setQtdPacotes(Number(e.target.value) || 1)} />
            </Field>
          </div>

          <div style={styles.row2}>
            <Field label="Preço por pacote (R$)" small>
              <input type="number" min="0" step="0.01" style={styles.input}
                     value={precoPacote}
                     onChange={(e) => setPrecoPacote(Number(e.target.value) || 0)} />
            </Field>
            <Field label="Folhas por pacote" small>
              <input type="number" min="1" step="1" style={styles.input}
                     value={folhasPacote}
                     onChange={(e) => setFolhasPacote(Number(e.target.value) || 1)} />
            </Field>
          </div>

          <Field label="Tarifa do frete (R$/kg)">
            <input type="number" min="0" step="0.01" style={styles.input}
                   value={tarifaFrete}
                   onChange={(e) => setTarifaFrete(Number(e.target.value) || 0)} />
            <small style={styles.hint}>Padrão: R$ 1,40/kg (configurável)</small>
          </Field>

          <p style={styles.helpText}>
            ⓘ Os campos seguem o padrão da proposta comercial. Se a proposta tem mais de um item de papel, faça uma cotação por vez.
          </p>
        </section>

        {/* RESULT */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Cálculo passo a passo</h3>

          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tdLabel}>
                  Frete total
                  <div style={styles.tdHint}>{(Number(pesoTotal) || 0).toLocaleString("pt-BR")} kg × {fmtSimple(tarifaFrete)}</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(freteTotal)}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>
                  Frete por pacote
                  <div style={styles.tdHint}>{fmtSimple(freteTotal)} ÷ {pacotes} pacotes</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(fretePorPacote)}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>
                  Pacote com frete
                  <div style={styles.tdHint}>{fmtSimple(precoPacote)} + {fmtSimple(fretePorPacote)}</div>
                </td>
                <td style={styles.tdVal}>{fmtSimple(pacoteComFrete)}</td>
              </tr>
              <tr style={styles.trTotal}>
                <td style={styles.tdLabel}>
                  <strong>Custo por folha</strong>
                  <div style={styles.tdHint}>{fmtSimple(pacoteComFrete)} ÷ {folhasUnit} folhas</div>
                </td>
                <td style={styles.tdVal}><strong>{fmt(custoPorFolha)}</strong></td>
              </tr>
            </tbody>
          </table>

          {valido && (
            <>
              <div style={styles.btnRow}>
                <button style={styles.btnPrimary}
                        onClick={salvarComoPapel}>
                  + Cadastrar como papel novo
                </button>
                {showSaved && <span style={styles.savedHint}>✓ Cadastrado em "Configurações &gt; Papéis"</span>}
              </div>

              <h3 style={{ ...styles.sectionTitle, marginTop: 24 }}>Custo do papel por sacola</h3>
              <p style={styles.helpText}>
                Custo de papel + impressão por sacola para cada modelo da sua linha (sem cola, alça, etc.).
              </p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.thLeft}>Modelo</th>
                    <th style={styles.thLeft}>Dimensões</th>
                    <th style={styles.thRight}>Custo/sacola</th>
                  </tr>
                </thead>
                <tbody>
                  {custosPorModelo.map((m) => (
                    <tr key={m.code}>
                      <td style={styles.tdLabel}>{m.code}</td>
                      <td style={styles.tdLabel}><span style={{ color: palette.inkSoft, fontSize: 12 }}>{m.dim}</span></td>
                      <td style={styles.tdVal}>{fmt(m.custoPapelImp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
      </div>
    </>
  );
}

// ---------- Configurações ----------

function Settings({ config, onUpdate, onReset }) {
  const [draft, setDraft] = useState(config);
  const dirty = JSON.stringify(draft) !== JSON.stringify(config);

  const save = () => onUpdate(draft);

  const updatePapel = (idx, field, value) => {
    const novosPapeis = [...draft.papeis];
    novosPapeis[idx] = { ...novosPapeis[idx], [field]: value };
    setDraft({ ...draft, papeis: novosPapeis });
  };
  const addPapel = () => {
    const novo = { id: `papel_${Date.now()}`, nome: "Novo papel", preco: 0 };
    setDraft({ ...draft, papeis: [...draft.papeis, novo] });
  };
  const removePapel = (idx) => {
    setDraft({ ...draft, papeis: draft.papeis.filter((_, i) => i !== idx) });
  };

  const updateAlca = (idx, field, value) => {
    const novas = [...draft.alcas];
    novas[idx] = { ...novas[idx], [field]: value };
    setDraft({ ...draft, alcas: novas });
  };
  const addAlca = () => {
    setDraft({ ...draft, alcas: [...draft.alcas, { id: `alca_${Date.now()}`, nome: "Nova alça", custo: 0, precoMilheiro: null }] });
  };
  const removeAlca = (idx) => {
    setDraft({ ...draft, alcas: draft.alcas.filter((_, i) => i !== idx) });
  };

  const updateModelo = (idx, field, value) => {
    const novos = [...draft.modelos];
    novos[idx] = { ...novos[idx], [field]: value };
    setDraft({ ...draft, modelos: novos });
  };
  const addModelo = () => {
    setDraft({ ...draft, modelos: [...draft.modelos, { code: "Novo modelo", dim: "", sacolasPorFolha: 1 }] });
  };
  const removeModelo = (idx) => {
    setDraft({ ...draft, modelos: draft.modelos.filter((_, i) => i !== idx) });
  };

  const updateLaminacao = (modelCode, value) => {
    setDraft({ ...draft, laminacao: { ...draft.laminacao, [modelCode]: value === "" ? null : Number(value) } });
  };

  return (
    <div style={styles.settingsWrap}>
      <div style={styles.actionsBar}>
        {dirty && <span style={styles.dirty}>● Alterações não salvas</span>}
        <button style={styles.btnGhost} onClick={onReset}>Restaurar padrão</button>
        <button style={styles.btnPrimary} onClick={save} disabled={!dirty}>Salvar</button>
      </div>

      {/* Constantes globais */}
      <details style={styles.det} open>
        <summary style={styles.detSummary}>Constantes de custo</summary>
        <div style={styles.detBody}>
          <NumberRow label="Impressão (R$ por folha impressa)" value={draft.impressaoPorFolha}
                     onChange={(v) => setDraft({ ...draft, impressaoPorFolha: v })} step="0.01" />
          <NumberRow label="Cola hotmelt (R$ por sacola)" value={draft.colaPorSacola}
                     onChange={(v) => setDraft({ ...draft, colaPorSacola: v })} step="0.01" />
          <NumberRow label="Verniz (R$ por sacola)" value={draft.vernizPorSacola}
                     onChange={(v) => setDraft({ ...draft, vernizPorSacola: v })} step="0.01" />
          <NumberRow label="Ilhós — custo unitário (R$)" value={draft.ilhosPorUnidade}
                     onChange={(v) => setDraft({ ...draft, ilhosPorUnidade: v })} step="0.01" />
          <NumberRow label="Ilhoses por sacola (qtd)" value={draft.ilhosPorSacola}
                     onChange={(v) => setDraft({ ...draft, ilhosPorSacola: v })} step="1" />
          <NumberRow label="Chapa offset — custo unitário (R$)" value={draft.custoChapaUnitario}
                     onChange={(v) => setDraft({ ...draft, custoChapaUnitario: v })} step="1" />
          <NumberRow label="Tarifa de frete (R$/kg) — usada na Cotação de papel" value={draft.tarifaFrete}
                     onChange={(v) => setDraft({ ...draft, tarifaFrete: v })} step="0.01" />
          <NumberRow label="Pintura plástico (R$ por cor por lado)" value={draft.pinturaPorCorPorLado}
                     onChange={(v) => setDraft({ ...draft, pinturaPorCorPorLado: v })} step="0.01" />
          <NumberRow label="Markup padrão (multiplicador)" value={draft.markupPadrao}
                     onChange={(v) => setDraft({ ...draft, markupPadrao: v })} step="0.1" />
          <p style={styles.helpText}>
            <strong>Chapa offset</strong>: o sistema cobra 1 chapa por cor da embalagem,
            amortizada pela tiragem. A 1ª chapa (1 cor) está sempre inclusa no processo.
          </p>
        </div>
      </details>

      {/* Papéis */}
      <details style={styles.det}>
        <summary style={styles.detSummary}>Papéis ({draft.papeis.length})</summary>
        <div style={styles.detBody}>
          <p style={styles.helpText}>
            Para adicionar um papel especial novo, clique em <strong>Adicionar papel</strong> e informe o preço da folha 66×96cm.
            Todos os modelos terão o custo recalculado automaticamente.
          </p>
          <table style={styles.editTable}>
            <thead><tr><th>Nome</th><th>Folha 66×96cm (R$)</th><th></th></tr></thead>
            <tbody>
              {draft.papeis.map((p, i) => (
                <tr key={p.id}>
                  <td><input style={styles.input} value={p.nome}
                             onChange={(e) => updatePapel(i, "nome", e.target.value)} /></td>
                  <td><input type="number" step="0.01" style={styles.input}
                             value={p.preco}
                             onChange={(e) => updatePapel(i, "preco", Number(e.target.value))} /></td>
                  <td><button style={styles.btnDel} onClick={() => removePapel(i)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={styles.btnGhost} onClick={addPapel}>+ Adicionar papel</button>
        </div>
      </details>

      {/* Alças */}
      <details style={styles.det}>
        <summary style={styles.detSummary}>Alças ({draft.alcas.length})</summary>
        <div style={styles.detBody}>
          <p style={styles.helpText}>
            Cada sacola usa <strong>{ALCAS_POR_SACOLA} alças</strong>. Cadastre o <strong>preço do milheiro</strong> (R$ por mil unidades, com frete) e o sistema calcula o custo por sacola automaticamente. Se preferir, use a coluna "Custo manual" para cravar um valor fixo (ex: alças sem cotação atualizada).
          </p>
          <table style={styles.editTable}>
            <thead>
              <tr>
                <th style={styles.thLeft}>Nome</th>
                <th style={styles.thRight}>Preço milheiro (R$)</th>
                <th style={styles.thRight}>Custo por sacola</th>
                <th style={styles.thRight}>Custo manual (R$)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {draft.alcas.map((a, i) => {
                const custoEfetivo = custoAlcaPorSacola(a);
                const usaMilheiro = a.precoMilheiro != null && a.precoMilheiro > 0;
                return (
                  <tr key={a.id}>
                    <td><input style={styles.input} value={a.nome}
                               onChange={(e) => updateAlca(i, "nome", e.target.value)} /></td>
                    <td>
                      <input type="number" step="0.01" style={styles.input}
                             value={a.precoMilheiro ?? ""}
                             placeholder="—"
                             onChange={(e) => updateAlca(i, "precoMilheiro",
                               e.target.value === "" ? null : Number(e.target.value))} />
                    </td>
                    <td style={{ ...styles.tdVal, ...(usaMilheiro ? { color: palette.accent, fontWeight: 600 } : { color: palette.inkSoft }) }}>
                      {fmt(custoEfetivo)}
                      <div style={styles.tdHint}>
                        {usaMilheiro ? "derivado do milheiro" : "do custo manual"}
                      </div>
                    </td>
                    <td>
                      <input type="number" step="0.01" style={{ ...styles.input, opacity: usaMilheiro ? 0.4 : 1 }}
                             value={a.custo}
                             title={usaMilheiro ? "Ignorado quando milheiro está preenchido" : ""}
                             onChange={(e) => updateAlca(i, "custo", Number(e.target.value))} />
                    </td>
                    <td><button style={styles.btnDel} onClick={() => removeAlca(i)}>×</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button style={styles.btnGhost} onClick={addAlca}>+ Adicionar alça</button>
        </div>
      </details>

      {/* Modelos */}
      <details style={styles.det}>
        <summary style={styles.detSummary}>Modelos de sacola ({draft.modelos.length})</summary>
        <div style={styles.detBody}>
          <p style={styles.helpText}>
            <strong>Sacolas por folha</strong>: quantas sacolas saem de uma folha 66×96cm. Exemplo: SP 4003 = 4 sacolas/folha. SAT 05 grande = 0,5 (precisa de 2 folhas).
          </p>
          <table style={styles.editTable}>
            <thead><tr><th>Código</th><th>Dimensões</th><th>Sacolas/folha</th><th></th></tr></thead>
            <tbody>
              {draft.modelos.map((m, i) => (
                <tr key={i}>
                  <td><input style={styles.input} value={m.code}
                             onChange={(e) => updateModelo(i, "code", e.target.value)} /></td>
                  <td><input style={styles.input} value={m.dim}
                             onChange={(e) => updateModelo(i, "dim", e.target.value)} /></td>
                  <td><input type="number" step="0.5" style={styles.input}
                             value={m.sacolasPorFolha}
                             onChange={(e) => updateModelo(i, "sacolasPorFolha", Number(e.target.value))} /></td>
                  <td><button style={styles.btnDel} onClick={() => removeModelo(i)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={styles.btnGhost} onClick={addModelo}>+ Adicionar modelo</button>
        </div>
      </details>

      {/* Laminação */}
      <details style={styles.det}>
        <summary style={styles.detSummary}>Laminação por modelo</summary>
        <div style={styles.detBody}>
          <p style={styles.helpText}>Custo unitário de laminação fosca ou brilhosa, conforme tabela atual. Deixe vazio nos modelos que não produzem laminação.</p>
          <table style={styles.editTable}>
            <thead><tr><th>Modelo</th><th>Custo (R$)</th></tr></thead>
            <tbody>
              {draft.modelos.map((m) => (
                <tr key={m.code}>
                  <td>{m.code}</td>
                  <td>
                    <input type="number" step="0.01" style={styles.input}
                           value={draft.laminacao[m.code] ?? ""}
                           placeholder="—"
                           onChange={(e) => updateLaminacao(m.code, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Modelos de plástico */}
      <details style={styles.det}>
        <summary style={styles.detSummary}>Modelos de plástico ({draft.plasticCategorias.reduce((sum, c) => sum + c.modelos.length, 0)})</summary>
        <div style={styles.detBody}>
          <p style={styles.helpText}>
            Edite preços dos modelos de plástico por faixa de quantidade. Modelos sem preço mostram "—" (preencha para usar na calculadora).
          </p>
          {draft.plasticCategorias.map((cat, catIdx) => (
            <details key={cat.id} style={styles.detInner}>
              <summary style={styles.detSummaryInner}>
                {cat.nome} ({cat.modelos.length})
                {cat.pinturaApenasUmLado && <span style={styles.tagWarn}> · 1 lado</span>}
              </summary>
              <div style={styles.detInnerBody}>
                <table style={styles.editTable}>
                  <thead>
                    <tr>
                      <th style={styles.thLeft}>Código</th>
                      <th style={styles.thLeft}>Dimensões</th>
                      {cat.faixas.map((f, i) => (
                        <th key={i} style={styles.thRight}>{f.label}</th>
                      ))}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.modelos.map((m, mIdx) => (
                      <tr key={mIdx}>
                        <td>
                          <input style={styles.input} value={m.code}
                                 onChange={(e) => {
                                   const novas = [...draft.plasticCategorias];
                                   novas[catIdx].modelos[mIdx] = { ...m, code: e.target.value };
                                   setDraft({ ...draft, plasticCategorias: novas });
                                 }} />
                        </td>
                        <td>
                          <input style={styles.input} value={m.dim}
                                 onChange={(e) => {
                                   const novas = [...draft.plasticCategorias];
                                   novas[catIdx].modelos[mIdx] = { ...m, dim: e.target.value };
                                   setDraft({ ...draft, plasticCategorias: novas });
                                 }} />
                        </td>
                        {cat.faixas.map((_, fIdx) => (
                          <td key={fIdx}>
                            <input type="number" step="0.01" style={styles.input}
                                   value={m.precos[fIdx] ?? ""}
                                   placeholder="—"
                                   onChange={(e) => {
                                     const novas = [...draft.plasticCategorias];
                                     const novosPrecos = [...m.precos];
                                     novosPrecos[fIdx] = e.target.value === "" ? null : Number(e.target.value);
                                     novas[catIdx].modelos[mIdx] = { ...m, precos: novosPrecos };
                                     setDraft({ ...draft, plasticCategorias: novas });
                                   }} />
                          </td>
                        ))}
                        <td>
                          <button style={styles.btnDel}
                                  onClick={() => {
                                    const novas = [...draft.plasticCategorias];
                                    novas[catIdx].modelos = novas[catIdx].modelos.filter((_, i) => i !== mIdx);
                                    setDraft({ ...draft, plasticCategorias: novas });
                                  }}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button style={styles.btnGhost}
                        onClick={() => {
                          const novas = [...draft.plasticCategorias];
                          novas[catIdx].modelos = [
                            ...novas[catIdx].modelos,
                            { code: "Novo", dim: "", precos: cat.faixas.map(() => null) }
                          ];
                          setDraft({ ...draft, plasticCategorias: novas });
                        }}>
                  + Adicionar modelo nesta categoria
                </button>

                {/* Cores e observações desta categoria */}
                <div style={styles.coresEditBox}>
                  <Field label="Cores disponíveis (separadas por vírgula)">
                    <input type="text" style={styles.input}
                           value={(cat.cores || []).join(", ")}
                           onChange={(e) => {
                             const novas = [...draft.plasticCategorias];
                             const lista = e.target.value.split(",").map(s => s.trim()).filter(s => s);
                             novas[catIdx] = { ...cat, cores: lista };
                             setDraft({ ...draft, plasticCategorias: novas });
                           }} />
                  </Field>
                  <Field label="Observações (uma por linha)">
                    <textarea style={{ ...styles.input, minHeight: 60, fontFamily: "inherit", resize: "vertical" }}
                              value={(cat.observacoes || []).join("\n")}
                              onChange={(e) => {
                                const novas = [...draft.plasticCategorias];
                                const lista = e.target.value.split("\n").map(s => s.trim()).filter(s => s);
                                novas[catIdx] = { ...cat, observacoes: lista };
                                setDraft({ ...draft, plasticCategorias: novas });
                              }} />
                  </Field>
                </div>
              </div>
            </details>
          ))}
        </div>
      </details>

      {/* Hot stamping */}
      <details style={styles.det}>
        <summary style={styles.detSummary}>Hot stamping — chapa e filme</summary>
        <div style={styles.detBody}>
          <p style={styles.helpText}>
            <strong>Chapa (Nova Clicheria, zinco 3,0mm)</strong>: o cálculo soma 1cm de borda em cada lado da arte para obter a área da chapa.
          </p>
          <table style={styles.editTable}>
            <thead><tr><th>Faixa de área (cm²)</th><th>Preço (R$)</th><th>Por cm² (R$)</th></tr></thead>
            <tbody>
              {draft.hotChapaFaixas.map((f, i) => (
                <tr key={i}>
                  <td>{f.ate ? `Até ${f.ate}` : "Acima de 100"}</td>
                  <td>
                    <input type="number" step="1" style={styles.input}
                           value={f.preco ?? ""}
                           disabled={f.ate === null}
                           onChange={(e) => {
                             const novas = [...draft.hotChapaFaixas];
                             novas[i] = { ...novas[i], preco: e.target.value === "" ? null : Number(e.target.value) };
                             setDraft({ ...draft, hotChapaFaixas: novas });
                           }} />
                  </td>
                  <td>
                    <input type="number" step="0.01" style={styles.input}
                           value={f.porCm2 ?? ""}
                           disabled={f.ate !== null}
                           onChange={(e) => {
                             const novas = [...draft.hotChapaFaixas];
                             novas[i] = { ...novas[i], porCm2: e.target.value === "" ? null : Number(e.target.value) };
                             setDraft({ ...draft, hotChapaFaixas: novas });
                           }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <NumberRow label="Frete por chapa (R$) — cobrado pela clicheria de fora"
                     value={draft.hotChapaFrete ?? 0} step="1"
                     onChange={(v) => setDraft({ ...draft, hotChapaFrete: v })} />

          <p style={styles.helpText} >
            <strong>Filme</strong>: cada batida da máquina consome uma faixa de <strong>largura da bobina × altura da arte</strong> (não apenas a área da arte — a largura da bobina toda é desperdiçada em cada batida). Cada sacola tem 2 batidas (dois lados). Use "Aproveitamento da sobra" para reduzir esse desperdício se a sobra da bobina for reaproveitada em outros pedidos.
          </p>
          <NumberRow label="Largura da bobina (mm)" value={draft.hotFilme.largura_mm} step="1"
                     onChange={(v) => setDraft({ ...draft, hotFilme: { ...draft.hotFilme, largura_mm: v } })} />
          <NumberRow label="Comprimento da bobina (m)" value={draft.hotFilme.comprimento_m} step="1"
                     onChange={(v) => setDraft({ ...draft, hotFilme: { ...draft.hotFilme, comprimento_m: v } })} />
          <NumberRow label="Preço total da bobina com IPI (R$)" value={draft.hotFilme.preco_total} step="0.01"
                     onChange={(v) => setDraft({ ...draft, hotFilme: { ...draft.hotFilme, preco_total: v } })} />
          <NumberRow label="Margem de sobra/perda (decimal — ex: 0.08 = 8%)" value={draft.hotFilme.margem_sobra} step="0.01"
                     onChange={(v) => setDraft({ ...draft, hotFilme: { ...draft.hotFilme, margem_sobra: v } })} />
          <NumberRow label="Aproveitamento da sobra (decimal — 0 = pior caso, 0.30 = 30% reaproveitado)"
                     value={draft.hotFilme.aproveitamento_sobra || 0} step="0.05"
                     onChange={(v) => setDraft({ ...draft, hotFilme: { ...draft.hotFilme, aproveitamento_sobra: Math.max(0, Math.min(1, v)) } })} />
        </div>
      </details>
    </div>
  );
}

// ---------- Componentes auxiliares ----------

function Field({ label, children, small }) {
  return (
    <div style={small ? styles.fieldSmall : styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function CheckRow({ checked, onChange, label, hint, small }) {
  return (
    <div style={small ? styles.checkRowSmall : styles.checkRow}>
      <label style={styles.checkLabel}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
      {hint && <small style={styles.hint}>{hint}</small>}
    </div>
  );
}

function NumberRow({ label, value, onChange, step }) {
  return (
    <div style={styles.numberRow}>
      <label style={styles.numberLabel}>{label}</label>
      <input type="number" step={step || "0.01"} style={styles.input}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

// =====================================================================
// ESTILOS
// =====================================================================

const palette = {
  paper: "#F5ECE2",       // creme quente
  card: "#FFFAF5",        // branco suave
  ink: "#2A1517",         // vinho-tinta profundo
  inkSoft: "#5C3D3F",     // cinza-vinho suave
  rule: "#E5D5D0",        // bege-rosado
  accent: "#8B111C",      // vinho da marca (Flor de Maria)
  accentSoft: "#F0DCDE",  // vinho lavado
  accentDeep: "#5A0A11",  // vinho profundo (caixas de destaque)
  good: "#6B7A4F",        // verde oliva harmônico
  warn: "#B05B0F",
  err: "#8B1A1F",
};

const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
body { margin: 0; }
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
input[type="range"] { accent-color: ${palette.accent}; }
button { font-family: inherit; cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: 0.4; }
details summary { cursor: pointer; user-select: none; }
details summary::-webkit-details-marker { display: none; }
details summary:before {
  content: "▸"; display: inline-block; margin-right: 0.5em;
  transition: transform 0.15s; color: ${palette.accent};
}
details[open] summary:before { transform: rotate(90deg); }
`;

const styles = {
  loading: { padding: 60, textAlign: "center", fontFamily: "serif", color: palette.inkSoft },
  app: {
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    background: palette.paper,
    color: palette.ink,
    minHeight: "100vh",
    padding: 0,
    backgroundImage: "radial-gradient(circle at 20% 30%, rgba(139, 17, 28, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 100%, rgba(90, 10, 17, 0.03) 0%, transparent 50%)",
  },
  header: {
    background: palette.accent,
    color: "white",
    padding: "24px 0",
    marginBottom: 32,
    boxShadow: `0 1px 0 ${palette.accentDeep}`,
  },
  headerInner: {
    maxWidth: 1100, margin: "0 auto", padding: "0 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: 16,
  },
  headerBrand: {
    display: "flex", alignItems: "center", gap: 16,
  },
  logo: {
    width: 56, height: 56, display: "block",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
  },
  title: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 30, fontWeight: 600, margin: 0,
    letterSpacing: "-0.01em", color: "white",
    fontVariationSettings: "'opsz' 96",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "4px 0 0", color: "rgba(255,255,255,0.75)", fontSize: 13,
  },
  nav: { display: "flex", gap: 0, flexWrap: "wrap" },
  navBtn: {
    padding: "8px 16px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent", color: "rgba(255,255,255,0.85)",
    fontSize: 13, fontWeight: 500, borderRadius: 0,
    transition: "all 0.15s",
    marginLeft: -1,
  },
  navBtnActive: {
    background: "white", color: palette.accent,
    borderColor: "white", fontWeight: 600,
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: "0 16px" },
  footer: {
    maxWidth: 1100, margin: "32px auto 0", padding: "16px",
    fontSize: 12, color: palette.inkSoft, textAlign: "center",
    borderTop: `1px solid ${palette.rule}`,
  },
  calcGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 24,
  },
  card: {
    background: palette.card, border: `1px solid ${palette.rule}`,
    padding: 24,
  },
  resultCard: {
    position: "sticky", top: 16,
    alignSelf: "start",
  },
  cardTitle: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 22, fontWeight: 600, margin: "0 0 16px",
    fontVariationSettings: "'opsz' 96",
  },
  sectionTitle: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 14, fontWeight: 600, margin: "24px 0 12px",
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: palette.accent, fontVariationSettings: "'opsz' 14",
  },
  field: { marginBottom: 14 },
  fieldSmall: { marginBottom: 8 },
  label: {
    display: "block", fontSize: 12, fontWeight: 500,
    color: palette.inkSoft, marginBottom: 4, letterSpacing: "0.02em",
  },
  input: {
    width: "100%", padding: "8px 10px",
    border: `1px solid ${palette.rule}`, background: "white",
    fontFamily: "inherit", fontSize: 14, color: palette.ink,
    borderRadius: 0, outline: "none",
  },
  hint: { display: "block", fontSize: 11, color: palette.inkSoft, marginTop: 4 },
  warn: { fontSize: 12, color: palette.warn, margin: "4px 0 12px" },
  error: { color: palette.err, fontSize: 14 },
  checkRow: {
    display: "flex", flexDirection: "column", gap: 2,
    padding: "8px 0", borderBottom: `1px dashed ${palette.rule}`,
  },
  checkRowSmall: {
    display: "flex", flexDirection: "column", gap: 2, padding: "4px 0",
  },
  checkLabel: {
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 14, cursor: "pointer",
  },
  subBox: {
    padding: 12, marginTop: 8, marginLeft: 24,
    border: `1px solid ${palette.rule}`, background: palette.paper,
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  slider: { width: "100%" },
  subtle: { color: palette.inkSoft, fontSize: 13, margin: "4px 0 16px" },
  table: {
    width: "100%", borderCollapse: "collapse", fontSize: 13,
    marginBottom: 8,
  },
  tdLabel: {
    padding: "8px 8px 8px 0", borderBottom: `1px solid ${palette.rule}`,
    color: palette.ink, verticalAlign: "top",
  },
  tdHint: { fontSize: 11, color: palette.inkSoft, marginTop: 2 },
  tdVal: {
    padding: "8px 0 8px 8px", borderBottom: `1px solid ${palette.rule}`,
    textAlign: "right", color: palette.ink, fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  trTotal: { background: palette.accentSoft },
  priceBox: {
    marginTop: 16, padding: 20,
    background: palette.accentDeep, color: palette.paper, textAlign: "center",
  },
  priceLabel: {
    fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em",
    opacity: 0.7, marginBottom: 4,
  },
  priceValue: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 36, fontWeight: 600, fontVariantNumeric: "tabular-nums",
    fontVariationSettings: "'opsz' 96",
  },
  priceTotal: { marginTop: 12, fontSize: 14, opacity: 0.9 },
  priceProfit: { marginTop: 4, fontSize: 12, opacity: 0.7, color: "#E8C4A0" },
  disclaimer: { fontSize: 11, color: palette.inkSoft, marginTop: 16, lineHeight: 1.5 },
  // quotation
  quotWrap: { maxWidth: 1100, margin: "0 auto" },
  quotIntro: { marginBottom: 24 },
  quotGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 24,
  },
  subTabs: {
    display: "flex", gap: 0, marginBottom: 24,
    borderBottom: `1px solid ${palette.rule}`,
  },
  subTabBtn: {
    padding: "10px 20px",
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent", color: palette.inkSoft,
    fontFamily: "inherit", fontSize: 14, fontWeight: 500,
    cursor: "pointer", marginBottom: -1,
    transition: "all 0.15s",
  },
  subTabBtnActive: {
    color: palette.accent,
    borderBottom: `2px solid ${palette.accent}`,
    fontWeight: 600,
  },
  btnRow: {
    display: "flex", alignItems: "center", gap: 12, marginTop: 16,
    flexWrap: "wrap",
  },
  savedHint: { fontSize: 12, color: palette.good },
  thLeft: {
    textAlign: "left", padding: "8px 8px 8px 0",
    borderBottom: `1px solid ${palette.rule}`,
    fontSize: 11, fontWeight: 600, color: palette.inkSoft,
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  thRight: {
    textAlign: "right", padding: "8px 0 8px 8px",
    borderBottom: `1px solid ${palette.rule}`,
    fontSize: 11, fontWeight: 600, color: palette.inkSoft,
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  // settings
  settingsWrap: { maxWidth: 800, margin: "0 auto" },
  actionsBar: {
    display: "flex", justifyContent: "flex-end", alignItems: "center",
    gap: 12, marginBottom: 16, paddingBottom: 16,
    borderBottom: `1px solid ${palette.rule}`,
  },
  dirty: { fontSize: 12, color: palette.warn, marginRight: "auto" },
  btnPrimary: {
    background: palette.accent, color: "white", border: "none",
    padding: "8px 20px", fontSize: 14, fontWeight: 500,
  },
  btnGhost: {
    background: "transparent", color: palette.ink,
    border: `1px solid ${palette.rule}`, padding: "8px 16px",
    fontSize: 13,
  },
  btnDel: {
    background: "transparent", color: palette.err, border: "none",
    fontSize: 18, padding: "0 8px", lineHeight: 1,
  },
  det: {
    background: palette.card, border: `1px solid ${palette.rule}`,
    marginBottom: 12,
  },
  detSummary: {
    padding: 14, fontWeight: 600,
    fontFamily: "'Fraunces', Georgia, serif", fontSize: 16,
    fontVariationSettings: "'opsz' 24",
  },
  detBody: {
    padding: "0 14px 14px", borderTop: `1px solid ${palette.rule}`,
  },
  detInner: {
    background: palette.paper, border: `1px solid ${palette.rule}`,
    marginTop: 8,
  },
  detSummaryInner: {
    padding: 10, fontSize: 13, fontWeight: 500, color: palette.ink,
  },
  detInnerBody: {
    padding: 10, borderTop: `1px solid ${palette.rule}`,
    background: palette.card,
    overflowX: "auto",
  },
  tagWarn: {
    fontSize: 11, color: palette.warn,
  },
  // cores disponíveis
  coresWrap: {
    marginTop: 12,
    border: `1px solid ${palette.rule}`,
    background: palette.paper,
  },
  coresToggle: {
    width: "100%", padding: "8px 12px", textAlign: "left",
    background: "transparent", border: "none",
    fontFamily: "inherit", fontSize: 12, color: palette.accent,
    fontWeight: 500, cursor: "pointer",
  },
  coresBox: {
    padding: "0 12px 12px",
    borderTop: `1px solid ${palette.rule}`,
  },
  coresLabel: {
    fontSize: 11, fontWeight: 600, color: palette.inkSoft,
    textTransform: "uppercase", letterSpacing: "0.05em",
    marginTop: 8, marginBottom: 6,
  },
  coresList: {
    display: "flex", flexWrap: "wrap", gap: 4,
  },
  corChip: {
    background: "white", border: `1px solid ${palette.rule}`,
    padding: "2px 8px", fontSize: 11, color: palette.ink,
  },
  obsList: {
    margin: 0, paddingLeft: 16, fontSize: 11.5,
    color: palette.ink, lineHeight: 1.5,
  },
  obsItem: { marginBottom: 4 },
  coresEditBox: {
    marginTop: 12, padding: 12, background: palette.paper,
    border: `1px solid ${palette.rule}`,
  },
  helpText: { fontSize: 12, color: palette.inkSoft, lineHeight: 1.5, margin: "12px 0" },
  numberRow: {
    display: "grid", gridTemplateColumns: "1fr 140px", gap: 12,
    alignItems: "center", padding: "8px 0",
    borderBottom: `1px dashed ${palette.rule}`,
  },
  numberLabel: { fontSize: 13, color: palette.ink },
  editTable: {
    width: "100%", borderCollapse: "collapse", fontSize: 13,
    margin: "8px 0",
  },
};

// Apply table th styles via styled object too (since editTable th)
Object.assign(styles, {});

export default App;
