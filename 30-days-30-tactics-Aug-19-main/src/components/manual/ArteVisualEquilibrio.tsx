import React, { useState, useRef } from "react";
import {
  BookOpen,
  Shield,
  Sparkles,
  ScrollText,
  Check,
  Copy,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Edit3,
} from "lucide-react";
import type { Dia } from "@/data/manual";
import { useCustomArt } from "@/context/CustomArtContext";

interface ArteVisualEquilibrioProps {
  dia: Dia;
}

// Extrai versículos e referências do HTML da tática para exibição na placa bíblica
function extrairVersiculos(taticaHtml: string) {
  const versiculos: { texto: string; referencia: string }[] = [];
  const regex =
    /<figure class="versiculo">\s*<p>(.*?)<\/p>\s*<footer>(.*?)<\/footer>\s*<\/figure>/gs;
  let match;
  while ((match = regex.exec(taticaHtml)) !== null) {
    const textoLimpo = (match[1] || "").replace(/<\/?[^>]+(>|$)/g, "").trim();
    const refLimpa = (match[2] || "").replace(/<\/?[^>]+(>|$)/g, "").trim();
    versiculos.push({ texto: textoLimpo, referencia: refLimpa });
  }
  return versiculos;
}

export function obterVersiculoDia(diaNum: number, taticaHtml: string) {
  const versiculos = extrairVersiculos(taticaHtml);
  return (
    versiculos[0] || {
      texto: "O Senhor reina! O mundo está firme e não se abalará.",
      referencia: "Salmos 93.1 · NVI",
    }
  );
}

export function ArteVisualEquilibrio({ dia }: ArteVisualEquilibrioProps) {
  const [modoVisual, setModoVisual] = useState<"arte" | "escritura">("arte");
  const [copiado, setCopiado] = useState(false);
  const [painelTroca, setPainelTroca] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getArt, setArt, resetArt, customArts } = useCustomArt();
  const currentArtSrc = getArt(dia.n);
  const isCustomArt = Boolean((customArts as Record<number, string>)[dia.n]);

  const versiculos = extrairVersiculos(dia.taticaHtml);
  const versiculoPrincipal = versiculos[0] || {
    texto: "O Senhor reina! O mundo está firme e não se abalará.",
    referencia: "Salmos 93.1 · NVI",
  };

  const [salvando, setSalvando] = useState(false);

  const handleCopiarVersiculo = () => {
    navigator.clipboard.writeText(
      `"${versiculoPrincipal.texto}" — ${versiculoPrincipal.referencia} (A Batalha · Dia ${dia.n}: ${dia.tatica})`,
    );
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSalvando(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          try {
            await setArt(dia.n, result);
          } finally {
            setSalvando(false);
            setPainelTroca(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setSalvando(true);
      try {
        await setArt(dia.n, urlInput.trim());
        setUrlInput("");
      } finally {
        setSalvando(false);
        setPainelTroca(false);
      }
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-rule-strong bg-panel/60 shadow-sm">
      {/* Barra de Equilíbrio: Tática x Escritura */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule bg-paper-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-bold text-brand">
            {String(dia.n).padStart(2, "0")}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-ink uppercase tracking-wider">{dia.tatica}</span>
            <span className="text-ink-3">×</span>
            <span className="font-serif italic text-accent">{versiculoPrincipal.referencia}</span>
            {isCustomArt && (
              <span className="rounded bg-accent/15 px-1.5 py-0.2 font-mono text-[0.65rem] text-accent font-semibold">
                Arte Personalizada
              </span>
            )}
          </div>
        </div>

        {/* Controles de Modo e Troca de Arte */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPainelTroca(!painelTroca)}
            title="Trocar ou enviar imagem customizada para este dia"
            className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-1 text-xs font-medium text-ink-2 hover:border-brand hover:text-ink transition-colors cursor-pointer"
          >
            <Edit3 className="size-3.5 text-brand" />
            <span>Mudar Arte</span>
          </button>

          {/* Alternador de Modo de Visualização */}
          <div className="flex items-center rounded-lg border border-rule bg-paper p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setModoVisual("arte")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all cursor-pointer ${
                modoVisual === "arte"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Shield className="size-3.5" />
              <span>Gravura & Tática</span>
            </button>
            <button
              type="button"
              onClick={() => setModoVisual("escritura")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all cursor-pointer ${
                modoVisual === "escritura"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>Iluminação da Palavra</span>
            </button>
          </div>
        </div>
      </div>

      {/* Painel expansível para Mudar Imagem do Dia */}
      {painelTroca && (
        <div className="border-b border-rule bg-field/90 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-4 text-brand" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                Personalizar Arte do Dia {String(dia.n).padStart(2, "0")} ({dia.tatica})
              </h4>
            </div>
            {isCustomArt && (
              <button
                type="button"
                onClick={() => {
                  resetArt(dia.n);
                  setPainelTroca(false);
                }}
                className="flex items-center gap-1 text-xs text-brand hover:underline font-mono"
              >
                <RotateCcw className="size-3" />
                <span>Restaurar Arte Original</span>
              </button>
            )}
          </div>
          <p className="text-xs text-ink-2 mb-4 leading-relaxed">
            Você pode fazer upload de uma imagem do seu computador ou colar o link de uma imagem da
            web. A arte será exibida no leitor e incluída na exportação em PDF e formato KDP.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Opção 1: Upload de Arquivo */}
            <div className="rounded-lg border border-rule bg-paper p-3 text-center">
              <p className="text-xs font-semibold text-ink mb-2">Carregar arquivo local</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded border border-rule-strong bg-paper-2 py-2 text-xs font-medium text-ink hover:bg-field cursor-pointer"
              >
                <Upload className="size-3.5 text-accent" />
                <span>Escolher Imagem (JPG, PNG, WebP)</span>
              </button>
            </div>

            {/* Opção 2: URL Direta */}
            <form onSubmit={handleUrlSubmit} className="rounded-lg border border-rule bg-paper p-3">
              <p className="text-xs font-semibold text-ink mb-2">Ou colar link da imagem (URL)</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://exemplo.com/arte.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full rounded border border-rule px-2.5 py-1 text-xs bg-background focus:border-brand focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="rounded bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground disabled:opacity-50 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Principal */}
      <div className="relative p-3 sm:p-5">
        {modoVisual === "arte" ? (
          <figure className="group relative overflow-hidden rounded-lg border border-rule bg-paper-2">
            {/* Selo Tradicional de Fé & Escritura */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-center rounded bg-ink/80 px-2 py-1 text-[0.65rem] font-bold text-paper shadow-md backdrop-blur-xs">
              <span className="font-mono text-brand">聖</span>
              <span className="text-[0.55rem] tracking-widest text-paper/80 uppercase">
                Palavra
              </span>
            </div>

            {/* Botão rápido sobreposto para troca */}
            <button
              type="button"
              onClick={() => setPainelTroca(!painelTroca)}
              className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded bg-black/60 px-2.5 py-1 font-mono text-[0.7rem] text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs hover:bg-black/80 cursor-pointer"
            >
              <Edit3 className="size-3 text-brand" />
              <span>Trocar Arte</span>
            </button>

            {/* Imagem de Referência com Tratamento Atmosférico */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-900">
              <img
                src={currentArtSrc}
                alt={dia.legenda || `Arte do dia ${dia.n}: ${dia.tatica} aplicada às Escrituras`}
                width={768}
                height={1024}
                loading={dia.n === 1 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Faixa Inferior de Síntese sobreposta */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
                <div className="inline-flex items-center gap-1.5 rounded bg-brand/90 px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-white">
                  <Sparkles className="size-3" />
                  <span>A Lâmina na Rocha</span>
                </div>
                <p className="mt-2 font-serif text-sm sm:text-base italic text-stone-100 leading-snug drop-shadow-md">
                  {dia.legenda}
                </p>
              </div>
            </div>
          </figure>
        ) : (
          /* Placa Iluminada das Escrituras */
          <div className="relative overflow-hidden rounded-lg border-2 border-brand/30 bg-stone-950 p-6 sm:p-10 text-stone-100 shadow-inner">
            {/* Textura de fundo e brasão */}
            <div className="absolute -right-8 -top-8 size-44 rounded-full border border-brand/10 bg-brand/5 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 size-44 rounded-full border-brand/10 bg-brand/5 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Ornamento do Topo */}
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand" />
                <span className="font-mono text-xs tracking-[0.25em] text-brand uppercase">
                  Escrituras Sagradas · NVI
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand" />
              </div>

              {/* Citação Central */}
              <blockquote className="mt-6 max-w-xl font-serif text-xl sm:text-2xl italic leading-relaxed text-stone-100">
                “{versiculoPrincipal.texto}”
              </blockquote>

              <cite className="mt-4 block font-mono text-xs tracking-widest text-brand uppercase">
                — {versiculoPrincipal.referencia}
              </cite>

              {/* Conector com a Tática */}
              <div className="mt-8 w-full max-w-lg rounded-lg border border-stone-800 bg-stone-900/90 p-4 text-left">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <ScrollText className="size-4 text-brand" />
                  <span className="font-mono text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Como a Tática Ilustra o Versículo
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
                  {dia.legenda}
                </p>
              </div>

              {/* Ação de Memorização e Cópia */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCopiarVersiculo}
                  className="flex items-center gap-2 rounded-md border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-medium text-stone-200 transition-colors hover:border-brand hover:text-white cursor-pointer"
                >
                  {copiado ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Versículo Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copiar Versículo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quadro Comparativo Síntese Bíblica-Marcial */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {/* Lado 1: Tática Marcial */}
          <div className="rounded-lg border border-rule bg-paper p-4">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-accent" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                A Tática Samurai ({dia.tatica})
              </h3>
            </div>
            <p className="mt-2 font-serif text-sm italic text-ink">{dia.lema}</p>
            <p className="mt-1 text-xs text-ink-2 leading-relaxed">
              Princípio técnico de kenjutsu: a postura corporal e o alinhamento que preparam o
              guerreiro antes que a luta aconteça.
            </p>
          </div>

          {/* Lado 2: Fundamento Bíblico */}
          <div className="rounded-lg border border-brand/30 bg-field p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-brand" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-brand font-semibold">
                O Fundamento Bíblico
              </h3>
            </div>
            <p className="mt-2 font-serif text-sm italic text-ink">
              {versiculoPrincipal.referencia}
            </p>
            <p className="mt-1 text-xs text-ink-2 leading-relaxed">
              A verdade revelada: a força não decorre da disciplina humana, mas da Rocha soberana de
              Deus sobre a qual o guerreiro se apoia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
