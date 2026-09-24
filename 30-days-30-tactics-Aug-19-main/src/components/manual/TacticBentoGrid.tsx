"use client";

import React, { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useCustomArt } from "@/context/CustomArtContext";
import { indice } from "@/data/manual";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

export function TacticBentoGrid() {
  const { getArt } = useCustomArt();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const prontos = indice.filter((i) => i.pronto);

  return (
    <section className="relative w-full bg-[#050505] text-zinc-200 py-32 px-4 md:px-8 overflow-hidden isolate">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] bg-zinc-800/20 blur-[120px] rounded-[100%] pointer-events-none opacity-50 mix-blend-screen" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="mb-20">
          <span className="inline-block rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-medium text-zinc-400 mb-6">
            The Arsenal
          </span>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter text-white mb-6 drop-shadow-md">
            Os 30 Dias de Treino
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
            Trinta táticas reais forjadas na lâmina e fundamentadas na Palavra. Um dia por vez.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {prontos.map((item, index) => {
            // Asymmetrical Bento Logic
            // Make every 1st item wide, others square, or alternate predictably.
            let colSpan = "md:col-span-4";
            if (index % 5 === 0) colSpan = "md:col-span-8";
            else if (index % 7 === 0) colSpan = "md:col-span-12";
            
            return (
              <motion.div
                key={item.n}
                variants={itemVariants}
                className={`${colSpan} group`}
              >
                <Link
                  to="/dia/$n"
                  params={{ n: String(item.n) }}
                  className="block relative h-full active:scale-[0.98] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  {/* Outer Shell (Double Bezel) */}
                  <div className="h-full rounded-[2.5rem] bg-zinc-900/40 p-2 ring-1 ring-white/5 shadow-2xl transition-all duration-700 group-hover:bg-zinc-800/50">
                    {/* Inner Core */}
                    <div className="relative h-full flex flex-col overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      
                      {/* Image Container */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                          src={getArt(item.n)}
                          alt={`Tática ${item.n}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                        
                        <div className="absolute top-4 left-4 z-20">
                          <span className="font-mono text-xs font-bold tracking-[0.2em] text-white/90 drop-shadow-md">
                            {String(item.n).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-col flex-grow p-6 md:p-8 relative z-20 -mt-12">
                        <div className="flex-grow">
                          <h3 className="text-2xl md:text-3xl font-serif tracking-tight text-white mb-3 transition-colors duration-300 group-hover:text-amber-500">
                            {item.tatica}
                          </h3>
                          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                            {item.ensina}
                          </p>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-serif italic text-zinc-500">
                            <span className="opacity-70">📖</span>
                            <span>{item.passagem}</span>
                          </div>
                          
                          {/* Button-in-Button pattern */}
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:bg-amber-500/20">
                            <svg className="w-4 h-4 text-white/50 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
