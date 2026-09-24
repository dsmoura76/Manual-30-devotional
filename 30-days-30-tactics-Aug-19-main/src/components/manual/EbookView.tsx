import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Printer,
  FileDown,
  Download,
  FileText,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Type,
  Search,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  FileCode,
  Edit3,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Music,
  ShieldCheck,
} from "lucide-react";
import { dias, capaArte, capaTexto, abertura, indice, type Dia, type Marcha } from "@/data/manual";
import { useCaderno } from "@/hooks/useCaderno";
import { useCustomArt } from "@/context/CustomArtContext";
import { generateEpubHtml, generatePublisherPitch, downloadFile } from "@/lib/exportManuscript";
import { downloadEpubBook, EpubBuildProgress } from "@/lib/epubBuilder";
import { ArteVisualEquilibrio } from "./ArteVisualEquilibrio";
import { MusicaVideoSection } from "./MusicaVideoSection";
import { PainelAdminArtes } from "./PainelAdminArtes";
import { AuditoriaNVIView } from "./AuditoriaNVIView";

type ReaderTheme = "washi" | "sepia" | "dark" | "white";
type FontSize = "sm" | "base" | "lg" | "xl";
type ViewMode =
  "reader" | "kdp-proof" | "export-hub" | "art-gallery" | "music" | "admin-artes" | "auditoria-nvi";

export function EbookView() {
  const [viewMode, setViewMode] = useState<ViewMode>("reader");
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [theme, setTheme] = useState<ReaderTheme>("washi");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [searchQuery, setSearchQuery] = useState("");
  const [paperFormat, setPaperFormat] = useState<"6x9" | "letter">("6x9");
  const [showIllustrationsInKdp, setShowIllustrationsInKdp] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [exportandoEpub, setExportandoEpub] = useState(false);
  const [epubProgress, setEpubProgress] = useState<EpubBuildProgress | null>(null);

  const { notas, salvarNota } = useCaderno();
  const { getArt, setArt, resetArt, resetAllArts, customArts } = useCustomArt();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingDayForArt, setEditingDayForArt] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("print") === "true") {
        setViewMode("kdp-proof");
        const timer = setTimeout(() => {
          window.print();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, []);

  const filteredDays = useMemo(() => {
    if (!searchQuery.trim()) return dias;
    const q = searchQuery.toLowerCase();
    return dias.filter(
      (d) =>
        d.tatica.toLowerCase().includes(q) ||
        d.leitura.toLowerCase().includes(q) ||
        d.lema.toLowerCase().includes(q) ||
        String(d.n).includes(q),
    );
  }, [searchQuery]);

  const activeDay: Dia = useMemo(() => {
    return dias.find((d) => d.n === currentChapter) || dias[0] || ({} as Dia);
  }, [currentChapter]);

  const fontClasses: Record<FontSize, string> = {
    sm: "text-base leading-relaxed",
    base: "text-lg leading-relaxed",
    lg: "text-xl leading-relaxed",
    xl: "text-2xl leading-loose",
  };

  const themeClasses: Record<
    ReaderTheme,
    { bg: string; text: string; card: string; border: string }
  > = {
    washi: {
      bg: "bg-[#f4efe4]",
      text: "text-[#2b2621]",
      card: "bg-[#fcfaf5]",
      border: "border-[#e0d6c3]",
    },
    sepia: {
      bg: "bg-[#ece3d0]",
      text: "text-[#382e25]",
      card: "bg-[#f4ece0]",
      border: "border-[#d8ccb6]",
    },
    dark: {
      bg: "bg-[#181614]",
      text: "text-[#e4ded6]",
      card: "bg-[#221f1c]",
      border: "border-[#36322d]",
    },
    white: {
      bg: "bg-[#ffffff]",
      text: "text-[#111111]",
      card: "bg-[#f9f9f9]",
      border: "border-[#e5e5e5]",
    },
  };

  const currentTheme = themeClasses[theme];

  const handleExportPdf = () => {
    setExportando(true);
    setViewMode("kdp-proof");
    setTimeout(() => {
      window.print();
      setExportando(false);
    }, 300);
  };

  const handleExportEpub = async () => {
    try {
      setExportandoEpub(true);
      setEpubProgress({ etapa: "Iniciando compilação do e-book...", porcentagem: 5 });
      await downloadEpubBook({
        customArtsMap: customArts,
        onProgress: (p) => setEpubProgress(p),
      });
      setTimeout(() => {
        setExportandoEpub(false);
        setEpubProgress(null);
      }, 1500);
    } catch (err) {
      console.error("Erro ao gerar EPUB:", err);
      setExportandoEpub(false);
      setEpubProgress(null);
    }
  };

  const handleDownloadHtmlManuscript = () => {
    const content = generateEpubHtml(customArts);
    downloadFile(
      "A-Batalha_Manuscrito-Editorial_Daniel-Shirazawa-Moura.html",
      content,
      "text/html;charset=utf-8",
    );
  };

  const handleDownloadEpubPackage = () => {
    const content = generateEpubHtml(customArts);
    downloadFile("A-Batalha_KDP-Ebook-Package.html", content, "text/html;charset=utf-8");
  };

  const handleDownloadPitch = () => {
    const pitch = generatePublisherPitch();
    downloadFile("A-Batalha_Dossie-Comercial-Editora.md", pitch, "text/markdown;charset=utf-8");
  };

  const handleExportUserJournal = () => {
    const journalData = dias.map((d) => ({
      dia: d.n,
      tatica: d.tatica,
      pergunta: d.cadernoPergunta,
      resposta: notas[d.n] || "(Sem resposta registrada)",
    }));
    const jsonStr = JSON.stringify(journalData, null, 2);
    downloadFile("Meu-Diario_A-Batalha_Notas-Pessoais.json", jsonStr, "application/json");
  };

  const handleGalleryUpload = async (dayNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          await setArt(dayNumber, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}
    >
      {/* ---------- HEADER DE CONTROLE (NO-PRINT) ---------- */}
      <header className="sticky top-0 z-50 border-b border-rule/60 bg-paper/95 backdrop-blur-md no-print">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="display text-xl tracking-[0.14em] text-ink hover:text-accent">
              A Batalha
            </Link>
            <span className="rounded bg-brand/10 px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-brand font-semibold">
              KDP & E-Book
            </span>
          </div>

          {/* Seletor de Modo */}
          <div className="flex flex-wrap items-center rounded-lg border border-rule bg-paper-2/80 p-1 gap-1">
            <button
              onClick={() => setViewMode("reader")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "reader"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>Leitor Digital</span>
            </button>
            <button
              onClick={() => setViewMode("kdp-proof")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "kdp-proof"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <FileText className="size-3.5" />
              <span>Interior KDP & PDF</span>
            </button>
            <button
              onClick={() => setViewMode("art-gallery")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "art-gallery"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <ImageIcon className="size-3.5" />
              <span>
                Galeria de Artes (
                {Object.keys(customArts).length > 0
                  ? `${Object.keys(customArts).length} editadas`
                  : "30 Artes"}
                )
              </span>
            </button>
            <button
              onClick={() => setViewMode("music")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "music"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Music className="size-3.5" />
              <span>Música & Vídeo</span>
            </button>
            <button
              onClick={() => setViewMode("admin-artes")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "admin-artes"
                  ? "bg-brand text-white shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>Admin Artes IA</span>
            </button>
            <button
              onClick={() => setViewMode("auditoria-nvi")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "auditoria-nvi"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <ShieldCheck className="size-3.5" />
              <span>Auditoria NVI</span>
            </button>
            <button
              onClick={() => setViewMode("export-hub")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "export-hub"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Download className="size-3.5" />
              <span>Exportar / Editora</span>
            </button>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportEpub}
              disabled={exportandoEpub}
              title="Gerar arquivo .EPUB oficial com todas as gravuras e links internos para Kindle, Apple Books e Kobo"
              className="flex items-center gap-1.5 rounded border border-emerald-700 bg-emerald-800 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className={`size-3.5 ${exportandoEpub ? "animate-bounce" : ""}`} />
              <span>
                {exportandoEpub ? `${epubProgress?.porcentagem || 0}% EPUB` : "Exportar .EPUB"}
              </span>
            </button>
            <button
              onClick={handleExportPdf}
              title="Exportar manual completo ilustrado formatado como PDF pronto para impressão ou leitura"
              className="flex items-center gap-1.5 rounded border border-brand bg-brand px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-brand/90 transition-all cursor-pointer"
            >
              <FileDown className="size-3.5" />
              <span>Exportar PDF</span>
            </button>
            <Link
              to="/"
              className="rounded border border-rule px-3 py-1.5 font-mono text-xs text-ink-2 hover:text-ink"
            >
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODO 1: LEITOR DIGITAL INTERATIVO (E-BOOK READER) */}
      {/* ========================================================================= */}
      {viewMode === "reader" && (
        <div className="no-print mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[300px_1fr] sm:px-6">
          {/* BARRA LATERAL COM ÍNDICE E CONFIGURAÇÕES */}
          <aside className="space-y-6">
            {/* Controles de Leitura */}
            <div
              className={`rounded-lg border p-4 shadow-xs ${currentTheme.card} ${currentTheme.border}`}
            >
              <h3 className="display text-sm tracking-wider text-ink">Preferências de Leitura</h3>

              {/* Seletor de Tema */}
              <div className="mt-3 flex items-center justify-between gap-1 border-t border-rule/50 pt-3">
                <span className="font-mono text-xs text-ink-3">Tema:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTheme("washi")}
                    title="Washi Quente"
                    className={`size-6 rounded-full border bg-[#f4efe4] cursor-pointer ${theme === "washi" ? "ring-2 ring-brand" : "border-[#d8ccb6]"}`}
                  />
                  <button
                    onClick={() => setTheme("sepia")}
                    title="Papiro Sépia"
                    className={`size-6 rounded-full border bg-[#ece3d0] cursor-pointer ${theme === "sepia" ? "ring-2 ring-brand" : "border-[#d8ccb6]"}`}
                  />
                  <button
                    onClick={() => setTheme("white")}
                    title="Branco Puro"
                    className={`size-6 rounded-full border bg-[#ffffff] cursor-pointer ${theme === "white" ? "ring-2 ring-brand" : "border-[#cccccc]"}`}
                  />
                  <button
                    onClick={() => setTheme("dark")}
                    title="Noite Escura"
                    className={`size-6 rounded-full border bg-[#181614] cursor-pointer ${theme === "dark" ? "ring-2 ring-brand" : "border-[#444444]"}`}
                  />
                </div>
              </div>

              {/* Tamanho da Fonte */}
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-rule/50 pt-3">
                <span className="font-mono text-xs text-ink-3">Fonte:</span>
                <div className="flex gap-1 text-xs">
                  {(["sm", "base", "lg", "xl"] as FontSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFontSize(s)}
                      className={`rounded px-2 py-1 uppercase font-mono cursor-pointer ${
                        fontSize === s
                          ? "bg-accent text-accent-foreground font-bold"
                          : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Busca e Índice de Capítulos */}
            <div
              className={`rounded-lg border p-4 shadow-xs ${currentTheme.card} ${currentTheme.border}`}
            >
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 size-4 text-ink-3" />
                <input
                  type="text"
                  placeholder="Buscar tática ou dia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-rule bg-background py-2 pr-3 pl-8 text-xs focus:border-brand focus:outline-hidden"
                />
              </div>

              <div className="mt-4 max-h-[50vh] space-y-1 overflow-y-auto pr-1">
                {filteredDays.map((d) => {
                  const isSelected = d.n === currentChapter;
                  const hasNote = Boolean(notas[d.n]);
                  const hasCustomArt = Boolean((customArts as Record<number, string>)[d.n]);
                  return (
                    <button
                      key={d.n}
                      onClick={() => setCurrentChapter(d.n)}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-ink-2 hover:bg-paper-2 hover:text-ink"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[0.7rem] ${isSelected ? "text-accent-foreground/80" : "text-ink-3"}`}
                        >
                          {String(d.n).padStart(2, "0")}
                        </span>
                        <span className="truncate">{d.tatica}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasCustomArt && (
                          <span
                            className="size-1.5 rounded-full bg-accent"
                            title="Arte personalizada"
                          />
                        )}
                        {hasNote && (
                          <Bookmark
                            className={`size-3 ${isSelected ? "text-paper" : "text-brand"}`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ÁREA PRINCIPAL DO CAPÍTULO (LEITOR DE E-BOOK) */}
          <main className="space-y-8">
            {/* Header do Capítulo */}
            <article
              className={`rounded-xl border p-6 sm:p-10 shadow-sm ${currentTheme.card} ${currentTheme.border} ${fontClasses[fontSize]}`}
            >
              <div className="border-b border-rule pb-6 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                  DIA {String(activeDay.n).padStart(2, "0")} DE 30 · TÁTICA DE COMBATE
                </p>
                <h1 className="display mt-2 text-3xl sm:text-5xl text-ink">{activeDay.tatica}</h1>
                <p className="mt-2 font-serif italic text-ink-2">{activeDay.leitura}</p>
                <blockquote className="mx-auto mt-4 max-w-xl border-l-2 border-brand pl-4 text-left font-serif text-lg italic text-ink/90">
                  “{activeDay.lema}”
                </blockquote>
              </div>

              {/* Gravura & Iluminação da Palavra com Suporte a Upload */}
              <ArteVisualEquilibrio dia={activeDay} />

              {/* 1. Reconhecimento */}
              <section className="mt-8 space-y-3">
                <h2 className="display text-lg tracking-wider text-accent border-b border-rule/50 pb-1">
                  1. Reconhecimento de Terreno
                </h2>
                <div
                  className="prosa prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeDay.reconhecimento }}
                />
              </section>

              {/* 2. Tática na Tradição */}
              <section className="mt-10 space-y-3">
                <h2 className="display text-lg tracking-wider text-accent border-b border-rule/50 pb-1">
                  2. A Tática na Tradição Samurai
                </h2>
                <div
                  className="prosa prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeDay.taticaHtml }}
                />
              </section>

              {/* 3. No Combate */}
              <section className="mt-10 space-y-3">
                <h2 className="display text-lg tracking-wider text-accent border-b border-rule/50 pb-1">
                  3. No Combate: Onde a Lâmina Encosta na Vida
                </h2>
                <div
                  className="prosa prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeDay.combate }}
                />
              </section>

              {/* 4. A Marcha do Dia */}
              <section className="mt-10 space-y-4 rounded-lg border border-rule bg-field/50 p-6">
                <h2 className="display text-lg tracking-wider text-vale border-b border-rule/60 pb-1">
                  4. A Marcha do Dia (3 Ações Práticas)
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {activeDay.marcha.map((m: Marcha, idx: number) => (
                    <div key={idx} className="rounded border border-rule bg-paper p-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                        {m.titulo}
                      </p>
                      <p className="mt-2 text-sm text-ink-2 leading-relaxed">{m.texto}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Caderno de Campo */}
              <section className="mt-10 space-y-4 rounded-lg border border-rule-strong bg-paper-2/60 p-6">
                <div className="flex items-baseline justify-between border-b border-rule pb-2">
                  <h2 className="display text-lg tracking-wider text-ink">5. Caderno de Campo</h2>
                  <span className="font-mono text-xs text-ink-3">Anotação pessoal</span>
                </div>
                <p className="font-serif text-base font-semibold text-accent">
                  {activeDay.cadernoPergunta}
                </p>
                <textarea
                  rows={4}
                  placeholder={activeDay.placeholder || "Escreva sua resposta de combate aqui..."}
                  value={notas[activeDay.n] || ""}
                  onChange={(e) => salvarNota(activeDay.n, e.target.value)}
                  className="w-full rounded border border-rule-strong bg-background p-3 text-sm focus:border-brand focus:outline-hidden"
                />
                <p className="font-mono text-[0.7rem] text-ink-3">
                  ✓ Salvo automaticamente neste dispositivo.
                </p>
              </section>

              {/* 6. Oração do Guerreiro */}
              <section className="mt-10 rounded-lg border-l-4 border-vale bg-field p-6">
                <h2 className="display text-sm tracking-wider text-vale uppercase">
                  6. Oração do Guerreiro
                </h2>
                <p className="mt-2 font-serif text-lg italic text-ink">“{activeDay.oracao}”</p>
              </section>

              {/* Fontes */}
              <footer className="mt-10 border-t border-rule pt-4 text-xs text-ink-3">
                <p className="font-semibold mb-1 uppercase tracking-wider">Fontes Históricas:</p>
                <div dangerouslySetInnerHTML={{ __html: activeDay.fontes }} />
              </footer>

              {/* Navegação Entre Capítulos */}
              <div className="mt-12 flex items-center justify-between border-t border-rule pt-6">
                <button
                  disabled={currentChapter === 1}
                  onClick={() => setCurrentChapter((prev) => Math.max(1, prev - 1))}
                  className="flex items-center gap-2 rounded border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider disabled:opacity-40 hover:bg-paper-2 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                  <span>Dia Anterior</span>
                </button>
                <span className="font-mono text-xs text-ink-3">
                  Capítulo {currentChapter} de 30
                </span>
                <button
                  disabled={currentChapter === 30}
                  onClick={() => setCurrentChapter((prev) => Math.min(30, prev + 1))}
                  className="flex items-center gap-2 rounded border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider disabled:opacity-40 hover:bg-paper-2 cursor-pointer"
                >
                  <span>Próximo Dia</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </article>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: INTERIOR COMPLETO FORMATADO PARA KDP / PDF PRONTO PARA IMPRESSÃO */}
      {/* ========================================================================= */}
      {viewMode === "kdp-proof" && (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {/* BARRA DE FERRAMENTAS KDP (NO-PRINT) */}
          <div className="no-print mb-8 rounded-xl border border-rule bg-paper p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand/10 px-2 py-0.5 font-mono text-xs font-bold text-brand">
                    KDP INTERIOR PROOF
                  </span>
                  <h2 className="display text-lg text-ink">
                    Visualizador do Miolo Completo (160+ Páginas)
                  </h2>
                </div>
                <p className="mt-1 text-xs text-ink-2">
                  Formatado conforme as regras do Amazon KDP e editoras tradicionais. Inclui capa
                  interna, folha de rosto, ficha catalográfica, sumário, todas as gravuras
                  ilustrativas e os 30 capítulos com áreas de anotação e orações.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowIllustrationsInKdp(!showIllustrationsInKdp)}
                  className={`flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs font-semibold uppercase cursor-pointer ${
                    showIllustrationsInKdp
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-rule bg-paper-2 text-ink-2"
                  }`}
                >
                  <ImageIcon className="size-3.5" />
                  <span>{showIllustrationsInKdp ? "Ilustrações Ativas" : "Sem Ilustrações"}</span>
                </button>
                <div className="flex items-center rounded border border-rule bg-paper-2 p-0.5 text-xs">
                  <button
                    onClick={() => setPaperFormat("6x9")}
                    className={`px-3 py-1 font-mono uppercase cursor-pointer ${paperFormat === "6x9" ? "bg-accent text-accent-foreground font-semibold" : "text-ink-2"}`}
                  >
                    6" x 9" (Trade)
                  </button>
                  <button
                    onClick={() => setPaperFormat("letter")}
                    className={`px-3 py-1 font-mono uppercase cursor-pointer ${paperFormat === "letter" ? "bg-accent text-accent-foreground font-semibold" : "text-ink-2"}`}
                  >
                    Letter (A4)
                  </button>
                </div>
                <button
                  onClick={handleExportPdf}
                  className="flex items-center gap-2 rounded bg-brand px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand/90 transition-colors cursor-pointer"
                >
                  <FileDown className="size-4" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* O MIOLO DO LIVRO EM SI (PRINT READY) */}
          <div
            id="kdp-book-content"
            className="bg-[#ffffff] text-[#1a1a1a] p-8 sm:p-14 shadow-lg border border-rule print:shadow-none print:border-none print:p-0"
          >
            {/* 1. CAPA INTERNA / FOLHA DE ROSTO */}
            <div className="kdp-page text-center py-20 border-b border-rule print:border-none print:py-16">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#8c2323]">
                DIÁRIO DEVOCIONAL DE 30 DIAS
              </p>
              <h1 className="display mt-6 text-5xl sm:text-7xl tracking-wider text-[#111111]">
                {capaTexto.titulo}
              </h1>
              <p className="mx-auto mt-6 max-w-lg font-serif text-lg leading-relaxed text-[#333333]">
                {capaTexto.subtitulo}
              </p>
              <div className="my-10 mx-auto w-16 border-t-2 border-[#8c2323]" />
              <p className="font-mono text-sm text-[#666666]">{capaTexto.referencia}</p>
              <p className="font-mono mt-14 text-sm font-semibold tracking-widest text-[#111111]">
                DANIEL SHIRAZAWA MOURA
              </p>
            </div>

            {/* 2. FICHA CATALOGRÁFICA & DIREITOS */}
            <div className="kdp-chapter text-xs text-[#555555] py-16 border-b border-rule print:border-none">
              <div className="mx-auto max-w-md border border-[#cccccc] p-6 font-serif">
                <p className="font-semibold text-center uppercase tracking-wider mb-3">
                  Dados Internacionais de Catalogação na Publicação (CIP)
                </p>
                <p className="mb-2">Moura, Daniel Shirazawa.</p>
                <p className="mb-2 pl-4">
                  A Batalha: Manual de Campo de 30 Dias — Trinta táticas reais de samurai ligadas à
                  Palavra / Daniel Shirazawa Moura. — 1. ed. — 2026.
                </p>
                <p className="mb-2 pl-4">160 p. ; 16 x 23 cm.</p>
                <p className="mb-2 pl-4">ISBN 978-65-00-00000-0 (versão impressa / KDP)</p>
                <p className="pl-4">
                  1. Vida Cristã. 2. Devocional Diário. 3. Artes Marciais — Filosofia. 4.
                  Espiritualidade Masculina. I. Título.
                </p>
              </div>
              <div className="mt-8 text-center space-y-1">
                <p>© 2026 Daniel Shirazawa Moura. Todos os direitos reservados.</p>
                <p>
                  Citações bíblicas extraídas da Nova Versão Internacional (NVI) © Biblica, Inc.
                </p>
                <p>Proibida a reprodução total ou parcial sem autorização expressa do autor.</p>
              </div>
            </div>

            {/* 3. DEDICATÓRIA & EPÍGRAFE */}
            <div className="kdp-chapter py-20 text-center border-b border-rule print:border-none">
              <blockquote className="mx-auto max-w-md font-serif text-lg italic leading-relaxed text-[#222222]">
                “O Senhor reina! Vestiu-se de majestade; de majestade vestiu-se o Senhor e armou-se
                de poder! O mundo está firme e não se abalará.”
                <footer className="mt-4 font-mono text-xs uppercase tracking-widest text-[#777777] not-italic">
                  Salmos 93.1 · NVI
                </footer>
              </blockquote>
            </div>

            {/* 4. PREFÁCIO / INTRODUÇÃO */}
            <div className="kdp-chapter py-12 border-b border-rule print:border-none">
              <h2 className="display text-2xl uppercase tracking-wider text-[#111111] mb-6">
                {abertura.titulo}
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-[#888888] mb-6">
                {abertura.nota}
              </p>
              <div className="space-y-4 font-serif text-base leading-relaxed text-[#222222]">
                {abertura.paragrafos.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              <figure className="mt-8 border-l-4 border-[#1f3a52] bg-[#f7f9fb] p-6">
                <p className="font-display text-lg uppercase tracking-wider text-[#1f3a52]">
                  {abertura.citacao}
                </p>
                <figcaption className="font-mono text-xs mt-2 text-[#666666]">
                  — {abertura.citacaoFonte}
                </figcaption>
              </figure>
            </div>

            {/* 5. SUMÁRIO COMPLETO */}
            <div className="kdp-chapter py-12 border-b border-rule print:border-none">
              <h2 className="display text-2xl uppercase tracking-wider text-[#111111] mb-6">
                Sumário das 30 Táticas
              </h2>
              <div className="grid gap-2 text-sm font-serif">
                {indice.map((i) => (
                  <div
                    key={i.n}
                    className="flex items-baseline justify-between border-b border-dotted border-[#cccccc] pb-1"
                  >
                    <span className="font-semibold">
                      Dia {String(i.n).padStart(2, "0")} · {i.tatica}
                    </span>
                    <span className="font-mono text-xs text-[#777777]">{i.passagem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. OS 30 CAPÍTULOS DE TREINAMENTO */}
            {dias.map((d) => {
              const artSrc = getArt(d.n);
              return (
                <div key={d.n} className="kdp-chapter py-12 border-b border-rule print:border-none">
                  {/* Cabeçalho do Dia */}
                  <div className="text-center pb-6 border-b border-[#dddddd]">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8c2323]">
                      DIA {String(d.n).padStart(2, "0")} DE 30 · TÁTICA DE COMBATE
                    </p>
                    <h2 className="display mt-2 text-3xl sm:text-4xl text-[#111111]">{d.tatica}</h2>
                    <p className="font-serif italic text-sm text-[#555555] mt-1">{d.leitura}</p>
                    <blockquote className="mt-3 font-serif font-semibold text-base text-[#222222]">
                      “{d.lema}”
                    </blockquote>
                    <div className="mt-4 border-l-2 border-[#8c2323] bg-[#fafafa] p-3 text-left">
                      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-[#8c2323] font-semibold">
                        Tática Samurai × Fundamento Bíblico
                      </p>
                      <p className="mt-1 font-serif text-xs italic text-[#444444] leading-relaxed">
                        {d.legenda}
                      </p>
                    </div>
                  </div>

                  {/* ILUSTRAÇÃO TÁTICA NO PDF & KDP */}
                  {showIllustrationsInKdp && (
                    <figure className="my-8 text-center break-inside-avoid">
                      <div className="mx-auto max-w-[420px] overflow-hidden rounded-md border border-[#cccccc] bg-[#fdfdfd] p-1.5 shadow-xs">
                        <img
                          src={artSrc}
                          alt={`Ilustração do Dia ${d.n}: ${d.tatica}`}
                          className="h-auto w-full object-cover rounded-xs"
                        />
                      </div>
                      <figcaption className="mt-2 font-serif text-xs italic text-[#666666]">
                        Figura {String(d.n).padStart(2, "0")}: {d.tatica} — {d.legenda}
                      </figcaption>
                    </figure>
                  )}

                  {/* Seções */}
                  <div className="mt-8 space-y-8 font-serif text-base leading-relaxed text-[#222222]">
                    <div>
                      <h3 className="display text-base uppercase tracking-wider text-[#8c2323] mb-2">
                        1. Reconhecimento de Terreno
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: d.reconhecimento }} />
                    </div>

                    <div>
                      <h3 className="display text-base uppercase tracking-wider text-[#8c2323] mb-2">
                        2. A Tática na Tradição
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: d.taticaHtml }} />
                    </div>

                    <div>
                      <h3 className="display text-base uppercase tracking-wider text-[#8c2323] mb-2">
                        3. No Combate
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: d.combate }} />
                    </div>

                    {/* Marcha com Caixas de Check */}
                    <div className="border border-[#dddddd] bg-[#fafafa] p-5">
                      <h3 className="display text-base uppercase tracking-wider text-[#1f3a52] mb-3">
                        4. A Marcha do Dia
                      </h3>
                      <div className="space-y-3">
                        {d.marcha.map((m, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <span className="font-mono text-sm">[ ]</span>
                            <div>
                              <p className="font-semibold text-sm">{m.titulo}</p>
                              <p className="text-sm text-[#444444]">{m.texto}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Caderno de Campo com Linhas Pautadas */}
                    <div className="border border-[#cccccc] p-5 bg-[#ffffff]">
                      <h3 className="display text-base uppercase tracking-wider text-[#111111] mb-2">
                        5. Caderno de Campo
                      </h3>
                      <p className="font-semibold text-sm text-[#8c2323] mb-4">
                        {d.cadernoPergunta}
                      </p>
                      <div className="space-y-3 text-xs text-[#999999] font-mono">
                        <div className="border-b border-[#cccccc] pb-1">
                          ________________________________________________________________________________
                        </div>
                        <div className="border-b border-[#cccccc] pb-1">
                          ________________________________________________________________________________
                        </div>
                        <div className="border-b border-[#cccccc] pb-1">
                          ________________________________________________________________________________
                        </div>
                        <div className="border-b border-[#cccccc] pb-1">
                          ________________________________________________________________________________
                        </div>
                      </div>
                    </div>

                    {/* Oração */}
                    <div className="border-l-4 border-[#1f3a52] bg-[#f4f7f9] p-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#1f3a52] font-semibold">
                        6. Oração do Guerreiro
                      </p>
                      <p className="mt-2 italic text-sm text-[#222222]">“{d.oracao}”</p>
                    </div>

                    {/* Fontes */}
                    <div className="pt-4 border-t border-[#eeeeee] text-xs text-[#666666]">
                      <p className="font-semibold mb-1">Fontes Históricas:</p>
                      <div dangerouslySetInnerHTML={{ __html: d.fontes }} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 7. POSFÁCIO & RECURSOS DE APOIO */}
            <div className="kdp-chapter py-16 text-center border-t border-rule">
              <h2 className="display text-3xl uppercase tracking-wider text-[#111111] mb-4">
                A Batalha Continua
              </h2>
              <p className="mx-auto max-w-xl font-serif text-base leading-relaxed text-[#333333] mb-6">
                Você completou os 30 dias de alinhamento com a espada da Palavra e a postura do
                guerreiro. Mas o mar continuará rugindo. Permaneça vigilante na sua rocha.
              </p>
              <div className="mx-auto max-w-md border border-[#8c2323]/30 bg-[#fdf8f8] p-5 text-xs text-[#555555]">
                <p className="font-semibold uppercase tracking-wider text-[#8c2323] mb-1">
                  Apoio & Acolhimento
                </p>
                <p>
                  Se estiver enfrentando crises agudas de angústia ou pensamentos de desistência,
                  procure ajuda profissional, pastoral e ligue gratuitamente para o{" "}
                  <strong>CVV no 188</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 3: GALERIA COMPLETA DE ARTES E GESTÃO DE ILUSTRAÇÕES */}
      {/* ========================================================================= */}
      {viewMode === "art-gallery" && (
        <div className="no-print mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand font-semibold">
              DIREÇÃO VISUAL & ILUSTRAÇÕES
            </span>
            <h1 className="display mt-2 text-3xl sm:text-5xl text-ink">
              Gestão de Artes dos 30 Dias
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-ink-2">
              Todas as gravuras e ilustrações do manual. Você tem permissão total para trocar, fazer
              upload de novas artes ou restaurar as originais para cada um dos dias.
            </p>
            {Object.keys(customArts).length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-xs text-accent font-semibold">
                  {Object.keys(customArts).length} arte(s) personalizada(s) ativa(s)
                </span>
                <button
                  type="button"
                  onClick={resetAllArts}
                  className="flex items-center gap-1.5 rounded border border-rule px-3 py-1 font-mono text-xs text-ink-2 hover:text-brand hover:border-brand cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Restaurar Todas as Artes Padrão</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card da Capa do Livro (Dia 0) */}
            {(() => {
              const coverSrc = getArt(0);
              const isCoverCustom = Boolean((customArts as Record<number, string>)[0]);
              return (
                <div
                  key="cover-card"
                  className={`group rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-all ${currentTheme.card} ${currentTheme.border} ${isCoverCustom ? "ring-2 ring-accent/50" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-brand">CAPA DO LIVRO</span>
                      <span className="font-serif text-xs italic text-ink-2 truncate max-w-[150px]">
                        A Batalha
                      </span>
                    </div>

                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-rule bg-stone-900">
                      <img
                        src={coverSrc}
                        alt="Capa Principal do Livro"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="font-serif text-xs italic leading-tight line-clamp-2">
                          Imagem principal da capa e folha de rosto.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label className="flex w-full items-center justify-center gap-2 rounded border border-rule-strong bg-paper py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer">
                      <Upload className="size-3.5" />
                      <span>{isCoverCustom ? "Substituir Capa" : "Fazer Upload de Capa"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryUpload(0, e)}
                        className="hidden"
                      />
                    </label>

                    {isCoverCustom && (
                      <button
                        type="button"
                        onClick={() => resetArt(0)}
                        className="flex w-full items-center justify-center gap-1.5 py-1 text-xs text-brand hover:underline font-mono cursor-pointer"
                      >
                        <RotateCcw className="size-3" />
                        <span>Restaurar Capa Padrão</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {dias.map((d) => {
              const artSrc = getArt(d.n);
              const isCustom = Boolean((customArts as Record<number, string>)[d.n]);
              return (
                <div
                  key={d.n}
                  className={`group rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-all ${currentTheme.card} ${currentTheme.border} ${isCustom ? "ring-2 ring-accent/50" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-brand">
                        DIA {String(d.n).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-xs italic text-ink-2 truncate max-w-[150px]">
                        {d.tatica}
                      </span>
                    </div>

                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-rule bg-stone-900">
                      <img
                        src={artSrc}
                        alt={`Arte do Dia ${d.n}: ${d.tatica}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="font-serif text-xs italic leading-tight line-clamp-2">
                          {d.legenda}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label className="flex w-full items-center justify-center gap-2 rounded border border-rule-strong bg-paper py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer">
                      <Upload className="size-3.5" />
                      <span>{isCustom ? "Substituir Imagem" : "Fazer Upload de Imagem"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryUpload(d.n, e)}
                        className="hidden"
                      />
                    </label>

                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => resetArt(d.n)}
                        className="flex w-full items-center justify-center gap-1.5 py-1 text-xs text-brand hover:underline font-mono cursor-pointer"
                      >
                        <RotateCcw className="size-3" />
                        <span>Restaurar Padrão</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 4: CENTRAL DE EXPORTAÇÃO & DOSSIÊ PARA EDITORA */}
      {/* ========================================================================= */}
      {viewMode === "export-hub" && (
        <div className="no-print mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="text-center mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand font-semibold">
              PACOTE DIGITAL & COMERCIAL
            </span>
            <h1 className="display mt-2 text-3xl sm:text-5xl text-ink">
              Central de Exportação Editorial
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-ink-2">
              Arquivos prontos e validados para envio a editoras tradicionais, publicação direta na
              Amazon KDP (Kindle e Impresso) e exportação com todas as ilustrações incluídas.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Manuscrito Editorial */}
            <div
              className={`rounded-xl border p-6 flex flex-col justify-between shadow-xs ${currentTheme.card} ${currentTheme.border}`}
            >
              <div>
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <FileText className="size-5" />
                </div>
                <h3 className="display text-lg text-ink">Manuscrito Editorial</h3>
                <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                  Arquivo semântico completo com todos os 30 capítulos, front matter, ficha
                  catalográfica, ilustrações táticas integradas e fontes. Ideal para abrir no Word
                  (.docx), Google Docs ou enviar ao revisor/editor.
                </p>
              </div>
              <button
                onClick={handleDownloadHtmlManuscript}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-rule-strong bg-field py-2.5 font-mono text-xs uppercase tracking-wider text-ink hover:bg-paper-2 cursor-pointer"
              >
                <Download className="size-3.5 text-accent" />
                <span>Baixar Manuscrito (.html)</span>
              </button>
            </div>

            {/* Card 2: Pacote KDP / EPUB */}
            <div
              className={`rounded-xl border p-6 flex flex-col justify-between shadow-xs ${currentTheme.card} ${currentTheme.border} ring-2 ring-emerald-600/30`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-lg bg-emerald-800/10 flex items-center justify-center text-emerald-800">
                    <FileCode className="size-5" />
                  </div>
                  <span className="rounded bg-emerald-800/10 text-emerald-900 border border-emerald-700/30 px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider">
                    EPUB 3 + NCX
                  </span>
                </div>
                <h3 className="display text-lg text-ink">
                  E-book .EPUB (Kindle &amp; Apple Books)
                </h3>
                <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                  Arquivo binário <code>.epub</code> oficial e autônomo com todas as 30 ilustrações
                  embutidas, metadados OPF, sumário EPUB 3 / NCX, fidelidade tipográfica para e-ink
                  e suporte a modo escuro.
                </p>
                {exportandoEpub && epubProgress && (
                  <div className="mt-4 rounded-lg bg-paper-2 border border-rule p-3 text-xs">
                    <div className="flex items-center justify-between font-mono font-bold text-emerald-800 mb-1.5">
                      <span>{epubProgress.etapa}</span>
                      <span>{epubProgress.porcentagem}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-field">
                      <div
                        className="h-full bg-emerald-800 transition-all duration-300 rounded-full"
                        style={{ width: `${epubProgress.porcentagem}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleExportEpub}
                  disabled={exportandoEpub}
                  className="flex w-full items-center justify-center gap-2 rounded border border-emerald-700 bg-emerald-800 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className={`size-3.5 ${exportandoEpub ? "animate-bounce" : ""}`} />
                  <span>{exportandoEpub ? "Gerando EPUB..." : "Baixar E-book (.epub)"}</span>
                </button>
                <button
                  onClick={handleDownloadEpubPackage}
                  className="flex w-full items-center justify-center gap-1.5 py-1 text-[0.7rem] text-ink-2 hover:text-ink font-mono hover:underline cursor-pointer"
                >
                  <FileText className="size-3" />
                  <span>Baixar Versão Pacote HTML</span>
                </button>
              </div>
            </div>

            {/* Card 3: Dossiê Comercial */}
            <div
              className={`rounded-xl border p-6 flex flex-col justify-between shadow-xs ${currentTheme.card} ${currentTheme.border}`}
            >
              <div>
                <div className="size-10 rounded-lg bg-vale/10 flex items-center justify-center text-vale mb-4">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="display text-lg text-ink">Dossiê para Editora</h3>
                <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                  Proposta comercial pronta (Pitch Deck em Markdown) com dados da obra, sinopse,
                  diferenciais competitivos, público-alvo e biografia do autor.
                </p>
              </div>
              <button
                onClick={handleDownloadPitch}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-rule-strong bg-field py-2.5 font-mono text-xs uppercase tracking-wider text-ink hover:bg-paper-2 cursor-pointer"
              >
                <Download className="size-3.5 text-vale" />
                <span>Baixar Pitch (.md)</span>
              </button>
            </div>

            {/* Card 4: Auditoria Teológica NVI */}
            <div
              className={`rounded-xl border p-6 flex flex-col justify-between shadow-xs ${currentTheme.card} ${currentTheme.border} border-emerald-300/70 bg-emerald-50/20`}
            >
              <div>
                <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="display text-lg text-ink">Auditoria Teológica NVI</h3>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-emerald-800 uppercase">
                    100%
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                  Laudo de verificação de fidelidade exegética das passagens citadas contra o texto
                  canônico da NVI (© Biblica, Inc.) e cláusula de direitos para publicação.
                </p>
              </div>
              <button
                onClick={() => setViewMode("auditoria-nvi")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-emerald-700/40 bg-emerald-700/10 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-900 hover:bg-emerald-700/20 cursor-pointer"
              >
                <ShieldCheck className="size-3.5 text-emerald-800" />
                <span>Ver Laudo de Conformidade</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 5: TRILHA SONORA & VIDEOCLIPE OFICIAL */}
      {/* ========================================================================= */}
      {viewMode === "music" && (
        <div className="no-print mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <MusicaVideoSection />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 6: PAINEL ADMINISTRATIVO DE ARTES IA */}
      {/* ========================================================================= */}
      {viewMode === "admin-artes" && (
        <div className="no-print mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <PainelAdminArtes />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 7: AUDITORIA TEOLÓGICA & EXEGÉTICA NVI */}
      {/* ========================================================================= */}
      {viewMode === "auditoria-nvi" && (
        <div className="no-print mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <AuditoriaNVIView />
        </div>
      )}
    </div>
  );
}
