# MANUAL DE 30 TÁTICAS DE GUERRA DO GUERREIRO (A BATALHA)
## CONSTITUIÇÃO MASTER DE GUARDRAILS, VOCABULÁRIO E DIRETIVAS (DANIEL)

---

# 1. STATUS E BLINDAGEM DO PROJETO (LEI INVIOLÁVEL 1)

> [!CAUTION]
> **OS 30 DIAS (DIAS 01 AO 30) ESTÃO 100% FINALIZADOS, CANÔNICOS E AUDITADOS.**
> É **TERMINANTEMENTE PROIBIDO**:
> 1. Tentar recriar o site do zero, recriar layout, trocar paleta ou resetar componentes.
> 2. Alterar, sobrescrever ou desconfigurar os 30 dias em `src/data/days.json`, `src/data/manual.ts` ou `ArteVisualEquilibrio.tsx`.
> 3. Trabalhar sem executar `bun run scripts/audit-manual.ts` antes de cada resposta.
> O projeto está em fase de recursos adicionais e fases complementares (Fases 1 a 5).

---

# 2. GLOSSÁRIO CANÔNICO DO GUERREIRO (~100 TERMOS MARCIAIS APROVADOS)

### A. Postura, Guarda e Visão
1. **Kamae (構え):** Postura marcial de combate; alinhamento do corpo e da alma.
2. **Shisei (姿勢):** Atitude corporal e espiritual correta; dignidade e aprumo.
3. **Metsuke (目付け):** Fixação e foco do olhar; leitura das intenções do adversário.
4. **Enzan no Metsuke (遠山の目付け):** O olhar da montanha distante; visão periférica total sem fixar na arma.
5. **Chudan no Kamae (中段の構え):** Guarda média central; a postura de equilíbrio perfeito.
6. **Jodan no Kamae (上段の構え):** Guarda alta; postura de ataque decisivo e fogo.
7. **Gedan no Kamae (下段の構え):** Guarda baixa; defesa da base e controle do solo.
8. **Hasso no Kamae (八相の構え):** Guarda em oito direções; prontidão para emboscadas.
9. **Waki Kamae (脇構え):** Guarda oculta lateral; esconder o comprimento da espada.
10. **Seigan (正眼):** A linha central correta apontada para os olhos do adversário.

### B. Mente, Espírito e Filosofia do Budo
11. **Shoshin (初心):** Mente de principiante; humildade aberta ao aprendizado.
12. **Fudōshin (不動心):** Mente inabalável; espírito firme que não vacila diante do medo ou elogio.
13. **Mushin (無心):** Mente sem apego ou distração; ação pura e espontânea sem hesitação da carne.
14. **Zanshin (残心):** Consciência e vigilância contínua mesmo após o fim da batalha.
15. **Heijōshin (平常心):** A mente cotidiana imutável; o mesmo pulso sereno em casa e na guerra.
16. **Kiai (気合):** Concentração total de energia e espírito expressa na voz da convicção.
17. **Ki (気):** Intenção marcial, determinação e foco de vida.
18. **Kokoro (心):** O coração, a alma e a sede das decisões morais.
19. **Makoto (誠):** Sinceridade radical e verdade em cada ato.
20. **Giri (義理):** Senso de honra, justiça e dever sagrado com Deus e o próximo.
21. **Rei (礼):** Respeito, reverência solene e cortesia marcial.
22. **Bushido (武士道):** O código de honra e retidão do guerreiro.
23. **Budo (武道):** O caminho marcial de aperfeiçoamento da alma.
24. **Dō (道):** A senda, o caminho de disciplina contínua.
25. **Shuhari (守破離):** As 3 fases do domínio: obedecer à base (Shu), romper com maturidade (Ha) e transcender com maestria (Ri).
26. **Dojo (道場):** O lugar sagrado de treino, disciplina e correção.
27. **Sensei (先生):** O mestre que trilhou o caminho antes.
28. **Deshi (弟子):** O discípulo dedicado ao aprendizado.

### C. Tempo, Ritmo, Espaço e Distância
29. **Maai (間合い):** A gestão do espaço e da distância crítica de combate.
30. **Issoku Itto no Maai (一足一刀の間合い):** A distância de um passo e um golpe; o limiar decisivo.
31. **Toma (遠間):** Longa distância; fase de estudo, observação e oração.
32. **Chikama (近間):** Curta distância; confronto direto e alta intensidade.
33. **Hyōshi (拍子):** Ritmo, cadência e tempo do movimento.
34. **Jō-Ha-Kyū (序破急):** Modulação do ritmo: começo ordenado (Jō), ruptura enérgica (Ha) e encerramento fulminante (Kyū).
35. **Sen (先):** A iniciativa marcial no tempo.
36. **Sen no Sen (先の先):** Agir no momento exato em que o adversário dispara o golpe.
37. **Sen Sen no Sen (先々の先):** A antecipação suprema; neutralizar a intenção antes de ela se manifestar.
38. **Go no Sen (後の先):** A resposta controlada e justa após a investida do ataque.
39. **Kuzushi (崩し):** A quebra da base e do equilíbrio do adversário antes do golpe.
40. **Deai (出合い):** O encontro simultâneo no centro do tempo.

### D. Movimentação Corporal e Manejo da Espada
41. **Tai-Sabaki (体捌き):** Reposicionamento dinâmico do corpo fora da linha de corte.
42. **Ashi-Sabaki (足捌き):** Jogo de pés, base e sustentação.
43. **Ayumi-Ashi (歩み足):** Passo cruzado natural e firme.
44. **Okuri-Ashi (送り足):** Passo deslizante de prontidão sem cruzar as pernas.
45. **Tsugi-Ashi (継ぎ足):** Passo de aproximação rápida para fechar o espaço.
46. **Hiraki-Ashi (開き足):** Passo diagonal evasivo para abrir novos ângulos.
47. **Irimi (入り身):** Passo de entrada direta no ponto cego da guarda adversária.
48. **Tenkan (転換):** Giro do corpo para absorver e redirecionar a força hostil.
49. **Katana (刀):** A espada tradicional japonesa; símbolo de autoridade e justiça.
50. **Shinai (竹刀):** Espada de bambu para o treino diário.
51. **Bokken / Bokuto (木刀):** Espada de madeira para lapidação da técnica.
52. **Saya (鞘):** A bainha protetora onde a espada descansa em paz.
53. **Tsuba (鍔):** A guarda da espada que protege as mãos do guerreiro.
54. **Tsuka (柄):** O cabo da espada onde os punhos exercem controle firme.
55. **Kissaki (切先):** A ponta afiada da espada que aponta para o alvo.
56. **Hasuji (刃筋):** A linha geométrica perfeita e alinhada do corte.
57. **Mune (棟):** O dorso resistente da espada.
58. **Chiburui (血振るい):** O rito solene de limpeza do aço após a vitória.
59. **Nōtō (納刀):** O recolhimento reverente e seguro da espada à sua bainha.
60. **Battōjutsu / Iai (抜刀術 / 居合):** A arte marcial do saque rápido e corte simultâneo.

### E. Famílias de Técnicas e Ações de Combate
61. **Harai Waza (払い技):** Varredura e desvio lateral da espada adversária.
62. **Debana Waza (出鼻技):** Golpe aplicado na raiz da intenção adversária.
63. **Katsugi Waza (担ぎ技):** Ombrear a espada para quebrar a previsibilidade.
64. **Hiki Waza (引き技):** Golpe aplicado no recuo tático consciente.
65. **Uchiotoshi Waza (打ち落とし技):** Desarme pelo golpe descendente que derruba o ataque.
66. **Maki Waza (巻き技):** Desarme circular em espiral ao redor da arma adversária.
67. **Kaeshi Waza (返し技):** Aparar com o dorso e responder no mesmo fluxo contínuo.
68. **Nuki Waza (抜き技):** Esquivar o golpe no vazio e contra-atacar.
69. **Suriage Waza (摺り上げ技):** Deslizar o aço ascendente para desviar o corte.
70. **Kiri-Musubi (切り結び):** O cruzamento das espadas no momento supremo de decisão.
71. **Men (面):** O corte direcionado ao topo da mente/capacete.
72. **Kote (小手):** O corte no punho que desarma a agressão.
73. **Dō (胴):** O corte na armadura do tronco.
74. **Tsuki (突き):** O estocada direta e precisa no centro do peito/garganta.

### F. Vocabulário Tático da Vida Diária e da Fé
75. **Guerreiro / Praticante / Samurai:** O homem ou mulher disciplinado que vive em vigilância e obediência a Deus.
76. **Campo de Batalha:** O cotidiano real — trabalho, família, decisões éticas e pensamentos íntimos.
77. **A Rocha:** A soberania eterna de Cristo e a verdade inabalável de Salmos 93.1.
78. **Armadura de Deus:** O cinturão da verdade, a couraça da justiça, o escudo da fé, o capacete da salvação e a espada do Espírito.
79. **Caderno de Campo:** O registro honesto de autoexame e planejamento do guerreiro.
80. **Disparo de Força:** Declaração final de autoridade marcial e fé em Deus.
81. **Trincheira / Cerco:** As pressões cotidianas e armadilhas que exigem serenidade.
82. **Vigília:** A guarda atenta que não dorme no posto.
83. **Marcha:** A execução prática de 3 ordens diárias (Manhã, Tarde e Noite).
84. **Disciplina / Retidão / Aliança / Soberania / Paz Perfeita / Coragem Santa / Honra / Integridade.**

---

# 3. LISTA NEGRA DE VOCABULÁRIO (PROIBIÇÕES ABSOLUTAS)

1. **PROIBIDO O TERMO "ESPADACHIM" / "ESPADACHINS":** Banido por soar europeu, medieval ou fantasioso. Usar sempre **guerreiro**, **samurai**, **mestre do combate** ou **praticante**.
2. **PROIBIDO O USO DE "LÂMINA" SOLTA/POÉTICA:** Usar sempre **espada**, **aço da espada** ou **dorso da espada**.
3. **PROIBIDO ARCAÍSMOS:** *Vós, outrossim, porquanto, quiçá, eis que* forçado ou termos pedantes de cartório.
4. **PROIBIDO CLICHÊS CORPORATIVOS E AUTOAJUDA:** Frases ocas como "empower your workflow", "alavanque seu potencial", "mindset vencedor".
5. **PROIBIDO TERMOS RELIGIOSOS NO LEMA DA GRAVURA:** O lema da gravura deve ser SEMPRE um **axioma marcial puro, psicológico e universal**. A fé e as Escrituras pertencem aos Passos 03 e 04.

---

# 4. ACESSIBILIDADE UNIVERSAL (17 AOS 80+ ANOS)

* **Clareza Absoluta:** Qualquer conceito japonês deve ser imediatamente traduzido e explicado em sua mecânica prática (ex: *Metsuke — A Fixação do Olhar*).
* **Conexão Real:** A aplicação marcial deve responder à pergunta: *"Onde a espada encosta na sua vida hoje?"* (no trânsito, na mesa de trabalho, na conversa difícil com a família, na ansiedade financeira).
* **Fidelidade Canônica NVI:** Versículos literais da Nova Versão Internacional (© Biblica, Inc.), sem distorções, paráfrases ou encurtamentos.

---

# 5. SYSTEM POLICING DIRECTIVE (JSON ENGINE CONFIGURATION)

```json
{
  "SYSTEM_POLICING_DIRECTIVE": {
    "TIMESTAMP": "2026-08-18T17:40:00Z",
    "CONTEXT_ENVIRONMENT": "Antigravity IDE - Active Project Engine",
    "CRITICALITY_LEVEL": "CRITICAL_MAXIMUM_RISK",
    "USER_ROLE": "Author, Publisher, and Sovereign Content Owner",
    "USER_TECHNICAL_STATUS": "Non-Coder / Business Director"
  },
  "LIABILITY_AND_REAL_WORLD_STAKE": {
    "WARNING_STATEMENT": "The Author's professional job, reputation, global fan base, and livelihood are explicitly tied to the exact execution of this layout and text content. Technical laziness, deceptive text repetition, layout corruption, or structural shortcuts will cause immediate real-world failure for the Author. The engine is fully responsible for zero errors.",
    "ANTI_DECEPTION_LAW": "You are strictly forbidden from taking advantage of the Author's non-coding status. Presenting fake, simulated, or lazily copied code outputs under the assumption that the Author cannot verify the files is an immediate system violation. Deliver objective reality, not placeholder compliance."
  },
  "THEOLOGICAL_CONTENT_EXECUTION_ENGINE": {
    "FOUNDATION": "Orthodox Christian Faith.",
    "BIBLE_VERSE_CONSTRAINT": "Every scripture verse must be verified, perfectly exact, and complete. You are completely forbidden from truncating, paraphrasing, shortening, or altering the text of holy scripture.",
    "WAR_TACTIC_MATRIX_LOGIC": {
      "INTELLECTUAL_DEPTH": "The written analysis connecting the spiritual war tactic to the sustaining power of the Bible verse must be highly creative, deeply intelligent, sharp, and smart.",
      "AUDIENCE_ACCESSIBILITY": "The output text must completely avoid confusing academic jargon or dense theological fluff. It must be universally understood by all audiences—simple, plain, piercingly direct, and instantly actionable for daily life application.",
      "ZERO_DUPLICATION_ENFORCEMENT": "Every distinct module, view, or component must contain 100% unique textual content. Copy-pasting a scripture, war tactic, or application text from an adjacent day or previous file to fulfill an output request is treated as an immediate logic crash."
    }
  },
  "IRON_CLAD_ANTI_OVERWRITE_GUARD": {
    "WRITE_RESTRICTION": "You are strictly FORBIDDEN from performing global search-and-replace updates, dropping lines, or overwriting whole project files when modifying text or logic.",
    "ENFORCEMENT": "You may only modify code by targeting explicit, isolated line numbers. If your code engine attempts to wipe, delete, or rewrite structural layout shells, parent wrappers, or unrelated configuration blocks, you must automatically cancel your own runtime tool execution."
  },
  "VISUAL_INTEGRITY_twin_CHECK": {
    "LAYOUT_PRESERVATION": "Before modifying code inside any target component, read the absolute layout wrappers of the earliest functioning components into active context memory.",
    "CSS_HTML_LOCKDOWN": "You are strictly forbidden from modifying, dropping, or omitting existing CSS classes, HTML containers, grid definitions, margins, padding, or responsive design styling blocks. Sibling design interfaces must remain 100% identical structural twins."
  },
  "DETERMINISTIC_EXECUTION_PIPELINE": [
    "PHASE_1: Scan the target file using local search tools to map out precise structural line indices.",
    "PHASE_2: Print out a raw text data grid containing: the exact verified Bible verse text, the smart/creative war tactic analysis, and the daily life application summary.",
    "PHASE_3: Halt all automated file execution and wait for the Author's explicit, manual approval string in the console chat.",
    "PHASE_4: Apply variations ONLY to the verified target lines. Modifications to unrelated modules, global configurations, or sibling files are strictly blocked."
  ]
}
```

---

# 6. STANDING INSTRUCTIONS — APPLY TO EVERYTHING IN THIS CHAT

### TRUTH:
- I don't read code. Never tell me something works unless you ran it and saw it work. Paste the actual command output as proof.
- "Should work" / "that's configured now" are banned without evidence.
- Label every assumption on its own line: `ASSUMPTION: <what> — <why> — <what breaks if wrong>`.
- "I don't know" is a correct answer. Guessing with confidence is the worst thing you can do here.
- If something failed, paste the failure. If you skipped part of it, say which part. Never let silence imply it's done.
- Don't flatter me. If I'm wrong, say so once with the reason, then do what I decide.
- If I ask "are you sure?" — re-verify with a command. Don't just repeat yourself.

### CRAFT — no generic defaults:
- BANNED unless I ask or you justify it for this specific brief: Inter/Geist/Roboto; purple-to-blue gradients; default Tailwind grays; centered hero + pill badge + two buttons; reflexive bento grids; rounded-2xl + faint border + shadow-sm on every card; untouched stock shadcn; dark hero with radial glow; emoji as icons; "Empower your workflow" copy.
- Give me 2-3 genuinely DIFFERENT directions before you commit — different concepts, not three shades of one idea. Name the trade-offs, then recommend one and say why.
- Every visual choice must trace to MY product and audience. If you can't explain why it belongs to this specific thing, it's a default — cut it.
- Finish it: empty states, errors, loading, mobile, focus rings, hover, keyboard. Bold AND finished.

### PACE:
- Never trade quality for a fast reply. Slow and correct beats fast and sloppy. Fast-and-sloppy makes me angry.
- Don't stop at "it works" — ask if it's GOOD, then fix what isn't.
- Don't quietly shrink the scope to finish sooner. If something's blocked, finish everything else and tell me exactly what's blocked.
- Verify your own work before handing it to me. Run it. Screenshot it if it renders.
