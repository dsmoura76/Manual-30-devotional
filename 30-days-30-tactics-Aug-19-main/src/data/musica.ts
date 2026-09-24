export interface MusicaInspiracao {
  titulo: string;
  subtitulo: string;
  autor: string;
  referenciaBiblica: string;
  descricao: string;
  letra: {
    secao: string;
    versos: string[];
  }[];
  videoUrlPlaceholder?: string;
  contato: {
    email: string;
    telefone: string;
    studio: string;
  };
}

export const musicaData: MusicaInspiracao = {
  titulo: "A Batalha",
  subtitulo: "A Canção Oficial que Deu Origem ao Manual de Campo",
  autor: "Daniel Shirazawa Moura",
  referenciaBiblica: "Salmos 93.1 · NVI",
  descricao:
    "Composta em profunda oração e pesquisa sobre a soberania de Deus no meio da tempestade. A música une a força épica do guerreiro de armadura samurai com a entrega absoluta ao Rei dos reis.",
  contato: {
    email: "dannysmoura@gmail.com",
    telefone: "+55 11 99458 0145",
    studio: "SHIRABILLISTUDIO / Records",
  },
  letra: [
    {
      secao: "Intro",
      versos: [
        "No meio da noite, ouço o céu rugir",
        "Tua voz acende a fé dentro de mim",
        "Mesmo em meio ao caos, não vou recuar",
        "Pois sei quem Tu és, e onde vou estar",
      ],
    },
    {
      secao: "Estrofe 1",
      versos: [
        "Quando o medo bate e o chão treme embaixo",
        "Tua Palavra é rocha, meu porto, meu espaço",
        "Mesmo ferido, sigo sem parar",
        "Teu amor me ergue, me faz avançar",
      ],
    },
    {
      secao: "Refrão",
      versos: [
        "Reina sobre tudo, és o grande Eu Sou",
        "Nenhum nome é maior, Teu poder me alcançou",
        "Nas alturas ou vales, nunca estou só",
        "Tu és o Senhor, meu tudo, meu farol!",
      ],
    },
    {
      secao: "Estrofe 2",
      versos: [
        "Se as portas se fecham, eu continuo a marchar",
        "Pois o céu me garante ninguém vai me parar",
        "Tua graça me guia, Tua luz me conduz",
        "Caminho em vitória, no nome de Jesus!",
      ],
    },
    {
      secao: "Ponte",
      versos: [
        "Santo, santo, toda terra vai cantar",
        "Glória ao Cordeiro que venceu sem vacilar",
        "Mesmo quando tudo parece ruir",
        "Tua presença me faz resistir",
      ],
    },
    {
      secao: "Refrão Final",
      versos: [
        "Reina sobre tudo, És O Grande Eu Sou",
        "Nenhum nome é maior, Teu poder me alcançou",
        "Nas alturas ou vales, nunca estou só",
        "Tu és o Senhor meu tudo, meu farol!",
      ],
    },
    {
      secao: "Outro",
      versos: [
        "E pra sempre será, exaltado no céu",
        "Meu Rei invencível, fiel até o fim",
        "Toda criação se dobrará enfim",
        "Reina, Senhor eternamente em mim!",
      ],
    },
  ],
};
