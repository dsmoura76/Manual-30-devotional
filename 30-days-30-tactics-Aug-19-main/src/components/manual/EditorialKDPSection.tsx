"use client";

import React from "react";
import { Link } from "@tanstack/react-router";
import { FileDown, BookOpen } from "lucide-react";

export function EditorialKDPSection() {
  return (
    <section className="relative w-full bg-[#050505] py-32 px-4 md:px-8 border-t border-white/5 isolate">
      {/* Noise Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Massive Typography */}
        <div className="w-full lg:w-1/2">
          <span className="inline-block rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-medium text-amber-500 mb-6">
            Produto Digital & KDP
          </span>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter text-white leading-[1.1] mb-8">
            O Manuscrito <br />
            <span className="text-zinc-600">Completo.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-light mb-12">
            Acesse a versão formatada para leitura digital contínua, visualize o miolo
            diagramado para impressão (6" x 9") ou baixe o dossiê comercial para publicação na Amazon KDP.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Liquid Glass Button */}
            <a
              href="/ebook?print=true"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 rounded-full border border-white/10 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800 active:scale-[0.98] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <FileDown className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold tracking-widest text-white uppercase">Exportar PDF</span>
            </a>

            <Link
              to="/ebook"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent rounded-full border border-white/10 hover:border-white/30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              <span className="text-sm font-semibold tracking-widest text-zinc-300 uppercase group-hover:text-white transition-colors">Central KDP</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Double-Bezel Tech Specs */}
        <div className="w-full lg:w-1/2">
          {/* Outer Shell */}
          <div className="rounded-[2.5rem] bg-zinc-900/40 p-2 ring-1 ring-white/5 shadow-2xl backdrop-blur-3xl">
            {/* Inner Core */}
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 md:p-12">
              <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                
                <div>
                  <div className="text-4xl font-serif text-white mb-2">30</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Capítulos Formatados</div>
                </div>
                
                <div>
                  <div className="text-4xl font-serif text-white mb-2">6"×9"</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Padrão KDP Trade</div>
                </div>
                
                <div>
                  <div className="text-4xl font-serif text-amber-500 mb-2">EPUB</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Pronto para Kindle</div>
                </div>
                
                <div>
                  <div className="text-4xl font-serif text-amber-500 mb-2">PDF</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Impressão Editorial</div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
