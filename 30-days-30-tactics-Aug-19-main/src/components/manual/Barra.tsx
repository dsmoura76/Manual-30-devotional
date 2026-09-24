import { Link } from "@tanstack/react-router";
import { BookOpen, FileDown, Printer } from "lucide-react";

export function Barra({ atual }: { atual?: number }) {
  const handleExportPdf = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/ebook") {
        window.print();
      } else {
        window.location.href = "/ebook?print=true";
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-sm no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="display text-lg tracking-[0.14em] text-ink hover:text-accent">
            A Batalha
          </Link>
          <Link
            to="/ebook"
            className="hidden sm:inline-flex items-center gap-1 rounded bg-brand/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-brand font-semibold hover:bg-brand/20 transition-colors"
          >
            <BookOpen className="size-3" />
            <span>KDP & E-Book</span>
          </Link>
        </div>
        <p className="util hidden md:block">
          {atual ? `Dia ${String(atual).padStart(2, "0")} de 30` : "Manual de Tacticas · 30 dias"}
        </p>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleExportPdf}
            title="Exportar manual formatado como PDF de alta qualidade"
            className="inline-flex items-center gap-1.5 rounded border border-brand bg-brand px-2.5 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-2xs transition-all hover:bg-brand/90 cursor-pointer"
          >
            <FileDown className="size-3.5" />
            <span>Exportar como PDF</span>
          </button>
          <Link to="/ebook" className="sm:hidden util text-brand font-semibold">
            E-Book
          </Link>
          <Link to="/" hash="indice" className="util text-accent">
            Índice
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Escada({ atual }: { atual: number }) {
  return (
    <div
      role="img"
      aria-label={`Progresso: dia ${atual} de 30`}
      className="flex h-2 w-full gap-[2px]"
    >
      {Array.from({ length: 30 }, (_, i) => (
        <span
          key={i}
          className={`h-full flex-1 ${
            i < atual ? "bg-brand" : i === atual ? "bg-rule-strong" : "bg-rule"
          }`}
        />
      ))}
    </div>
  );
}
