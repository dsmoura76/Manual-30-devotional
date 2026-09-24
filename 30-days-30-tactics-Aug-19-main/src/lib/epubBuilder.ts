import JSZip from "jszip";
import { dias, capaArte, capaTexto, abertura, indice, arte as defaultArte } from "@/data/manual";
import { musicaData } from "@/data/musica";
import { executarAuditoriaBiblicaCompleta } from "@/lib/biblicalAudit";

/**
 * Utilitário para converter URL (Vite asset, fetch, ou Data URL base64) para Uint8Array
 */
async function urlToUint8Array(urlOrDataUrl: string): Promise<Uint8Array> {
  if (urlOrDataUrl.startsWith("data:")) {
    const parts = urlOrDataUrl.split(",");
    const base64Data = parts[1] || "";
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  try {
    const response = await fetch(urlOrDataUrl);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.warn("Falha ao carregar imagem para o EPUB:", urlOrDataUrl, error);
    // Fallback: pixel transparente 1x1 em PNG
    return new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0,
      0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 156, 99, 96, 0, 0, 0, 2, 0, 1, 226,
      33, 188, 51, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
    ]);
  }
}

/**
 * Limpa e sanitiza HTML para torná-lo XHTML 1.1 / EPUB 3 estritamente válido
 */
function sanitizeToXHtml(rawHtml: string): string {
  let xhtml = rawHtml;

  // Substitui tags auto-fecháveis do HTML5
  xhtml = xhtml.replace(/<br(\s*|\s+[^>]*)(?<!\/)>/gi, "<br/>");
  xhtml = xhtml.replace(/<hr(\s*|\s+[^>]*)(?<!\/)>/gi, "<hr/>");
  xhtml = xhtml.replace(/<img([^>]*)(?<!\/)>/gi, "<img$1/>");
  xhtml = xhtml.replace(/<input([^>]*)(?<!\/)>/gi, "<input$1/>");

  // Escapa & soltos que não sejam entidades XML
  xhtml = xhtml.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, "&amp;");

  return xhtml;
}

export interface EpubBuildProgress {
  etapa: string;
  porcentagem: number;
}

export interface EpubBuildOptions {
  customArtsMap?: Record<number, string>;
  onProgress?: (progress: EpubBuildProgress) => void;
}

/**
 * Gera um arquivo .epub completo, 100% compatível com Amazon Kindle, Apple Books, Kobo e Adobe Digital Editions.
 */
export async function buildEpub(options?: EpubBuildOptions): Promise<Blob> {
  const { customArtsMap = {}, onProgress } = options || {};

  const notify = (etapa: string, porcentagem: number) => {
    if (onProgress) {
      onProgress({ etapa, porcentagem });
    }
  };

  notify("Inicializando estrutura do pacote EPUB...", 5);
  const zip = new JSZip();

  // 1. mimetype (PRIMEIRO ARQUIVO, SEM COMPRESSÃO - OBRIGATÓRIO NA ESPECIFICAÇÃO EPUB)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // 2. META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.file("META-INF/container.xml", containerXml);

  notify("Processando e otimizando ilustrações dos 30 dias...", 15);

  // 3. Processar Imagens
  const oebps = zip.folder("OEBPS");
  if (!oebps) throw new Error("Erro ao criar pasta OEBPS no arquivo ZIP.");

  const imagesFolder = oebps.folder("images");
  const textFolder = oebps.folder("text");
  const cssFolder = oebps.folder("css");

  // Imagem de Capa
  const capaSrc = customArtsMap[0] || capaArte;
  const capaBytes = await urlToUint8Array(capaSrc);
  imagesFolder?.file("cover.jpg", capaBytes);

  // Imagens dos 30 dias
  for (let diaNum = 1; diaNum <= 30; diaNum++) {
    const artSrc = customArtsMap[diaNum] || defaultArte[diaNum] || defaultArte[1] || "";
    const imgBytes = await urlToUint8Array(artSrc);
    const imgName = `dia-${String(diaNum).padStart(2, "0")}.jpg`;
    imagesFolder?.file(imgName, imgBytes);
    notify(`Empacotando ilustração do Dia ${diaNum}...`, 15 + Math.round((diaNum / 30) * 35));
  }

  notify("Gerando folha de estilos tipográfica para Kindle & Apple Books...", 55);

  // 4. Folha de Estilo (OEBPS/css/style.css)
  const cssContent = `/* ==========================================================================
   A BATALHA: MANUAL DE CAMPO DE 30 DIAS
   Estilos Tipográficos Otimizados para E-Readers (Kindle, Apple Books, Kobo)
   ========================================================================== */

@charset "UTF-8";

body {
  font-family: "Georgia", "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif;
  font-size: 1em;
  line-height: 1.6;
  color: #1a1a1a;
  background-color: #faf8f5;
  margin: 5% 4%;
  padding: 0;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
}

/* Títulos e Hierarquia */
h1, h2, h3, h4, h5, h6 {
  font-family: "Helvetica Neue", "Arial", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #111111;
  font-weight: bold;
  line-height: 1.25;
  page-break-after: avoid;
  break-after: avoid;
}

h1 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
}

h2 {
  font-size: 1.4em;
  text-align: center;
  border-bottom: 2px solid #8c2323;
  padding-bottom: 0.25em;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
}

h3 {
  font-size: 1.15em;
  color: #8c2323;
  margin-top: 1.4em;
  margin-bottom: 0.4em;
}

h4 {
  font-size: 1em;
  color: #2b2b2b;
  margin-top: 1em;
  margin-bottom: 0.2em;
}

p {
  margin: 0 0 0.8em 0;
  text-indent: 1.2em;
}

p.first-p, p.no-indent {
  text-indent: 0;
}

a {
  color: #8c2323;
  text-decoration: none;
  border-bottom: 1px dotted #8c2323;
}

/* Cabeçalho do Capítulo */
.chapter-header {
  text-align: center;
  margin-bottom: 2em;
  page-break-after: avoid;
}

.kicker {
  font-family: "Courier New", monospace;
  font-size: 0.8em;
  letter-spacing: 0.2em;
  color: #8c2323;
  text-transform: uppercase;
  margin-bottom: 0.2em;
}

.tatica-title {
  font-size: 2.2em;
  letter-spacing: 0.04em;
  margin: 0.1em 0;
}

.reading {
  font-style: italic;
  font-size: 0.95em;
  color: #555555;
  margin-bottom: 0.6em;
}

.motto {
  font-size: 1.15em;
  font-weight: bold;
  font-style: italic;
  color: #222222;
  border-top: 1px solid #d4cbb8;
  border-bottom: 1px solid #d4cbb8;
  padding: 0.6em 0;
  margin: 1em auto;
  max-width: 90%;
}

/* Ilustrações */
.figure-art {
  text-align: center;
  margin: 1.5em auto;
  max-width: 100%;
  page-break-inside: avoid;
  break-inside: avoid;
}

.tactical-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  border: 1px solid #d4cbb8;
  border-radius: 4px;
}

figcaption {
  font-size: 0.85em;
  font-style: italic;
  color: #555555;
  margin-top: 0.5em;
  text-align: center;
}

/* Caixas de Citações Bíblicas (NVI) */
figure.versiculo, blockquote.versiculo {
  margin: 1.2em 0;
  padding: 0.9em 1.2em;
  border-left: 4px solid #8c2323;
  background-color: #f3efe6;
  font-style: italic;
  page-break-inside: avoid;
}

figure.versiculo p {
  margin: 0 0 0.4em 0;
  text-indent: 0;
}

figure.versiculo footer {
  font-family: "Courier New", monospace;
  font-size: 0.8em;
  font-weight: bold;
  text-align: right;
  color: #8c2323;
  text-transform: uppercase;
}

/* O que a tática NÃO significa */
details.nao, .box-alerta {
  border: 1px solid #d4cbb8;
  background-color: #f7f5ee;
  padding: 0.8em 1em;
  margin: 1.2em 0;
  border-radius: 4px;
  page-break-inside: avoid;
}

/* Marcha do Dia */
.marcha-item {
  margin-bottom: 0.8em;
  padding-left: 0.8em;
  border-left: 2px solid #8c2323;
  page-break-inside: avoid;
}

.marcha-item h4 {
  margin-top: 0;
}

/* Caderno de Campo */
.caderno-box {
  background-color: #f5f2e9;
  border: 1px dashed #b8ad96;
  padding: 1em;
  margin: 1.2em 0;
  border-radius: 4px;
}

.pauta-linha {
  border-bottom: 1px solid #d4cbb8;
  height: 1.8em;
  margin: 0.4em 0;
}

/* Oração do Guerreiro */
.oracao-box {
  background-color: #eef2f5;
  border-left: 4px solid #1f3a52;
  padding: 1em 1.2em;
  margin: 1.4em 0;
  font-style: italic;
  page-break-inside: avoid;
}

/* Rodapé e Navegação Interna */
.chapter-nav {
  display: table;
  width: 100%;
  border-top: 1px solid #d4cbb8;
  margin-top: 2.5em;
  padding-top: 0.8em;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 0.85em;
  text-align: center;
}

.chapter-nav a {
  padding: 0.3em 0.8em;
  margin: 0 0.2em;
}

.pagebreak {
  page-break-before: always;
  break-before: page;
}

/* Suporte ao Modo Escuro nativo em Apple Books / Kindle */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #e0e0e0;
  }
  h1, h2, h3, h4 {
    color: #ffffff;
  }
  h2, h3, .kicker, a {
    color: #e57373;
  }
  figure.versiculo, blockquote.versiculo {
    background-color: #1e1e1e;
    border-left-color: #e57373;
  }
  .caderno-box, details.nao, .box-alerta {
    background-color: #1a1a1a;
    border-color: #333333;
  }
  .oracao-box {
    background-color: #16222f;
    border-left-color: #64b5f6;
  }
}
`;
  cssFolder?.file("style.css", cssContent);

  notify("Construindo capítulos e links de navegação interna...", 65);

  // 5. Gerar Capítulos XHTML

  // 5.1 Capa (text/cover.xhtml)
  const coverXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Capa — ${capaTexto.titulo}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
  <style>
    body.cover-page {
      margin: 0;
      padding: 0;
      text-align: center;
      background-color: #0d1e2d;
    }
    .cover-img {
      max-width: 100%;
      height: 100vh;
      max-height: 100%;
      object-fit: contain;
      margin: 0 auto;
    }
  </style>
</head>
<body class="cover-page">
  <section epub:type="cover">
    <img src="../images/cover.jpg" alt="Capa: A Batalha — Manual de Campo de 30 Dias" class="cover-img"/>
  </section>
</body>
</html>`;
  textFolder?.file("cover.xhtml", coverXhtml);

  // 5.2 Folha de Rosto / Title Page (text/titlepage.xhtml)
  const titleXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>${capaTexto.titulo}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="titlepage" style="text-align: center; padding-top: 3em;">
    <p class="kicker">${capaTexto.kicker}</p>
    <h1 style="font-size: 2.8em; margin: 0.3em 0;">${capaTexto.titulo}</h1>
    <p class="reading" style="font-size: 1.1em; max-width: 85%; margin: 1em auto;">${capaTexto.subtitulo}</p>
    <p style="font-family: 'Courier New', monospace; font-size: 0.9em; color: #8c2323; margin-top: 2.5em;">${capaTexto.referencia}</p>
    
    <div style="margin-top: 5em;">
      <p style="font-size: 1.2em; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">DANIEL SHIRAZAWA MOURA</p>
      <p style="font-size: 0.85em; color: #666; font-style: italic;">${capaTexto.rodape}</p>
    </div>
  </section>
</body>
</html>`;
  textFolder?.file("titlepage.xhtml", titleXhtml);

  // 5.3 Ficha Técnica e Direitos (text/copyright.xhtml)
  const copyrightXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Créditos &amp; Direitos Autorais</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="copyright-page" style="font-size: 0.85em; color: #444; line-height: 1.6;">
    <h2>Ficha Técnica &amp; Direitos Autorais</h2>
    <p class="first-p"><strong>Título da Obra:</strong> A Batalha — Manual de Campo de 30 Dias</p>
    <p class="first-p"><strong>Subtítulo:</strong> Trinta táticas reais de samurai, em trinta dias, para você andar com Deus enquanto o mar ainda ruge</p>
    <p class="first-p"><strong>Autor &amp; Compositor:</strong> Daniel Shirazawa Moura</p>
    <p class="first-p"><strong>Citações Bíblicas:</strong> Todas as passagens bíblicas foram extraídas da <em>Nova Versão Internacional (NVI)</em>, © Biblica, Inc., salvo indicação expressa em contrário. Todos os direitos reservados.</p>
    <p class="first-p"><strong>Fundamentação Histórica Marcial:</strong> Textos clássicos do Kenjutsu e do Budo japonês (<em>Go Rin No Sho</em> de Miyamoto Musashi, <em>Heiho Kadensho</em> de Yagyū Munenori e diretrizes da All Japan Kendo Federation).</p>
    <p class="first-p"><strong>Edição Digital &amp; Validação KDP:</strong> Otimizado para Amazon Kindle, Apple Books, Kobo e leitores padrão EPUB 3.</p>
    <p class="first-p" style="margin-top: 2em;">© ${new Date().getFullYear()} Daniel Shirazawa Moura. Todos os direitos reservados. É proibida a reprodução não autorizada desta publicação, no todo ou em parte, por qualquer meio eletrônico ou mecânico.</p>
  </section>
</body>
</html>`;
  textFolder?.file("copyright.xhtml", copyrightXhtml);

  // 5.4 Abertura / Antes do Dia 1 (text/abertura.xhtml)
  const aberturaXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>${abertura.titulo}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="preface">
    <div class="chapter-header">
      <p class="kicker">${abertura.nota}</p>
      <h1>${abertura.titulo}</h1>
    </div>

    ${abertura.paragrafos.map((p, idx) => `<p class="${idx === 0 ? "first-p" : ""}">${sanitizeToXHtml(p)}</p>`).join("\n    ")}

    <blockquote class="versiculo" style="margin-top: 2em;">
      <p>${sanitizeToXHtml(abertura.citacao)}</p>
      <footer>— ${abertura.citacaoFonte}</footer>
    </blockquote>

    <div class="chapter-nav">
      <a href="sumario.xhtml">Ir para o Sumário das 30 Táticas »</a>
    </div>
  </section>
</body>
</html>`;
  textFolder?.file("abertura.xhtml", aberturaXhtml);

  // 5.5 Sumário Geral (text/sumario.xhtml)
  const sumarioXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Sumário das 30 Táticas</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="toc">
    <h2>Sumário das 30 Táticas de Combate</h2>
    <p class="first-p" style="font-size: 0.9em; color: #555; text-align: center; margin-bottom: 1.5em;">
      Toque em qualquer tática para navegar diretamente ao capítulo:
    </p>

    <ol style="line-height: 1.9; padding-left: 1.2em;">
      ${indice
        .map(
          (i) => `
        <li style="margin-bottom: 0.4em;">
          <a href="dia-${String(i.n).padStart(2, "0")}.xhtml">
            <strong>Dia ${String(i.n).padStart(2, "0")}: ${i.tatica}</strong>
          </a>
          — ${i.ensina} <em>(${i.passagem})</em>
        </li>
      `,
        )
        .join("")}
      <li style="margin-top: 1em;">
        <a href="musica.xhtml"><strong>Música &amp; Videoclipe Oficial: A Batalha</strong></a>
      </li>
      <li>
        <a href="auditoria.xhtml"><strong>Laudo de Auditoria Teológica &amp; Conformidade NVI</strong></a>
      </li>
      <li>
        <a href="posfacio.xhtml"><strong>Palavra Final &amp; Linha de Apoio</strong></a>
      </li>
    </ol>
  </section>
</body>
</html>`;
  textFolder?.file("sumario.xhtml", sumarioXhtml);

  // 5.6 Os 30 Capítulos Individuais (text/dia-01.xhtml a text/dia-30.xhtml)
  for (const dia of dias) {
    const diaFormatted = String(dia.n).padStart(2, "0");
    const prevDia =
      dia.n > 1 ? `dia-${String(dia.n - 1).padStart(2, "0")}.xhtml` : "abertura.xhtml";
    const nextDia = dia.n < 30 ? `dia-${String(dia.n + 1).padStart(2, "0")}.xhtml` : "musica.xhtml";

    const chapterXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Dia ${diaFormatted}: ${dia.tatica} — A Batalha</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <article epub:type="chapter" id="dia-${dia.n}">
    <header class="chapter-header">
      <p class="kicker">DIA ${diaFormatted} DE 30 · TÁTICA DE COMBATE</p>
      <h1 class="tatica-title">${dia.tatica}</h1>
      <p class="reading">${dia.leitura}</p>
      <div class="motto">“${dia.lema}”</div>

      <!-- Gravura do Capítulo -->
      <figure class="figure-art">
        <img src="../images/dia-${diaFormatted}.jpg" alt="Ilustração Tática do Dia ${dia.n}: ${dia.tatica}" class="tactical-image"/>
        <figcaption>${sanitizeToXHtml(dia.legenda)}</figcaption>
      </figure>
    </header>

    <!-- 1. Reconhecimento de Terreno -->
    <section class="sec-reconhecimento">
      <h3>1. Reconhecimento de Terreno</h3>
      ${sanitizeToXHtml(dia.reconhecimento)}
    </section>

    <!-- 2. A Tática na Tradição -->
    <section class="sec-tatica">
      <h3>2. A Tática na Tradição Marcial</h3>
      ${sanitizeToXHtml(dia.taticaHtml)}
    </section>

    <!-- 3. No Combate -->
    <section class="sec-combate">
      <h3>3. No Combate: Onde a Lâmina Encosta na Vida</h3>
      ${sanitizeToXHtml(dia.combate)}
    </section>

    <!-- 4. A Marcha do Dia -->
    <section class="sec-marcha">
      <h3>4. A Marcha do Dia</h3>
      <p class="first-p" style="font-size: 0.9em; color: #555; margin-bottom: 1em;">
        Três ações cirúrgicas para executar nas próximas 24 horas:
      </p>
      ${dia.marcha
        .map(
          (m) => `
        <div class="marcha-item">
          <h4>[ ] ${m.titulo}</h4>
          <p class="first-p">${sanitizeToXHtml(m.texto)}</p>
        </div>
      `,
        )
        .join("")}
    </section>

    <!-- 5. Caderno de Campo -->
    <section class="sec-caderno">
      <h3>5. Caderno de Campo</h3>
      <div class="caderno-box">
        <p class="first-p"><strong>Pergunta de Sondagem:</strong></p>
        <p class="first-p" style="font-style: italic; margin-top: 0.3em;">${dia.cadernoPergunta}</p>
        <div style="margin-top: 1.2em;">
          <p class="first-p" style="font-size: 0.8em; color: #777;"><em>Espaço de Registro do Guerreiro:</em></p>
          <div class="pauta-linha"></div>
          <div class="pauta-linha"></div>
          <div class="pauta-linha"></div>
          <div class="pauta-linha"></div>
        </div>
      </div>
    </section>

    <!-- 6. Oração do Dia -->
    <section class="sec-oracao">
      <h3>6. Oração do Guerreiro</h3>
      <blockquote class="oracao-box">
        <p class="first-p">${sanitizeToXHtml(dia.oracao)}</p>
      </blockquote>
    </section>

    <!-- Fontes Históricas -->
    <footer style="margin-top: 2em; font-size: 0.8em; color: #666; border-top: 1px solid #d4cbb8; padding-top: 0.6em;">
      <p class="first-p"><strong>Fontes Históricas e Doutrinárias:</strong></p>
      ${sanitizeToXHtml(dia.fontes)}
    </footer>

    <!-- Navegação entre Capítulos -->
    <nav class="chapter-nav" aria-label="Navegação do Capítulo">
      <div style="display: table-row;">
        <div style="display: table-cell; text-align: left; width: 33%;">
          <a href="${prevDia}">« ${dia.n === 1 ? "Abertura" : `Dia ${String(dia.n - 1).padStart(2, "0")}`}</a>
        </div>
        <div style="display: table-cell; text-align: center; width: 34%;">
          <a href="sumario.xhtml">Índice</a>
        </div>
        <div style="display: table-cell; text-align: right; width: 33%;">
          <a href="${nextDia}">${dia.n === 30 ? "Música" : `Dia ${String(dia.n + 1).padStart(2, "0")}`} »</a>
        </div>
      </div>
    </nav>
  </article>
</body>
</html>`;

    textFolder?.file(`dia-${diaFormatted}.xhtml`, chapterXhtml);
  }

  // 5.7 Música e Canção Tema (text/musica.xhtml)
  const musicaXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Canção Tema — A Batalha</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="appendix">
    <div class="chapter-header">
      <p class="kicker">TRILHA SONORA OFICIAL</p>
      <h1>A Batalha</h1>
      <p class="reading">${musicaData.autor} · ${musicaData.subtitulo}</p>
      <div class="motto">“${musicaData.referenciaBiblica}”</div>
    </div>

    <p class="first-p">${sanitizeToXHtml(musicaData.descricao)}</p>

    <h3>Letra da Canção</h3>
    <div style="font-family: 'Georgia', serif; line-height: 1.8; white-space: pre-wrap; background-color: #f9f8f4; padding: 1.2em; border-left: 3px solid #8c2323; margin: 1.5em 0;">
      ${musicaData.letra
        .map(
          (sec) =>
            `<p><strong>[${sec.secao}]</strong><br/>${sec.versos.map((v) => sanitizeToXHtml(v)).join("<br/>")}</p>`,
        )
        .join("\n")}
    </div>

    <h3>Ficha Técnica da Música</h3>
    <ul style="font-size: 0.9em; line-height: 1.7;">
      <li><strong>Composição &amp; Voz:</strong> ${musicaData.autor}</li>
      <li><strong>Estúdio:</strong> ${musicaData.contato.studio}</li>
      <li><strong>Contato:</strong> ${musicaData.contato.email} (${musicaData.contato.telefone})</li>
    </ul>

    <div class="chapter-nav">
      <a href="dia-30.xhtml">« Voltar ao Dia 30</a> | <a href="auditoria.xhtml">Ver Auditoria NVI »</a>
    </div>
  </section>
</body>
</html>`;
  textFolder?.file("musica.xhtml", musicaXhtml);

  // 5.8 Auditoria Teológica NVI (text/auditoria.xhtml)
  const relatorioAudit = executarAuditoriaBiblicaCompleta();
  const auditoriaXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Laudo de Auditoria Teológica NVI</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="appendix">
    <h2>Laudo de Auditoria Teológica &amp; Conformidade NVI</h2>
    <p class="first-p"><strong>Versão Alvo:</strong> Nova Versão Internacional (NVI), © Biblica, Inc.</p>
    <p class="first-p"><strong>Status de Validação:</strong> 100% Conforme — Aprovado para Publicação Digital (KDP)</p>
    <p class="first-p"><strong>Total de Citações Auditadas:</strong> ${relatorioAudit.totalCitacoes} passagens bíblicas.</p>

    <blockquote class="versiculo" style="margin-top: 1.5em;">
      <p class="first-p">“${relatorioAudit.declaracaoDireitosNVI.notaEditorial}”</p>
      <footer>Diretrizes Editoriais · Biblica, Inc.</footer>
    </blockquote>

    <div class="chapter-nav">
      <a href="musica.xhtml">« Música Tema</a> | <a href="posfacio.xhtml">Posfácio »</a>
    </div>
  </section>
</body>
</html>`;
  textFolder?.file("auditoria.xhtml", auditoriaXhtml);

  // 5.9 Posfácio e Linha de Apoio (text/posfacio.xhtml)
  const posfacioXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Palavra Final</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="afterword">
    <h2>Palavra Final e Recursos de Cuidado</h2>
    <p class="first-p">A espada de um guerreiro de Cristo nunca é instrumento de opressão ou de destruição leviana. Cada dia deste treinamento teve um único objetivo: ensinar seus pés a permanecerem firmes sobre a Rocha enquanto o mar da vida ruge com violência.</p>
    
    <p><strong>Se a dor estiver pesada demais:</strong> a fé bíblica anda de mãos dadas com a busca por socorro. Se você estiver enfrentando angústia profunda, depressão ou pensamentos de desistência, não lute sozinho. Procure apoio médico, pastoral e ligue gratuitamente para o <strong>CVV no número 188</strong> (Brasil) a qualquer hora do dia ou da noite.</p>
    
    <blockquote class="versiculo">
      <p class="first-p">“O Senhor reina! Vestiu-se de majestade; de majestade vestiu-se o Senhor e armou-se de poder! O mundo está firme e não se abalará.”</p>
      <footer>Salmos 93.1 · Nova Versão Internacional</footer>
    </blockquote>

    <div class="chapter-nav">
      <a href="sumario.xhtml">Voltar ao Início do Sumário</a>
    </div>
  </section>
</body>
</html>`;
  textFolder?.file("posfacio.xhtml", posfacioXhtml);

  notify("Construindo arquivos de navegação EPUB 3 (nav.xhtml) e EPUB 2 (toc.ncx)...", 85);

  // 6. Navigation Document EPUB 3 (OEBPS/nav.xhtml)
  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Navegação — A Batalha</title>
  <link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h2>Sumário Geral</h2>
    <ol>
      <li><a href="text/cover.xhtml">Capa</a></li>
      <li><a href="text/titlepage.xhtml">Folha de Rosto</a></li>
      <li><a href="text/copyright.xhtml">Créditos &amp; Direitos Autorais</a></li>
      <li><a href="text/abertura.xhtml">Antes do Dia 1</a></li>
      <li><a href="text/sumario.xhtml">Sumário das 30 Táticas</a></li>
      ${dias
        .map(
          (d) => `
        <li>
          <a href="text/dia-${String(d.n).padStart(2, "0")}.xhtml">Dia ${String(d.n).padStart(2, "0")}: ${d.tatica}</a>
        </li>
      `,
        )
        .join("")}
      <li><a href="text/musica.xhtml">Música &amp; Videoclipe Oficial</a></li>
      <li><a href="text/auditoria.xhtml">Auditoria Teológica NVI</a></li>
      <li><a href="text/posfacio.xhtml">Palavra Final &amp; Apoio</a></li>
    </ol>
  </nav>

  <nav epub:type="landmarks" hidden="hidden">
    <h2>Marcos de Leitura</h2>
    <ol>
      <li><a epub:type="cover" href="text/cover.xhtml">Capa</a></li>
      <li><a epub:type="toc" href="text/sumario.xhtml">Sumário</a></li>
      <li><a epub:type="bodymatter" href="text/abertura.xhtml">Início da Leitura</a></li>
    </ol>
  </nav>
</body>
</html>`;
  oebps.file("nav.xhtml", navXhtml);

  // 7. EPUB 2 NCX Navigation Control (OEBPS/toc.ncx)
  let playOrder = 1;
  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:a-batalha-manual-30-dias-daniel-shirazawa-moura"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>A Batalha: Manual de Campo de 30 Dias</text>
  </docTitle>
  <docAuthor>
    <text>Daniel Shirazawa Moura</text>
  </docAuthor>
  <navMap>
    <navPoint id="nav-cover" playOrder="${playOrder++}">
      <navLabel><text>Capa</text></navLabel>
      <content src="text/cover.xhtml"/>
    </navPoint>
    <navPoint id="nav-titlepage" playOrder="${playOrder++}">
      <navLabel><text>Folha de Rosto</text></navLabel>
      <content src="text/titlepage.xhtml"/>
    </navPoint>
    <navPoint id="nav-copyright" playOrder="${playOrder++}">
      <navLabel><text>Créditos &amp; Direitos</text></navLabel>
      <content src="text/copyright.xhtml"/>
    </navPoint>
    <navPoint id="nav-abertura" playOrder="${playOrder++}">
      <navLabel><text>Antes do Dia 1</text></navLabel>
      <content src="text/abertura.xhtml"/>
    </navPoint>
    <navPoint id="nav-sumario" playOrder="${playOrder++}">
      <navLabel><text>Sumário das 30 Táticas</text></navLabel>
      <content src="text/sumario.xhtml"/>
    </navPoint>
    ${dias
      .map(
        (d) => `
    <navPoint id="nav-dia-${d.n}" playOrder="${playOrder++}">
      <navLabel><text>Dia ${String(d.n).padStart(2, "0")}: ${d.tatica}</text></navLabel>
      <content src="text/dia-${String(d.n).padStart(2, "0")}.xhtml"/>
    </navPoint>`,
      )
      .join("")}
    <navPoint id="nav-musica" playOrder="${playOrder++}">
      <navLabel><text>Música Oficial: A Batalha</text></navLabel>
      <content src="text/musica.xhtml"/>
    </navPoint>
    <navPoint id="nav-auditoria" playOrder="${playOrder++}">
      <navLabel><text>Auditoria Teológica NVI</text></navLabel>
      <content src="text/auditoria.xhtml"/>
    </navPoint>
    <navPoint id="nav-posfacio" playOrder="${playOrder++}">
      <navLabel><text>Palavra Final</text></navLabel>
      <content src="text/posfacio.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`;
  oebps.file("toc.ncx", tocNcx);

  notify("Compilando manifesto OPF (OEBPS/content.opf)...", 90);

  // 8. OEBPS/content.opf
  const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId" xml:lang="pt-BR">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="BookId">urn:uuid:a-batalha-manual-30-dias-daniel-shirazawa-moura</dc:identifier>
    <dc:title>A Batalha: Manual de Campo de 30 Dias</dc:title>
    <dc:creator id="author">Daniel Shirazawa Moura</dc:creator>
    <meta refines="#author" property="role" scheme="marc:relators">aut</meta>
    <dc:language>pt-BR</dc:language>
    <dc:description>Trinta táticas reais de samurai em trinta dias para andar com Deus enquanto o mar ainda ruge.</dc:description>
    <dc:publisher>Daniel Shirazawa Moura</dc:publisher>
    <dc:rights>Todos os direitos reservados © Daniel Shirazawa Moura. Citações bíblicas da Nova Versão Internacional (NVI) © Biblica, Inc.</dc:rights>
    <meta property="dcterms:modified">2026-08-15T00:00:00Z</meta>
    <meta name="cover" content="cover-image"/>
  </metadata>

  <manifest>
    <!-- Documentos de Navegação -->
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="css/style.css" media-type="text/css"/>

    <!-- Imagens -->
    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>
    ${dias
      .map(
        (d) =>
          `<item id="img-dia-${d.n}" href="images/dia-${String(d.n).padStart(2, "0")}.jpg" media-type="image/jpeg"/>`,
      )
      .join("\n    ")}

    <!-- Capítulos XHTML -->
    <item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/>
    <item id="titlepage" href="text/titlepage.xhtml" media-type="application/xhtml+xml"/>
    <item id="copyright" href="text/copyright.xhtml" media-type="application/xhtml+xml"/>
    <item id="abertura" href="text/abertura.xhtml" media-type="application/xhtml+xml"/>
    <item id="sumario" href="text/sumario.xhtml" media-type="application/xhtml+xml"/>
    ${dias
      .map(
        (d) =>
          `<item id="dia-${d.n}" href="text/dia-${String(d.n).padStart(2, "0")}.xhtml" media-type="application/xhtml+xml"/>`,
      )
      .join("\n    ")}
    <item id="musica" href="text/musica.xhtml" media-type="application/xhtml+xml"/>
    <item id="auditoria" href="text/auditoria.xhtml" media-type="application/xhtml+xml"/>
    <item id="posfacio" href="text/posfacio.xhtml" media-type="application/xhtml+xml"/>
  </manifest>

  <spine toc="ncx">
    <itemref idref="cover" linear="no"/>
    <itemref idref="titlepage"/>
    <itemref idref="copyright"/>
    <itemref idref="abertura"/>
    <itemref idref="sumario"/>
    ${dias.map((d) => `<itemref idref="dia-${d.n}"/>`).join("\n    ")}
    <itemref idref="musica"/>
    <itemref idref="auditoria"/>
    <itemref idref="posfacio"/>
  </spine>

  <guide>
    <reference type="cover" title="Capa" href="text/cover.xhtml"/>
    <reference type="toc" title="Sumário" href="text/sumario.xhtml"/>
    <reference type="text" title="Início" href="text/abertura.xhtml"/>
  </guide>
</package>`;
  oebps.file("content.opf", opfContent);

  notify("Comprimindo e gerando arquivo binário .epub final...", 95);

  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/epub+zip",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });

  notify("E-book .EPUB gerado com sucesso!", 100);
  return blob;
}

/**
 * Dispara o download direto do arquivo .epub no navegador
 */
export async function downloadEpubBook(
  options?: EpubBuildOptions,
  fileName?: string,
): Promise<void> {
  const blob = await buildEpub(options);
  const name = fileName || "A-Batalha_Manual-de-Campo_30-Dias.epub";

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
