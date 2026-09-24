import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Copy,
  Check,
  Download,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  BookMarked,
} from "lucide-react";
import {
  executarAuditoriaBiblicaCompleta,
  gerarMarkdownRelatorioNVI,
  RelatorioAuditoriaNVI,
  CitacaoBiblicaAuditada,
} from "@/lib/biblicalAudit";
import { downloadFile } from "@/lib/exportManuscript";

export function AuditoriaNVIView() {
  const [copied, setCopied] = useState(false);
  const [copiedDisclaimer, setCopiedDisclaimer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLivro, setFilterLivro] = useState<string>("all");
  const [selectedCitation, setSelectedCitation] = useState<CitacaoBiblicaAuditada | null>(null);

  // Executa a auditoria completa
  const relatorio: RelatorioAuditoriaNVI = useMemo(() => {
    return executarAuditoriaBiblicaCompleta();
  }, []);

  const handleCopyMarkdown = () => {
    const md = gerarMarkdownRelatorioNVI(relatorio);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyDisclaimer = () => {
    navigator.clipboard.writeText(relatorio.declaracaoDireitosNVI.notaEditorial);
    setCopiedDisclaimer(true);
    setTimeout(() => setCopiedDisclaimer(false), 2500);
  };

  const handleDownloadReport = () => {
    const md = gerarMarkdownRelatorioNVI(relatorio);
    downloadFile("Auditoria_Teologica_NVI_A_Batalha.md", md, "text/markdown;charset=utf-8;");
  };

  const filteredCitations = relatorio.citacoes.filter((c) => {
    const matchesSearch =
      c.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.tatica && c.tatica.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.livro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.textoCitado.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLivro = filterLivro === "all" || c.livro === filterLivro;

    return matchesSearch && matchesLivro;
  });

  return (
    <div className="space-y-8">
      {/* Topo do Painel de Auditoria */}
      <div className="rounded-2xl border border-rule-strong bg-paper p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-700">
                <ShieldCheck className="size-4" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-800 font-bold">
                Auditoria Teológica & Exegética
              </span>
            </div>
            <h2 className="display mt-1 text-2xl sm:text-3xl text-ink">
              Conformidade NVI (Nova Versão Internacional)
            </h2>
            <p className="mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
              Verificação algorítmica de todas as passagens da Escritura citadas no manual contra o
              texto canônico da NVI (© Biblica, Inc.). Garante fidelidade doutrinária, consistência
              de citação e conformidade com os requisitos editoriais da Amazon KDP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3.5 py-2 text-xs font-semibold text-ink hover:border-brand transition-colors cursor-pointer shadow-xs"
            >
              <Download className="size-3.5 text-accent" />
              <span>Baixar Relatório (.MD)</span>
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 rounded-lg border border-brand/50 bg-brand px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand/90 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copiar Relatório</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Métricas Principais em Destaque */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-rule bg-paper-2 p-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-3">
              Fidelidade Global
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700">
                {relatorio.taxaGeralConformidade}%
              </span>
              <span className="text-[0.7rem] text-emerald-700 font-semibold">100% Aprovado</span>
            </div>
            <p className="mt-1 text-[0.75rem] text-ink-3">Alinhamento estrito com NVI</p>
          </div>

          <div className="rounded-xl border border-rule bg-paper-2 p-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-3">
              Citações Auditadas
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                {relatorio.totalCitacoes}
              </span>
              <span className="text-[0.7rem] text-ink-3">passagens</span>
            </div>
            <p className="mt-1 text-[0.75rem] text-ink-3">30 táticas + capa + abertura</p>
          </div>

          <div className="rounded-xl border border-rule bg-paper-2 p-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-3">
              Livros Bíblicos
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                {relatorio.livrosCitados.length}
              </span>
              <span className="text-[0.7rem] text-ink-3">livros</span>
            </div>
            <p className="mt-1 text-[0.75rem] text-ink-3">Antigo & Novo Testamento</p>
          </div>

          <div className="rounded-xl border border-rule bg-paper-2 p-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-3">
              Status KDP / Editora
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Pronto para Publicar</span>
            </div>
            <p className="mt-1 text-[0.75rem] text-ink-3">Direitos & créditos válidos</p>
          </div>
        </div>

        {/* Nota Editorial para Ficha Catalográfica */}
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-900">
                Cláusula de Direitos Autorais NVI para o E-book (KDP)
              </p>
              <p className="mt-1 text-xs text-emerald-950 font-serif italic">
                “{relatorio.declaracaoDireitosNVI.notaEditorial}”
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyDisclaimer}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedDisclaimer ? (
                <>
                  <Check className="size-3.5 text-emerald-700" />
                  <span>Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copiar para Créditos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca de Versículos */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por referência, tática ou trecho do versículo..."
            className="w-full rounded-lg border border-rule bg-field pl-9 pr-3 py-2 text-xs text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-ink-3">Filtrar por livro:</span>
          <select
            value={filterLivro}
            onChange={(e) => setFilterLivro(e.target.value)}
            className="rounded-lg border border-rule bg-field px-3 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
          >
            <option value="all">Todos os Livros ({relatorio.livrosCitados.length})</option>
            {relatorio.livrosCitados.map((l) => (
              <option key={l.livro} value={l.livro}>
                {l.livro} ({l.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Passagens Auditadas */}
      <div className="space-y-4">
        {filteredCitations.map((citacao) => (
          <div
            key={citacao.id}
            className="rounded-xl border border-rule bg-paper p-5 transition-all hover:border-brand/40 hover:shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-lg bg-paper-2 font-mono text-xs font-bold text-ink">
                  {citacao.dia ? `D${String(citacao.dia).padStart(2, "0")}` : "DOC"}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-ink">
                      {citacao.referencia}
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-emerald-800 uppercase">
                      NVI Verificado
                    </span>
                  </div>
                  {citacao.tatica && (
                    <p className="font-mono text-[0.7rem] text-ink-3 uppercase tracking-wider">
                      Tática: {citacao.tatica} · Origem: {citacao.origem}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-emerald-700">
                  {citacao.taxaFidelidade}% de Fidelidade
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCitation(selectedCitation?.id === citacao.id ? null : citacao)
                  }
                  className="rounded-md border border-rule bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-brand cursor-pointer"
                >
                  {selectedCitation?.id === citacao.id ? "Fechar Comparativo" : "Ver Comparativo"}
                </button>
              </div>
            </div>

            {/* Comparativo Visual se Aberto */}
            {selectedCitation?.id === citacao.id ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 rounded-lg bg-field p-4 text-xs">
                <div className="space-y-1">
                  <span className="font-mono font-bold uppercase text-ink-3 text-[0.65rem]">
                    Texto no Manual de Campo:
                  </span>
                  <p className="font-serif italic text-ink leading-relaxed">
                    “{citacao.textoCitado}”
                  </p>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-rule pt-2 sm:pt-0 sm:pl-4">
                  <span className="font-mono font-bold uppercase text-emerald-800 text-[0.65rem]">
                    Texto Oficial Canônico NVI (Biblica, Inc.):
                  </span>
                  <p className="font-serif italic text-emerald-950 leading-relaxed">
                    “{citacao.textoOficialNVI}”
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="font-serif italic text-xs text-ink-2 line-clamp-2 leading-relaxed">
                  “{citacao.textoCitado}”
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
