import { createFileRoute, notFound } from "@tanstack/react-router";
import { DiaView } from "@/components/manual/DiaView";
import { Barra } from "@/components/manual/Barra";
import { dias } from "@/data/manual";

export const Route = createFileRoute("/dia/$n")({
  loader: ({ params }) => {
    const n = Number(params.n);
    const dia = dias.find((d) => d.n === n);
    if (!dia) throw notFound();
    return { dia };
  },
  head: ({ loaderData }) => {
    const dia = loaderData?.dia;
    const titulo = dia
      ? `Dia ${dia.n} · ${dia.tatica} — A Batalha`
      : "A Batalha — Manual de 30 dias";
    const desc = dia
      ? `${dia.lema}. Uma tática real de guerreiro japonês ligada à Palavra, para o seu dia de hoje.`
      : "Diário devocional de 30 dias.";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: desc },
        { property: "og:title", content: titulo },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Pagina,
});

function Pagina() {
  const { dia } = Route.useLoaderData();
  return (
    <>
      <Barra atual={dia.n} />
      <DiaView dia={dia} />
    </>
  );
}
