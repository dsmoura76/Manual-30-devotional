import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Music,
  Video,
  Sparkles,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Crown,
  Radio,
  FileText,
  Upload,
} from "lucide-react";
import { musicaData } from "@/data/musica";

export function MusicaVideoSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "letra">("video");
  const [copiado, setCopiado] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleCopyLetra = () => {
    const textoCompleto = musicaData.letra
      .map((secao) => `[${secao.secao}]\n${secao.versos.join("\n")}`)
      .join("\n\n");
    const header = `A BATALHA — ${musicaData.autor}\nInspiração Bíblica: ${musicaData.referenciaBiblica}\n\n`;
    navigator.clipboard.writeText(header + textoCompleto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setIsPlayingAudio(false);
      setShowUploadModal(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setShowUploadModal(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.warn("Autoplay bloqueado ou arquivo não pronto:", err);
        });
    }
  };

  return (
    <section className="mt-16 overflow-hidden rounded-2xl border border-rule-strong bg-panel/80 shadow-md">
      {/* Cabeçalho do Bloco Musical */}
      <div className="border-b border-rule bg-paper-2/90 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Music className="size-5" />
            </div>
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand font-bold">
                TRILHA & CANÇÃO INSPIRADORA
              </span>
              <h2 className="display text-xl sm:text-2xl text-ink">
                A Batalha · Canção & Videoclipe Oficial
              </h2>
            </div>
          </div>

          {/* Abas do Player */}
          <div className="flex items-center rounded-lg border border-rule bg-paper p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Video className="size-3.5" />
              <span>Videoclipe Épico</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("audio")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all cursor-pointer ${
                activeTab === "audio"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Radio className="size-3.5" />
              <span>Música & Hino</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("letra")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all cursor-pointer ${
                activeTab === "letra"
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <FileText className="size-3.5" />
              <span>Letra Completa</span>
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA DE EXIBIÇÃO: VÍDEO / ÁUDIO / LETRA */}
      <div className="p-6 sm:p-8">
        {activeTab === "video" && (
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-rule bg-stone-950 shadow-inner">
              {customVideoUrl ? (
                <video src={customVideoUrl} controls className="h-full w-full object-cover" />
              ) : (
                /* Player Atmosférico com Arte do Clipe */
                <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
                  {/* Fundo Cinemático com Gradiente Escuro */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800/60 via-stone-950 to-stone-950" />

                  {/* Selo Central */}
                  <div className="relative z-10 flex flex-col items-center max-w-lg">
                    <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-brand/20 border border-brand/40 text-brand shadow-lg animate-pulse">
                      <Crown className="size-7" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand">
                      Salmos 93.1 · NVI
                    </span>
                    <h3 className="display mt-1 text-2xl sm:text-3xl text-stone-100">
                      “O Senhor reina! O mundo está firme e não se abalará.”
                    </h3>
                    <p className="mt-2 text-xs text-stone-400">
                      Videoclipe Oficial · Letra & Música por <strong>{musicaData.autor}</strong>
                    </p>

                    {/* Botões de Ação do Vídeo */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-brand/50 bg-brand px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand/90 transition-colors cursor-pointer"
                      >
                        <Upload className="size-4" />
                        <span>Carregar Arquivo de Vídeo (MP4/WebM)</span>
                      </button>
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ficha da Canção */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-rule bg-paper p-4 text-xs">
              <div>
                <p className="font-mono font-bold text-ink uppercase tracking-wider">
                  {musicaData.titulo} — {musicaData.autor}
                </p>
                <p className="text-ink-2 mt-0.5">{musicaData.descricao}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-accent/10 px-2 py-1 font-mono text-[0.7rem] text-accent font-semibold">
                  {musicaData.contato.studio}
                </span>
                <span className="font-mono text-ink-3">Contato: {musicaData.contato.email}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audio" && (
          <div className="space-y-6">
            {/* Player de Áudio Estilizado */}
            <div className="relative overflow-hidden rounded-xl border-2 border-brand/20 bg-gradient-to-br from-paper to-field p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                    <Music className="size-8" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-brand font-semibold">
                      Áudio Oficial Masterizado
                    </span>
                    <h3 className="display text-2xl text-ink">{musicaData.titulo}</h3>
                    <p className="font-serif italic text-sm text-ink-2">
                      Composição e Voz: {musicaData.autor}
                    </p>
                  </div>
                </div>

                {/* Controles de Playback */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="flex size-12 items-center justify-center rounded-full bg-brand text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    title={isPlayingAudio ? "Pausar" : "Reproduzir Música"}
                  >
                    {isPlayingAudio ? (
                      <Pause className="size-6" />
                    ) : (
                      <Play className="size-6 ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2 text-xs font-medium text-ink hover:border-brand cursor-pointer"
                  >
                    <Upload className="size-3.5 text-accent" />
                    <span>Carregar Arquivo MP3/WAV</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {customAudioUrl && (
                <div className="mt-6 border-t border-rule/60 pt-4">
                  <audio
                    ref={audioRef}
                    src={customAudioUrl}
                    controls
                    className="w-full"
                    onPlay={() => setIsPlayingAudio(true)}
                    onPause={() => setIsPlayingAudio(false)}
                  />
                </div>
              )}
            </div>

            {/* Citação Teológica da Canção */}
            <div className="rounded-xl border-l-4 border-accent bg-field p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                O Fundamento da Mensagem
              </p>
              <p className="mt-2 font-serif text-base italic text-ink leading-relaxed">
                “Quando o medo bate e o chão treme embaixo, Tua Palavra é rocha, meu porto, meu
                espaço. Mesmo ferido, sigo sem parar; Teu amor me ergue, me faz avançar.”
              </p>
              <p className="mt-1 font-mono text-xs text-ink-3">
                — Daniel Shirazawa Moura (A Batalha)
              </p>
            </div>
          </div>
        )}

        {activeTab === "letra" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
              <div>
                <h3 className="display text-xl text-ink">Letra Completa · A Batalha</h3>
                <p className="text-xs text-ink-2">
                  Letra & Música: <strong>{musicaData.autor}</strong> · Salmos 93.1
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyLetra}
                className="flex items-center gap-2 rounded-lg border border-rule bg-paper px-4 py-2 text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer"
              >
                {copiado ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Letra Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copiar Letra Completa</span>
                  </>
                )}
              </button>
            </div>

            {/* Versos em Grade Elegante */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {musicaData.letra.map((bloco, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-rule bg-paper p-5 shadow-xs transition-shadow hover:shadow-sm"
                >
                  <span className="inline-block rounded bg-brand/10 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-brand uppercase tracking-wider mb-3">
                    {bloco.secao}
                  </span>
                  <div className="space-y-1.5 font-serif text-sm text-ink leading-relaxed">
                    {bloco.versos.map((verso, vIdx) => (
                      <p
                        key={vIdx}
                        className={
                          bloco.secao.toLowerCase().includes("refrão")
                            ? "font-semibold text-accent"
                            : ""
                        }
                      >
                        {verso}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
