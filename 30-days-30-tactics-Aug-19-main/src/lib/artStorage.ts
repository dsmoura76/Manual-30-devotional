/**
 * Sistema de Persistência Permanente de Artes Visuais e Otimização de Imagens
 * Utiliza IndexedDB para armazenamento persistente de alta capacidade (centenas de MB/GB),
 * evitando as limitações e quotas rígidas (5MB) do localStorage.
 */

const DB_NAME = "ABatalha_Art_DB";
const DB_VERSION = 1;
const STORE_NAME = "custom_arts";
const LOCAL_STORAGE_KEY = "ab-custom-arts-v1";

interface ArtRecord {
  dia: number;
  data: string;
  updatedAt: number;
}

/**
 * Abre a conexão com o banco de dados IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB não está disponível neste ambiente."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "dia" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error("Erro ao abrir IndexedDB"));
    };
  });
}

/**
 * Otimiza e comprime uma imagem (DataURL ou File) para garantir alta fidelidade visual
 * e armazenamento eficiente, reduzindo arquivos pesados de 5-15MB para ~150-300KB.
 */
export async function optimizeImageForStorage(
  source: string | File,
  maxDimension = 1600,
  quality = 0.88,
): Promise<string> {
  // Se for uma URL externa http/https, mantém como está
  if (
    typeof source === "string" &&
    (source.startsWith("http://") || source.startsWith("https://"))
  ) {
    return source.trim();
  }

  return new Promise((resolve, reject) => {
    let dataUrlPromise: Promise<string>;

    if (typeof source === "string") {
      dataUrlPromise = Promise.resolve(source);
    } else {
      dataUrlPromise = new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target?.result as string);
        reader.onerror = (e) => rej(e);
        reader.readAsDataURL(source);
      });
    }

    dataUrlPromise
      .then((rawUrl) => {
        if (typeof window === "undefined") {
          resolve(rawUrl);
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          let { width, height } = img;

          // Se a imagem for maior que a dimensão máxima (HD para livros/e-readers), redimensiona proporcionalmente
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(rawUrl);
            return;
          }

          // Preenchimento de fundo para evitar transparências pretas ao converter para JPEG
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Gera imagem JPEG otimizada
          try {
            const optimized = canvas.toDataURL("image/jpeg", quality);
            resolve(optimized);
          } catch {
            resolve(rawUrl);
          }
        };

        img.onerror = () => {
          // Se falhar o carregamento do canvas, preserva o rawUrl original
          resolve(rawUrl);
        };

        img.src = rawUrl;
      })
      .catch(reject);
  });
}

/**
 * Carrega todas as artes personalizadas do IndexedDB (com migração e fallback do localStorage)
 */
export async function loadAllCustomArts(): Promise<Record<number, string>> {
  const result: Record<number, string> = {};

  // 1. Tenta carregar do localStorage primeiro para exibição imediata
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.keys(parsed).forEach((k) => {
          const n = Number(k);
          if (!isNaN(n) && parsed[k]) {
            result[n] = parsed[k];
          }
        });
      }
    }
  } catch (e) {
    console.warn("Erro ao ler fallback do localStorage:", e);
  }

  // 2. Carrega do IndexedDB (fonte de verdade definitiva de alta capacidade)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const records: ArtRecord[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    // Se houver dados no IndexedDB, sobrescreve o resultado com os dados persistidos
    if (records.length > 0) {
      records.forEach((rec) => {
        if (rec.dia !== undefined && rec.data) {
          result[rec.dia] = rec.data;
        }
      });
    } else if (Object.keys(result).length > 0) {
      // Se tinha dados no localStorage mas nada no IndexedDB, migra automaticamente para o IndexedDB
      const writeTx = db.transaction(STORE_NAME, "readwrite");
      const writeStore = writeTx.objectStore(STORE_NAME);
      Object.entries(result).forEach(([k, data]) => {
        writeStore.put({ dia: Number(k), data, updatedAt: Date.now() });
      });
    }
  } catch (err) {
    console.warn("IndexedDB não disponível no carregamento inicial, usando cache local:", err);
  }

  return result;
}

/**
 * Salva uma arte personalizada no IndexedDB e sincroniza com o cache local
 */
export async function saveCustomArt(dia: number, dataUrlOrUrl: string): Promise<string> {
  const optimizedData = await optimizeImageForStorage(dataUrlOrUrl);

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const req = store.put({
        dia,
        data: optimizedData,
        updatedAt: Date.now(),
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Erro ao salvar no IndexedDB:", err);
  }

  // Tenta manter um espelho no localStorage se o tamanho permitir
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const current = stored ? JSON.parse(stored) : {};
      current[dia] = optimizedData;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // Quota do localStorage pode ser atingida, o que é esperado; o IndexedDB é o armazenamento primário.
  }

  return optimizedData;
}

/**
 * Remove a arte personalizada de um dia específico (restaurando o padrão)
 */
export async function deleteCustomArt(dia: number): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const req = store.delete(dia);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Erro ao deletar no IndexedDB:", err);
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const current = JSON.parse(stored);
        delete current[dia];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
      }
    }
  } catch {
    // Ignora
  }
}

/**
 * Remove todas as artes personalizadas (restaura todas para o padrão)
 */
export async function clearAllCustomArts(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Erro ao limpar IndexedDB:", err);
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch {
    // Ignora
  }
}
