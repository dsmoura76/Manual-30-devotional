import React, { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Check,
  Search,
  BookMarked,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { dias, capaTexto } from "@/data/manual";
import { useCustomArt } from "@/context/CustomArtContext";

export function PainelAdminArtes() {
  const { getArt, getCapaArt, setArt, resetArt, resetAllArts, customArts, isLoaded } =
    useCustomArt();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "custom" | "default">("all");
  const [urlInputs, setUrlInputs] = useState<Record<number, string>>({});
  const [bulkNotification, setBulkNotification] = useState<string | null>(null);
  const [processingDia, setProcessingDia] = useState<number | null>(null);

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const customCount = Object.keys(customArts).length;

  const handleFileUpload = async (diaNum: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessingDia(diaNum);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          try {
            await setArt(diaNum, result);
            const label = diaNum === 0 ? "Capa do Livro" : `Dia ${diaNum}`;
            triggerNotification(`Arte de ${label} salva e persistida com sucesso!`);
          } catch (err) {
            console.error(err);
            triggerNotification("Erro ao salvar arte. Tente novamente.");
          } finally {
            setProcessingDia(null);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async (diaNum: number, e: React.FormEvent) => {
    e.preventDefault();
    const url = urlInputs[diaNum];
    if (url && url.trim()) {
      setProcessingDia(diaNum);
      try {
        await setArt(diaNum, url.trim());
        setUrlInputs((prev) => ({ ...prev, [diaNum]: "" }));
        const label = diaNum === 0 ? "Capa do Livro" : `Dia ${diaNum}`;
        triggerNotification(`Arte de ${label} atualizada via link e salva no banco offline!`);
      } catch (err) {
        console.error(err);
        triggerNotification("Erro ao salvar arte via link.");
      } finally {
        setProcessingDia(null);
      }
    }
  };

  const triggerNotification = (msg: string) => {
    setBulkNotification(msg);
    setTimeout(() => setBulkNotification(null), 3500);
  };

  const isCoverCustom = Boolean((customArts as Record<number, string>)[0]);
  const coverMatches =
    filterMode === "all" ||
    (filterMode === "custom" && isCoverCustom) ||
    (filterMode === "default" && !isCoverCustom);
  const coverSearchMatches =
    !searchTerm ||
    "capa".includes(searchTerm.toLowerCase()) ||
    capaTexto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capaTexto.subtitulo.toLowerCase().includes(searchTerm.toLowerCase());

  const showCoverCard = coverMatches && coverSearchMatches;

  const filteredDias = dias.filter((d) => {
    const matchesSearch =
      d.tatica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.lema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `dia ${d.n}`.includes(searchTerm.toLowerCase());

    const isCustom = Boolean((customArts as Record<number, string>)[d.n]);
    if (filterMode === "custom") return matchesSearch && isCustom;
    if (filterMode === "default") return matchesSearch && !isCustom;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header do Painel */}
      <div className="rounded-2xl border border-rule-strong bg-paper p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Sparkles className="size-4" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand font-bold">
                Painel Administrativo do Autor
              </span>
            </div>
            <h2 className="display mt-1 text-2xl sm:text-3xl text-ink">
              Gestão de Artes & Visão Evangelística
            </h2>
            <p className="mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
              Substitua dinamicamente as ilustrações da Capa e de cada uma das 30 táticas. Todas as
              artes enviadas são salvas em banco de dados persistente (IndexedDB offline) e
              refletidas automaticamente no leitor digital, nas páginas dos dias, nos arquivos PDF e
              na exportação EPUB.
            </p>
          </div>

          {/* Contador e Ações Globais */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-rule bg-paper-2 px-4 py-2.5 text-center">
              <span className="block font-mono text-xs text-ink-3 uppercase">Artes Editadas</span>
              <span className="font-mono text-lg font-bold text-accent">
                {customCount} <span className="text-xs text-ink-3 font-normal">/ 31 itens</span>
              </span>
            </div>

            {customCount > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (
                    confirm(
                      "Deseja realmente restaurar todas as ilustrações para as originais do manual?",
                    )
                  ) {
                    await resetAllArts();
                    triggerNotification(
                      "Todas as artes foram restauradas para os padrões originais.",
                    );
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3.5 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Restaurar Todas</span>
              </button>
            )}
          </div>
        </div>

        {bulkNotification && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{bulkNotification}</span>
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por capa, tática, lema ou dia..."
              className="w-full rounded-lg border border-rule bg-field pl-9 pr-3 py-2 text-xs text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex items-center rounded-lg border border-rule bg-field p-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`rounded px-3 py-1 font-medium transition-colors cursor-pointer ${
                filterMode === "all"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              Todas (31)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("custom")}
              className={`rounded px-3 py-1 font-medium transition-colors cursor-pointer ${
                filterMode === "custom"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              Personalizadas ({customCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("default")}
              className={`rounded px-3 py-1 font-medium transition-colors cursor-pointer ${
                filterMode === "default"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              Padrão ({31 - customCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid com Capa e os 30 Dias */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD DA CAPA DO LIVRO (DIA 0) */}
        {showCoverCard && (
          <div
            className={`group flex flex-col justify-between overflow-hidden rounded-xl border bg-paper transition-all hover:shadow-md ${
              isCoverCustom ? "border-accent ring-2 ring-accent/40" : "border-rule"
            }`}
          >
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={getCapaArt()}
                  alt="Capa do Livro - A Batalha"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                {/* Badges Flutuantes */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-brand font-mono text-xs font-bold text-white shadow-xs">
                    00
                  </span>
                  <span className="rounded-md bg-black/60 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-white backdrop-blur-xs">
                    CAPA PRINCIPAL DO LIVRO
                  </span>
                </div>

                {isCoverCustom && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-[0.65rem] font-bold text-accent-foreground shadow-xs">
                      Arte Personalizada
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-serif italic text-xs text-stone-200 line-clamp-1">
                    “{capaTexto.subtitulo}”
                  </p>
                </div>
              </div>

              <div className="p-4">
                <p className="font-mono text-[0.7rem] text-brand uppercase tracking-wider font-semibold">
                  Folha de Rosto & Capa Editorial
                </p>
                <p className="mt-1 text-xs text-ink-2 line-clamp-2 leading-relaxed">
                  A imagem frontal do manual. Refletida na página inicial, cabeçalho, PDF e na capa
                  do arquivo EPUB.
                </p>
              </div>
            </div>

            {/* Controles da Capa */}
            <div className="border-t border-rule bg-paper-2 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={processingDia === 0}
                  onClick={() => fileInputRefs.current[0]?.click()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {processingDia === 0 ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  <span>{processingDia === 0 ? "Processando..." : "Upload Nova Capa"}</span>
                </button>
                <input
                  type="file"
                  ref={(el) => {
                    fileInputRefs.current[0] = el;
                  }}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(0, e)}
                  className="hidden"
                />

                {isCoverCustom && (
                  <button
                    type="button"
                    onClick={async () => {
                      await resetArt(0);
                      triggerNotification("Capa restaurada para o padrão.");
                    }}
                    title="Restaurar capa padrão"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-rule bg-paper text-ink-2 hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Input de URL direta */}
              <form onSubmit={(e) => handleUrlSubmit(0, e)} className="flex items-center gap-1.5">
                <input
                  type="url"
                  value={urlInputs[0] || ""}
                  onChange={(e) => setUrlInputs((prev) => ({ ...prev, [0]: e.target.value }))}
                  placeholder="Ou cole a URL da imagem da capa..."
                  className="flex-1 rounded-md border border-rule bg-paper px-2 py-1 text-[0.75rem] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!urlInputs[0]?.trim() || processingDia === 0}
                  className="rounded-md border border-rule bg-paper px-2.5 py-1 text-[0.75rem] font-medium text-ink hover:border-brand disabled:opacity-40 cursor-pointer"
                >
                  Salvar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CARDS DOS 30 DIAS */}
        {filteredDias.map((dia) => {
          const isCustom = Boolean((customArts as Record<number, string>)[dia.n]);
          const currentSrc = getArt(dia.n);
          const isProcessing = processingDia === dia.n;

          return (
            <div
              key={dia.n}
              className={`group flex flex-col justify-between overflow-hidden rounded-xl border bg-paper transition-all hover:shadow-md ${
                isCustom ? "border-accent ring-1 ring-accent/30" : "border-rule"
              }`}
            >
              {/* Topo do Card */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
                    Dia {String(dia.n).padStart(2, "0")}
                  </span>
                  {isCustom ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.65rem] font-medium text-accent">
                      <Sparkles className="size-2.5" />
                      Personalizada
                    </span>
                  ) : (
                    <span className="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[0.65rem] text-ink-3 border border-rule">
                      Padrão
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-serif text-base font-semibold text-ink line-clamp-1">
                  {dia.tatica}
                </h3>
                <p className="mt-0.5 font-serif text-xs italic text-ink-2 line-clamp-1">
                  {dia.lema}
                </p>

                {/* Preview da Imagem */}
                <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-lg border border-rule bg-stone-900">
                  <img
                    src={currentSrc}
                    alt={`Arte do Dia ${dia.n}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                  {/* Badges Flutuantes */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-black/60 font-mono text-xs font-bold text-white backdrop-blur-xs">
                      {String(dia.n).padStart(2, "0")}
                    </span>
                    <span className="rounded-md bg-black/60 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-white backdrop-blur-xs">
                      {dia.tatica}
                    </span>
                  </div>

                  {isCustom && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-[0.65rem] font-bold text-accent-foreground shadow-xs">
                        Arte Customizada
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-serif italic text-xs text-stone-200 line-clamp-1">
                      “{dia.lema}”
                    </p>
                  </div>
                </div>

                {/* Descrição & Contexto Bíblico */}
                <div className="p-4">
                  <p className="font-mono text-[0.7rem] text-ink-3 uppercase tracking-wider">
                    {dia.leitura}
                  </p>
                  <p className="mt-1 text-xs text-ink-2 line-clamp-2 leading-relaxed">
                    {dia.legenda}
                  </p>
                </div>
              </div>

              {/* Controles de Troca */}
              <div className="border-t border-rule bg-paper-2 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => fileInputRefs.current[dia.n]?.click()}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    <span>{isProcessing ? "Processando..." : "Upload Imagem"}</span>
                  </button>
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[dia.n] = el;
                    }}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(dia.n, e)}
                    className="hidden"
                  />

                  {isCustom && (
                    <button
                      type="button"
                      onClick={async () => {
                        await resetArt(dia.n);
                        triggerNotification(`Arte do Dia ${dia.n} restaurada para o padrão.`);
                      }}
                      title="Restaurar ilustração padrão"
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-rule bg-paper text-ink-2 hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Input de URL direta */}
                <form
                  onSubmit={(e) => handleUrlSubmit(dia.n, e)}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="url"
                    value={urlInputs[dia.n] || ""}
                    onChange={(e) => setUrlInputs((prev) => ({ ...prev, [dia.n]: e.target.value }))}
                    placeholder="Ou cole a URL da imagem..."
                    className="flex-1 rounded-md border border-rule bg-paper px-2 py-1 text-[0.75rem] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!urlInputs[dia.n]?.trim() || isProcessing}
                    className="rounded-md border border-rule bg-paper px-2.5 py-1 text-[0.75rem] font-medium text-ink hover:border-brand disabled:opacity-40 cursor-pointer"
                  >
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
