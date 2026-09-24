import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileDown, BookOpen } from "lucide-react";
import type { Dia } from "@/data/manual";
import { Escada } from "./Barra";
import { ArteVisualEquilibrio } from "./ArteVisualEquilibrio";

function useLocal<T>(key: string, inicial: T) {
  const [valor, setValor] = useState<T>(inicial);
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(key);
      if (bruto !== null) setValor(JSON.parse(bruto) as T);
    } catch {
      /* sem armazenamento disponível */
    }
  }, [key]);
  const salvar = (v: T) => {
    setValor(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignora */
    }
  };
  return [valor, salvar] as const;
}

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="display mb-4 flex items-center gap-3 text-sm tracking-[0.24em] text-ink-2">
      <span className="inline-block h-[2px] w-8 bg-brand" />
      {children}
    </h2>
  );
}

function Bloco({ children }: { children: React.ReactNode }) {
  return <section className="border-t border-rule py-10">{children}</section>;
}

export function DiaView({ dia }: { dia: Dia }) {
  const [escolha, setEscolha] = useLocal<number | null>(`ab-escolha-${dia.n}`, null);
  const [feitos, setFeitos] = useLocal<boolean[]>(
    `ab-marcha-${dia.n}`,
    dia.marcha.map(() => false),
  );
  const [texto, setTexto] = useLocal<string>(`ab-diario-${dia.n}`, "");

  const completo = feitos.length > 0 && feitos.every(Boolean);
  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24">
      {/* cabeçalho do dia */}
      <div className="pt-10">
        <Escada atual={dia.n} />
        <div className="mt-6 flex items-end gap-5">
          <span className="display text-[clamp(3.5rem,12vw,6rem)] leading-[0.8] text-brand">
            {String(dia.n).padStart(2, "0")}
          </span>
          <div className="pb-1">
            <h1 className="display text-[clamp(1.8rem,6vw,3rem)] text-ink">{dia.tatica}</h1>
            <p className="util mt-1">{dia.leitura}</p>
          </div>
        </div>
        <p className="mt-5 border-l-4 border-brand pl-4 font-display text-lg uppercase tracking-[0.06em] text-accent">
          {dia.lema}
        </p>
      </div>

      {/* arte e equilíbrio bíblico */}
      <ArteVisualEquilibrio dia={dia} />

      <Bloco>
        <Titulo>Reconhecimento</Titulo>
        <div className="prosa" dangerouslySetInnerHTML={{ __html: dia.reconhecimento }} />
        {dia.escolhas.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3" role="group">
            {dia.escolhas.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setEscolha(i)}
                className={`border p-4 text-left transition-colors ${
                  escolha === i
                    ? "border-brand bg-field"
                    : "border-rule bg-paper-2 hover:border-rule-strong"
                }`}
              >
                <strong className="display block text-xs tracking-[0.14em] text-ink">
                  {e.titulo}
                </strong>
                <span className="mt-1 block text-sm text-ink-2">{e.sub}</span>
              </button>
            ))}
          </div>
        )}
        {escolha !== null && dia.escolhas[escolha] && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 border-l-4 border-vale bg-field p-5 text-ink-2"
          >
            {dia.escolhas[escolha].resposta}
          </p>
        )}
      </Bloco>

      <Bloco>
        <Titulo>A tática</Titulo>
        <div className="prosa" dangerouslySetInnerHTML={{ __html: dia.taticaHtml }} />
      </Bloco>

      <Bloco>
        <Titulo>No combate</Titulo>
        <div className="prosa" dangerouslySetInnerHTML={{ __html: dia.combate }} />
      </Bloco>

      {dia.extras.map((x, i) => (
        <Bloco key={i}>
          <Titulo>{x.titulo}</Titulo>
          <div className="prosa" dangerouslySetInnerHTML={{ __html: x.html }} />
        </Bloco>
      ))}

      <Bloco>
        <Titulo>A marcha do dia</Titulo>
        <div className="prosa" dangerouslySetInnerHTML={{ __html: dia.marchaIntro }} />
        <ul className="mt-4 space-y-3">
          {dia.marcha.map((m, i) => (
            <li key={i}>
              <label
                className={`flex cursor-pointer gap-4 border p-4 transition-colors ${
                  feitos[i] ? "border-brand bg-field" : "border-rule bg-paper-2"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!feitos[i]}
                  onChange={() => setFeitos(feitos.map((f, j) => (j === i ? !f : f)))}
                  className="mt-1 size-5 shrink-0 accent-[oklch(0.463_0.176_27.5)]"
                />
                <span>
                  <strong className="display block text-xs tracking-[0.14em] text-accent">
                    {m.titulo}
                  </strong>
                  <span className="mt-1 block text-ink-2">{m.texto}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <div
            aria-hidden="true"
            className={`grid size-20 shrink-0 place-items-center border-4 transition-opacity ${
              completo ? "border-brand opacity-100" : "border-rule opacity-35"
            }`}
          >
            <span
              className={`font-util text-2xl tracking-widest ${completo ? "text-brand" : "text-ink-3"}`}
            >
              {String(dia.n).padStart(2, "0")}
            </span>
          </div>
          <p className="util max-w-xs normal-case">
            {completo
              ? `Dia ${dia.n} carimbado. Você marchou hoje.`
              : `Cumpra as três para carimbar o dia ${dia.n}.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setFeitos(dia.marcha.map(() => false));
              setTexto("");
              setEscolha(null);
            }}
            className="util ml-auto border border-rule-strong px-3 py-2 hover:bg-paper-2"
          >
            Limpar dia
          </button>
        </div>
      </Bloco>

      <Bloco>
        <Titulo>Caderno de campo</Titulo>
        <p className="prosa">
          <span className="pergunta block">{dia.cadernoPergunta}</span>
        </p>
        <label htmlFor={`t-${dia.n}`} className="util">
          Escreva sem editar. Ninguém vai ler isso.
        </label>
        <textarea
          id={`t-${dia.n}`}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={dia.placeholder}
          rows={7}
          className="mt-2 w-full resize-y border border-rule-strong bg-field p-4 font-body text-ink outline-none focus:border-brand"
        />
        <div className="mt-1 flex justify-between">
          <span className="util">{palavras} palavras</span>
          <span className="util">Salvo neste aparelho</span>
        </div>

        {dia.oracao && (
          <div className="mt-8 border border-vale bg-field p-6">
            <h3 className="display text-xs tracking-[0.24em] text-vale">Oração guiada</h3>
            <p
              className="prosa mt-3"
              dangerouslySetInnerHTML={{ __html: `<p>${dia.oracao}</p>` }}
            />
          </div>
        )}
      </Bloco>

      {dia.fontes && (
        <Bloco>
          <Titulo>Fontes deste dia</Titulo>
          <div className="prosa" dangerouslySetInnerHTML={{ __html: dia.fontes }} />
        </Bloco>
      )}

      {/* Exportação & E-Book */}
      <div className="mt-12 rounded-xl border border-rule-strong bg-paper-2 p-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-4 shadow-xs">
        <div>
          <span className="font-mono text-[0.68rem] uppercase font-bold tracking-wider text-brand">
            Manual Completo dos 30 Dias
          </span>
          <p className="mt-1 font-serif text-sm italic text-ink">
            Gostaria de imprimir ou ler o livro inteiro com todas as 30 táticas diagramadas?
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-center gap-2">
          <a
            href="/ebook?print=true"
            className="inline-flex items-center gap-1.5 rounded border border-brand bg-brand px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-2xs hover:bg-brand/90 transition-all cursor-pointer"
          >
            <FileDown className="size-3.5" />
            <span>Exportar como PDF</span>
          </a>
          <Link
            to="/ebook"
            className="inline-flex items-center gap-1.5 rounded border border-rule bg-paper px-3 py-1.5 font-mono text-xs text-ink-2 hover:text-ink transition-colors"
          >
            <BookOpen className="size-3.5" />
            <span>Leitor Digital</span>
          </Link>
        </div>
      </div>

      <nav className="mt-10 flex items-center justify-between border-t border-rule pt-6">
        {dia.n > 1 ? (
          <Link to="/dia/$n" params={{ n: String(dia.n - 1) }} className="util text-accent">
            ← Dia {dia.n - 1}
          </Link>
        ) : (
          <Link to="/" className="util text-accent">
            ← Capa
          </Link>
        )}
        {dia.n < 30 ? (
          <Link to="/dia/$n" params={{ n: String(dia.n + 1) }} className="util text-accent">
            Dia {dia.n + 1} →
          </Link>
        ) : (
          <Link to="/" hash="indice" className="util text-accent">
            Índice →
          </Link>
        )}
      </nav>
    </article>
  );
}
