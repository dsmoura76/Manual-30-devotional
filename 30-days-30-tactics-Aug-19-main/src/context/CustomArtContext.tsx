import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { arte as defaultArte, capaArte } from "@/data/manual";
import {
  loadAllCustomArts,
  saveCustomArt,
  deleteCustomArt,
  clearAllCustomArts,
} from "@/lib/artStorage";

interface CustomArtContextType {
  customArts: Record<number, string>;
  isLoaded: boolean;
  getArt: (dia: number) => string;
  getCapaArt: () => string;
  setArt: (dia: number, dataUrlOrUrl: string) => Promise<string>;
  resetArt: (dia: number) => Promise<void>;
  resetAllArts: () => Promise<void>;
  isCustom: (dia: number) => boolean;
}

const CustomArtContext = createContext<CustomArtContextType | undefined>(undefined);

export function CustomArtProvider({ children }: { children: React.ReactNode }) {
  const [customArts, setCustomArts] = useState<Record<number, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadAllCustomArts()
      .then((arts) => {
        if (active) {
          setCustomArts(arts);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.warn("Erro ao carregar artes customizadas:", err);
        if (active) setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const getArt = useCallback(
    (dia: number): string => {
      if (customArts[dia]) {
        return customArts[dia];
      }
      if (dia === 0) {
        return capaArte;
      }
      return defaultArte[dia] || defaultArte[1] || "";
    },
    [customArts],
  );

  const getCapaArt = useCallback((): string => {
    return customArts[0] || capaArte;
  }, [customArts]);

  const isCustom = useCallback(
    (dia: number): boolean => {
      return Boolean(customArts[dia]);
    },
    [customArts],
  );

  const setArt = useCallback(async (dia: number, dataUrlOrUrl: string): Promise<string> => {
    // Atualização otimista imediata para evitar qualquer lag visual
    setCustomArts((prev) => ({ ...prev, [dia]: dataUrlOrUrl }));

    // Otimiza e persiste no IndexedDB permanentemente
    try {
      const optimized = await saveCustomArt(dia, dataUrlOrUrl);
      setCustomArts((prev) => ({ ...prev, [dia]: optimized }));
      return optimized;
    } catch (err) {
      console.error("Erro ao persistir arte no IndexedDB:", err);
      return dataUrlOrUrl;
    }
  }, []);

  const resetArt = useCallback(async (dia: number): Promise<void> => {
    setCustomArts((prev) => {
      const next = { ...prev };
      delete next[dia];
      return next;
    });

    try {
      await deleteCustomArt(dia);
    } catch (err) {
      console.error("Erro ao resetar arte no IndexedDB:", err);
    }
  }, []);

  const resetAllArts = useCallback(async (): Promise<void> => {
    setCustomArts({});
    try {
      await clearAllCustomArts();
    } catch (err) {
      console.error("Erro ao limpar artes no IndexedDB:", err);
    }
  }, []);

  return (
    <CustomArtContext.Provider
      value={{
        customArts,
        isLoaded,
        getArt,
        getCapaArt,
        setArt,
        resetArt,
        resetAllArts,
        isCustom,
      }}
    >
      {children}
    </CustomArtContext.Provider>
  );
}

export function useCustomArt() {
  const context = useContext(CustomArtContext);
  if (!context) {
    // Retorno fallback seguro caso esteja fora do provider
    return {
      customArts: {},
      isLoaded: true,
      getArt: (dia: number) => (dia === 0 ? capaArte : defaultArte[dia] || defaultArte[1]),
      getCapaArt: () => capaArte,
      setArt: async () => "",
      resetArt: async () => {},
      resetAllArts: async () => {},
      isCustom: () => false,
    };
  }
  return context;
}
