import { useState, useEffect, useCallback } from "react";

export function useCaderno() {
  const [notas, setNotas] = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const carregadas: Record<number, string> = {};
      for (let i = 1; i <= 30; i++) {
        const item = localStorage.getItem(`ab-diario-${i}`);
        if (item) {
          try {
            carregadas[i] = JSON.parse(item);
          } catch {
            carregadas[i] = item;
          }
        }
      }
      setNotas(carregadas);
    } catch {
      // Storage indisponível
    }
  }, []);

  const salvarNota = useCallback((dia: number, texto: string) => {
    setNotas((prev) => ({ ...prev, [dia]: texto }));
    try {
      localStorage.setItem(`ab-diario-${dia}`, JSON.stringify(texto));
    } catch {
      // ignora
    }
  }, []);

  return {
    notas,
    salvarNota,
  };
}
