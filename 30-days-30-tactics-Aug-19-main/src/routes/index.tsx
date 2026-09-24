import { createFileRoute, Link } from "@tanstack/react-router";
import { Barra } from "@/components/manual/Barra";
import { MusicaVideoSection } from "@/components/manual/MusicaVideoSection";
import { abertura, capaTexto, indice, substitutas } from "@/data/manual";
import { CinematicHero } from "@/components/manual/CinematicHero";
import { TacticBentoGrid } from "@/components/manual/TacticBentoGrid";
import { EditorialKDPSection } from "@/components/manual/EditorialKDPSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Batalha — Diário de 30 dias de táticas de samurai e Palavra" },
      {
        name: "description",
        content:
          "Trinta táticas reais de samurai, em trinta dias, para você andar com Deus enquanto o mar ainda ruge. Diário devocional cristão em português.",
      },
      { property: "og:title", content: "A Batalha — Diário de 30 dias" },
      {
        property: "og:description",
        content:
          "Trinta táticas reais de samurai ligadas à Palavra, um dia por vez. Salmos 93.1 · NVI.",
      },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Capa,
});

function Capa() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <Barra />

      {/* ---------- CAPA ---------- */}
      <CinematicHero 
        bookTitle={capaTexto.titulo}
        bookSubtitle={capaTexto.subtitulo}
      />

      {/* ---------- ANTES DO DIA 1 ---------- */}
      <section className="relative w-full bg-[#050505] py-32 px-4 md:px-8 border-t border-white/5 isolate">
        <div className="max-w-[1000px] mx-auto text-center">
          <span className="inline-block rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-medium text-amber-500 mb-8">
            {abertura.nota}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tighter text-white mb-12 drop-shadow-md">
            {abertura.titulo}
          </h2>
          <div className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto space-y-6">
            {abertura.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          
          <figure className="mt-16 inline-block text-center border-t border-b border-white/10 py-12 px-8">
            <p className="font-serif text-2xl md:text-3xl italic tracking-tight text-white mb-4">
              "{abertura.citacao}"
            </p>
            <figcaption className="text-sm font-mono uppercase tracking-widest text-zinc-500">
              — {abertura.citacaoFonte}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- DIAS PRONTOS (High-End Bento) ---------- */}
      <TacticBentoGrid />

      {/* ---------- ÍNDICE DAS 30 (Minimalist List) ---------- */}
      <section id="indice" className="relative w-full bg-[#050505] py-32 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tighter text-white">Índice das 30 táticas</h2>
              <p className="text-sm font-mono uppercase tracking-widest text-zinc-500 mt-4">Manual Completo e Verificado</p>
            </div>
            <p className="text-sm text-zinc-400 max-w-xs font-light leading-relaxed">
              Nome · o que ensina · passagem. Baseadas no texto bíblico NVI.
            </p>
          </div>

          <ul className="divide-y divide-white/10">
            {indice.map((i) => (
              <li
                key={i.n}
                className="group flex flex-col sm:flex-row gap-6 sm:items-center py-6 hover:bg-white/[0.02] transition-colors duration-300 px-4 -mx-4 rounded-xl cursor-pointer"
              >
                <span className="text-3xl font-serif text-zinc-600 group-hover:text-amber-500 transition-colors duration-300 w-16">
                  {String(i.n).padStart(2, "0")}
                </span>
                <div className="flex-grow">
                  <Link
                    to="/dia/$n"
                    params={{ n: String(i.n) }}
                    className="text-xl md:text-2xl font-serif text-zinc-200 group-hover:text-white transition-colors duration-300 block mb-1"
                  >
                    {i.tatica}
                  </Link>
                  <p className="text-sm text-zinc-500 font-light">{i.ensina}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300">
                    {i.passagem}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-24">
            <MusicaVideoSection />
          </div>
        </div>
      </section>

      {/* ---------- EDIÇÃO KDP & E-BOOK EDITORIAL ---------- */}
      <EditorialKDPSection />

      {/* ---------- SUBSTITUTAS ---------- */}
      <section className="bg-zinc-950 py-24 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-2xl font-serif tracking-tighter text-white mb-8">Banco de Táticas Verificadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {substitutas.map((s) => (
              <div key={s.nome} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-serif text-white mb-2">{s.nome}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">{s.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#050505] border-t border-white/10 py-16 px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Passagens bíblicas: Nova Versão Internacional (NVI), © Biblica, Inc. A grafia dos
              versículos ainda deve ser conferida contra edição oficial antes da impressão.
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Se o tema de algum dia tocar em algo grande demais para carregar sozinho — abuso,
              depressão, perigo, pensamentos de morte — procure ajuda real hoje. No Brasil, o CVV atende pelo 188, 24 horas. Isso também é obediência.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">{capaTexto.rodape}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
