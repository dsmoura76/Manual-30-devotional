import { createFileRoute } from "@tanstack/react-router";
import { EbookView } from "@/components/manual/EbookView";

export const Route = createFileRoute("/ebook")({
  head: () => ({
    meta: [
      { title: "A Batalha — Livro Digital, E-Book & Manual KDP Completo" },
      {
        name: "description",
        content:
          "Livro digital completo e interior formatado para Amazon KDP e editoras. 30 táticas de samurai e Palavra por Daniel Shirazawa Moura.",
      },
      { property: "og:title", content: "A Batalha — Livro Digital & Manual KDP" },
      {
        property: "og:description",
        content:
          "Edição digital e manuscrito editorial completo de A Batalha: 30 dias de táticas reais de combate e fé.",
      },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EbookPage,
});

function EbookPage() {
  return <EbookView />;
}
