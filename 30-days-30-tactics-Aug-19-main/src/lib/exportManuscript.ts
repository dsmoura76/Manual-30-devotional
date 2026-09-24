import { dias, capaTexto, abertura, indice, arte as defaultArte } from "@/data/manual";

export function generateEpubHtml(customArtsMap?: Record<number, string>): string {
  const getArtSrc = (n: number) => {
    if (customArtsMap && customArtsMap[n]) {
      return customArtsMap[n];
    }
    return defaultArte[n] || defaultArte[1];
  };

  const chaptersHtml = dias
    .map(
      (d) => `
    <article id="dia-${d.n}" class="chapter">
      <header class="chapter-header">
        <p class="chapter-kicker">DIA ${String(d.n).padStart(2, "0")} DE 30 · TÁTICA DE COMBATE</p>
        <h2 class="chapter-title">${d.tatica}</h2>
        <p class="chapter-reading">${d.leitura}</p>
        <blockquote class="chapter-motto">“${d.lema}”</blockquote>
        
        <!-- Gravura Ilustrativa do Capítulo -->
        <figure class="chapter-illustration">
          <img src="${getArtSrc(d.n)}" alt="Ilustração Tática do Dia ${d.n} - ${d.tatica}" class="tactical-art" />
          <figcaption class="chapter-caption">${d.legenda}</figcaption>
        </figure>
      </header>

      <section class="sec-reconhecimento">
        <h3>1. Reconhecimento de Terreno</h3>
        <div class="prose">${d.reconhecimento}</div>
      </section>

      <section class="sec-tatica">
        <h3>2. A Tática na Tradição</h3>
        <div class="prose">${d.taticaHtml}</div>
      </section>

      <section class="sec-combate">
        <h3>3. No Combate: Onde a Lâmina Encosta na Vida</h3>
        <div class="prose">${d.combate}</div>
      </section>

      <section class="sec-marcha">
        <h3>4. A Marcha do Dia</h3>
        ${d.marcha
          .map(
            (m) => `
          <div class="march-item">
            <h4>[ ] ${m.titulo}</h4>
            <p>${m.texto}</p>
          </div>
        `,
          )
          .join("")}
      </section>

      <section class="sec-caderno">
        <h3>5. Caderno de Campo</h3>
        <p class="journal-prompt"><strong>Pergunta de Sondagem:</strong> ${d.cadernoPergunta}</p>
        <div class="journal-lines">
          <p><em>Espaço para reflexão e anotação pessoal:</em></p>
          <div class="line">______________________________________________________________________</div>
          <div class="line">______________________________________________________________________</div>
          <div class="line">______________________________________________________________________</div>
          <div class="line">______________________________________________________________________</div>
        </div>
      </section>

      <section class="sec-oracao">
        <h3>6. Oração do Guerreiro</h3>
        <blockquote class="prayer-box">
          <p>${d.oracao}</p>
        </blockquote>
      </section>

      <footer class="sec-fontes">
        <hr/>
        <small><strong>Fontes Históricas e Doutrinárias:</strong></small>
        <div class="prose-small">${d.fontes}</div>
      </footer>
    </article>
  `,
    )
    .join('\n<hr class="pagebreak"/>\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>${capaTexto.titulo} — ${capaTexto.subtitulo}</title>
  <meta name="author" content="Daniel Shirazawa Moura"/>
  <meta name="description" content="Trinta táticas reais de samurai em trinta dias para andar com Deus enquanto o mar ainda ruge."/>
  <style>
    @charset "utf-8";
    body {
      font-family: "Georgia", "Times New Roman", serif;
      line-height: 1.65;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 5%;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: "Helvetica Neue", "Arial", sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #111111;
      margin-top: 1.8em;
      margin-bottom: 0.6em;
    }
    h1 { font-size: 2.2em; text-align: center; margin-top: 2em; line-height: 1.1; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #cccccc; padding-bottom: 0.3em; }
    h3 { font-size: 1.15em; color: #8c2323; margin-top: 1.4em; }
    h4 { font-size: 1em; color: #333333; margin-bottom: 0.2em; }
    p { margin: 0 0 1em 0; text-align: justify; }
    blockquote {
      margin: 1.2em 0;
      padding: 0.8em 1.2em;
      border-left: 4px solid #8c2323;
      background-color: #f7f6f2;
      font-style: italic;
    }
    .chapter { page-break-before: always; }
    .chapter-kicker { font-size: 0.8em; letter-spacing: 0.15em; color: #666; text-align: center; }
    .chapter-title { text-align: center; font-size: 1.8em; margin-top: 0.2em; border: none; }
    .chapter-reading { text-align: center; font-style: italic; color: #555; margin-bottom: 0.8em; }
    .chapter-motto { font-size: 1.1em; text-align: center; font-weight: bold; }
    .chapter-illustration { text-align: center; margin: 1.5em auto 2em; max-width: 500px; }
    .tactical-art { max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .chapter-caption { font-size: 0.85em; text-align: center; color: #666; margin-top: 0.6em; font-style: italic; }
    .march-item { margin-bottom: 1em; padding-left: 0.5em; border-left: 2px solid #ddd; }
    .journal-prompt { background: #faf9f6; padding: 0.8em; border: 1px dashed #ccc; }
    .journal-lines .line { color: #aaa; margin: 0.6em 0; font-family: monospace; }
    .prayer-box { background: #fdfbf7; border-left: 4px solid #1f3a52; }
    .pagebreak { page-break-before: always; margin: 3em 0; border: none; }
    .toc-item { margin-bottom: 0.4em; }
  </style>
</head>
<body>

  <!-- CAPA E FRONT MATTER -->
  <section id="cover" style="text-align: center; padding: 4em 0;">
    <p style="letter-spacing: 0.2em; color: #8c2323; font-size: 0.9em;">DIÁRIO DEVOCIONAL DE 30 DIAS</p>
    <h1 style="font-size: 3em; margin: 0.3em 0;">${capaTexto.titulo}</h1>
    <p style="font-size: 1.2em; max-width: 600px; margin: 1em auto; line-height: 1.4;">${capaTexto.subtitulo}</p>
    <p style="font-size: 0.9em; color: #555; margin-top: 2em;">${capaTexto.referencia}</p>
    <p style="font-size: 1.1em; font-weight: bold; margin-top: 3em;">DANIEL SHIRAZAWA MOURA</p>
  </section>

  <hr class="pagebreak"/>

  <!-- CRÉDITOS E DIREITOS AUTORAIS -->
  <section id="copyright" style="font-size: 0.85em; color: #444; padding: 2em 0;">
    <h2>Ficha Técnica & Direitos Autorais</h2>
    <p><strong>A Batalha: Manual de Campo de 30 Dias</strong></p>
    <p><strong>Autor:</strong> Daniel Shirazawa Moura</p>
    <p><strong>Inspiração:</strong> Baseado na canção <em>"A Batalha"</em>, composta por Daniel Shirazawa Moura.</p>
    <p><strong>Textos Bíblicos:</strong> Citações bíblicas extraídas da Nova Versão Internacional (NVI) © Biblica, Inc. Todos os direitos reservados.</p>
    <p><strong>Pesquisa Marcial:</strong> Fundamentada em manuais históricos de artes marciais japonesas (<em>Go Rin No Sho</em> de Miyamoto Musashi, <em>Heiho Kadensho</em> de Yagyū Munenori, tratados da All Japan Kendo Federation e linhagens clássicas Koryū).</p>
    <p>Todos os direitos reservados. Proibida a reprodução não autorizada desta obra.</p>
  </section>

  <hr class="pagebreak"/>

  <!-- PREFÁCIO / INTRODUÇÃO -->
  <section id="prefacio">
    <h2>${abertura.titulo}</h2>
    <p style="font-size: 0.85em; color: #777; letter-spacing: 0.1em;">${abertura.nota}</p>
    ${abertura.paragrafos.map((p) => `<p>${p}</p>`).join("")}
    <blockquote>
      <p>${abertura.citacao}</p>
      <footer>— ${abertura.citacaoFonte}</footer>
    </blockquote>
  </section>

  <hr class="pagebreak"/>

  <!-- SUMÁRIO -->
  <section id="sumario">
    <h2>Sumário das 30 Táticas</h2>
    <ol style="line-height: 1.8;">
      ${indice
        .map(
          (i) => `
        <li class="toc-item">
          <strong>Dia ${String(i.n).padStart(2, "0")}: ${i.tatica}</strong> — ${i.ensina} <em>(${i.passagem})</em>
        </li>
      `,
        )
        .join("")}
    </ol>
  </section>

  <hr class="pagebreak"/>

  <!-- OS 30 CAPÍTULOS COM ILUSTRAÇÕES -->
  ${chaptersHtml}

  <hr class="pagebreak"/>

  <!-- POSFÁCIO E APOIO -->
  <section id="posfacio">
    <h2>Palavra Final e Recursos de Cuidado</h2>
    <p>A espada de um guerreiro de Cristo nunca é instrumento de opressão ou de destruição leviana. Cada dia deste treinamento teve um único objetivo: ensinar seus pés a permanecerem firmes sobre a Rocha enquanto o mar da vida ruge com violência.</p>
    <p><strong>Se a dor estiver pesada demais:</strong> a fé bíblica anda de mãos dadas com a busca por socorro. Se você estiver enfrentando angústia profunda, depressão ou pensamentos de desistência, não lute sozinho. Procure apoio médico, pastoral e ligue gratuitamente para o <strong>CVV no número 188</strong> (Brasil) a qualquer hora do dia ou da noite.</p>
    <blockquote>
      <p>“O Senhor reina! Vestiu-se de majestade; de majestade vestiu-se o Senhor e armou-se de poder! O mundo está firme e não se abalará.”</p>
      <footer>Salmos 93.1 · Nova Versão Internacional</footer>
    </blockquote>
  </section>

</body>
</html>`;
}

export function generatePublisherPitch(): string {
  return `# PROPOSTA EDITORIAL & DOSSIÊ COMERCIAL

## 1. DADOS DA OBRA
- **Título:** A Batalha: Manual de Campo de 30 Dias
- **Subtítulo:** Trinta táticas reais de samurai, em trinta dias, para você andar com Deus enquanto o mar ainda ruge
- **Autor:** Daniel Shirazawa Moura
- **Gênero:** Devocional / Espiritualidade Cristã / Formação Masculina e Liderança / Autodisciplina
- **Público-Alvo:** Homens cristãos, jovens adultos, líderes, leitores de C.S. Lewis, John Eldredge e praticantes de artes marciais que buscam profundidade teológica sem pieguice.
- **Formato Sugerido para Impressão:** 16 x 23 cm (ou padrão KDP 6" x 9")
- **Páginas Estimadas:** 160 a 190 páginas
- **Acabamento Recomendado:** Capa em cartão 250g fosco com reserva de verniz UV no círculo do sol; Miolo em papel Pólen Soft 80g (leitura suave e elegante).

---

## 2. SINOPSE COMERCIAL
No mercado editorial cristão contemporâneo, a maioria dos devocionais diários repete fórmulas rasas de autoajuda sentimental. *A Batalha* rompe esse paradigma ao resgatar a disciplina marcial histórica dos samurais japoneses — despida de misticismos e rigorosamente alinhada com as Escrituras Sagradas.

Cada um dos 30 dias entrega:
1. **Reconhecimento de Terreno:** Identificação cirúrgica de um conflito real cotidiano (ansiedade, ira, pressões, ciladas morais, paralisia).
2. **A Tática:** Explicação técnica e histórica de um princípio real de combate com a espada japonesa (Kamae, Metsuke, Maai, Zanshin, Kiri-otoshi, Sen no Sen, Heijōshin, etc.).
3. **No Combate:** Ligação profunda com textos bíblicos (NVI) e aplicação imediata na vida do leitor, acompanhada de salvaguarda pastoral ("E o chão").
4. **A Marcha do Dia:** Três ações práticas distribuídas em Manhã, Tarde e Noite para execução tangível.
5. **Caderno de Campo & Oração:** Perguntas de autoexame, espaço pautado para escrita reflexiva e oração do guerreiro.
6. **Ilustrações de Alta Definição:** Gravuras de samurai e síntese de lâmina na rocha integradas a cada capítulo.

---

## 3. DIFERENCIAIS COMPETITIVOS
- **Conexão Cultural e Teológica Única:** Fusão inédita entre o rigor do Budo clássico japonês e a soberania de Deus proclamada em Salmos 93.
- **Pesquisa Histórica Verificada:** Diferente de obras que usam "samurai" como mero apelo visual, todas as 30 táticas possuem fontes primárias e secundárias documentadas (Miyamoto Musashi, Yagyū Munenori, All Japan Kendo Federation, escolas Koryū).
- **Interatividade & Produto Híbrido:** O livro físico conecta-se diretamente à plataforma interativa digital com caderno de notas, personalização de ilustrações e progresso diário.
- **Linguagem Direta e Viril:** Escrita em tom firme, sóbrio e compassivo, sem concessões à superficialidade.

---

## 4. ESTRUTURA DOS 30 DIAS
- **Semana 1 (Dias 01 a 07) — A Base e a Postura:** Kamae, Metsuke, Maai, Zanshin, Shisei, Munen Musō, Kiai.
- **Semana 2 (Dias 08 a 14) — O Movimento e a Decisão:** Seme, Harai Waza, Nuki Waza, Suriage Waza, Kiri-Kaeshi, Kiri-otoshi, Debana Waza.
- **Semana 3 (Dias 15 a 21) — A Linha de Contato e a Resposta:** Okuri-Ashi, Kaeshi Waza, Uchiotoshi Waza, Hiki Waza, Katsugi Waza, Sen no Sen, Go no Sen.
- **Semana 4 e Conclusão (Dias 22 a 30) — Maestria, Serenidade e Retorno:** Sen Sen no Sen, Kuzushi, Tai-Sabaki, Jō-Ha-Kyū, Maki Waza, Irimi, Heijōshin, Kiri-Musubi, Chiburui.

---

## 5. SOBRE O AUTOR
**Daniel Shirazawa Moura** é compositor, escritor e pesquisador. Autor da canção *A Batalha*, desenvolveu esta obra a partir de anos de estudo das tradições marciais do Japão feudal e de profunda dedicação à teologia bíblica reformada.

---
© ${new Date().getFullYear()} Daniel Shirazawa Moura. Todos os direitos reservados.
`;
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
