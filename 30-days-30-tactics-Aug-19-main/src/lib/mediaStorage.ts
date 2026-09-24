export interface MediaConfig {
  audioUrl: string | null;
  videoUrl: string | null;
  videoType: "file" | "youtube" | "cloud";
  youtubeUrl: string | null;
  updatedAt?: number;
}

const MEDIA_LOCAL_KEY = "abatalha_custom_media_config_v1";

/**
 * Converte URLs do YouTube (watch, youtu.be, shorts, etc) em URL de embed segura
 */
export function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    // Padrão curto: youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    }

    // Padrão longo: youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    }

    // Padrão shorts: youtube.com/shorts/ID
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    }

    // Padrão embed já formatado
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    return url;
  } catch {
    return url;
  }
}

/**
 * Carrega a configuração de mídia do servidor/disco e fallback local
 */
export async function loadMediaConfig(): Promise<MediaConfig> {
  const defaultConfig: MediaConfig = {
    audioUrl: null,
    videoUrl: null,
    videoType: "file",
    youtubeUrl: null,
  };

  // 1. Tenta carregar do servidor/disco físico
  try {
    if (typeof window !== "undefined") {
      const resp = await fetch("/api/media");
      if (resp.ok) {
        const data = (await resp.json()) as MediaConfig;
        if (data) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(MEDIA_LOCAL_KEY, JSON.stringify(data));
          }
          return data;
        }
      }
    }
  } catch (err) {
    console.warn("Aviso ao carregar mídia do servidor:", err);
  }

  // 2. Fallback do localStorage
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(MEDIA_LOCAL_KEY);
      if (stored) {
        return JSON.parse(stored) as MediaConfig;
      }
    }
  } catch {
    // Ignora
  }

  return defaultConfig;
}

/**
 * Salva áudio, vídeo ou link do YouTube de forma permanente
 */
export async function saveMediaItem(
  type: "audio" | "video" | "youtube",
  data: string,
  format?: string,
): Promise<MediaConfig> {
  try {
    if (typeof window !== "undefined") {
      const resp = await fetch("/api/save-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data, format }),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.config) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(MEDIA_LOCAL_KEY, JSON.stringify(json.config));
          }
          return json.config as MediaConfig;
        }
      }
    }
  } catch (err) {
    console.warn("Erro ao salvar mídia no servidor:", err);
  }

  // Fallback local se estiver offline
  const current = await loadMediaConfig();
  if (type === "audio") {
    current.audioUrl = data;
  } else if (type === "video") {
    current.videoUrl = data;
    current.videoType = "file";
  } else if (type === "youtube") {
    current.youtubeUrl = data;
    current.videoUrl = data;
    current.videoType = "youtube";
  }

  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem(MEDIA_LOCAL_KEY, JSON.stringify(current));
  }

  return current;
}

/**
 * Restaura mídia para o padrão
 */
export async function resetMediaItem(
  type: "audio" | "video" | "youtube" | "all",
): Promise<MediaConfig> {
  try {
    if (typeof window !== "undefined") {
      const resp = await fetch("/api/reset-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.config) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(MEDIA_LOCAL_KEY, JSON.stringify(json.config));
          }
          return json.config as MediaConfig;
        }
      }
    }
  } catch (err) {
    console.warn("Erro ao resetar mídia:", err);
  }

  const freshConfig: MediaConfig = {
    audioUrl: null,
    videoUrl: null,
    videoType: "file",
    youtubeUrl: null,
  };

  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem(MEDIA_LOCAL_KEY, JSON.stringify(freshConfig));
  }

  return freshConfig;
}

/**
 * Converte segundos para formato MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const LYRICS_SYNC_LOCAL_KEY = "abatalha_lyrics_sync_v1";

export interface CustomLyricsSync {
  [secaoIndex: number]: { tempoInicio: number; tempoFim: number };
}

export async function loadLyricsSync(): Promise<CustomLyricsSync> {
  try {
    if (typeof window !== "undefined") {
      const resp = await fetch("/api/lyrics-sync");
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === "object") {
          return data as CustomLyricsSync;
        }
      }
    }
  } catch {
    // Fallback local
  }
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(LYRICS_SYNC_LOCAL_KEY);
      if (stored) return JSON.parse(stored);
    }
  } catch {
    // Ignora erro de parsing local
  }
  return {};
}

export async function saveLyricsSync(syncData: CustomLyricsSync): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      await fetch("/api/save-lyrics-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(syncData),
      });
      if (window.localStorage) {
        localStorage.setItem(LYRICS_SYNC_LOCAL_KEY, JSON.stringify(syncData));
      }
    }
  } catch (err) {
    console.warn("Erro ao salvar sincronização de letras:", err);
  }
}
