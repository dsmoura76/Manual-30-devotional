import daysJson from "./days.json";

import capa from "@/assets/capa.jpg";
import d01 from "@/assets/dia-01.jpg";
import d02 from "@/assets/dia-02.jpg";
import d03 from "@/assets/dia-03.jpg";
import d04 from "@/assets/dia-04.jpg";
import d05 from "@/assets/dia-05.jpg";
import d06 from "@/assets/dia-06.jpg";
import d07 from "@/assets/dia-07.jpg";
import d08 from "@/assets/dia-08.jpg";
import d09 from "@/assets/dia-09.jpg";
import d10 from "@/assets/dia-10.jpg";
import d11 from "@/assets/dia-11.jpg";
import d12 from "@/assets/dia-12.jpg";
import d13 from "@/assets/dia-13.jpg";
import d14 from "@/assets/dia-14.jpg";
import d15 from "@/assets/dia-15.jpg";

export const capaArte = capa;

export const arte: Record<number, string> = {
  1: d01,
  2: d02,
  3: d03,
  4: d04,
  5: d05,
  6: d06,
  7: d07,
  8: d08,
  9: d09,
  10: d10,
  11: d11,
  12: d12,
  13: d13,
  14: d14,
  15: d15,
  16: d01,
  17: d02,
  18: d03,
  19: d04,
  20: d05,
  21: d06,
  22: d07,
  23: d08,
  24: d09,
  25: d10,
  26: d11,
  27: d12,
  28: d13,
  29: d14,
  30: d15,
};

export type Escolha = { titulo: string; sub: string; resposta: string };
export type Marcha = { titulo: string; texto: string };
export type Extra = { titulo: string; html: string };

export type Dia = {
  n: number;
  tatica: string;
  leitura: string;
  lema: string;
  legenda: string;
  escolhas: Escolha[];
  extras: Extra[];
  marcha: Marcha[];
  marchaIntro: string;
  reconhecimento: string;
  taticaHtml: string;
  combate: string;
  cadernoPergunta: string;
  placeholder: string;
  oracao: string;
  fontes: string;
};

export const dias = daysJson as unknown as Dia[];

export const capaTexto = {
  kicker: "Diário de 30 dias",
  titulo: "A Batalha",
  subtitulo:
    "Trinta táticas reais de samurai, em trinta dias, para você andar com Deus enquanto o mar ainda ruge.",
  referencia: "Salmos 93.1 · Bíblia NVI",
  rodape: 'Inspirado na canção "A Batalha", de Daniel Shirazawa Moura',
};

export const abertura = {
  titulo: "Antes do dia 1",
  nota: "Leia uma vez só",
  paragrafos: [
    "Este manual não promete que a luta vai passar. Promete outra coisa: que você não vai entrar nela desarmado, sozinho, nem sem saber quem está no comando.",
    "E ele serve para os dois lugares. Para o fundo do vale, quando não se enxerga a saída e cada dia custa caro. E para o alto, quando tudo finalmente deu certo e bate aquele medo silencioso de perder o que veio. O Senhor reina sobre os dois — e é com Ele que você vai aprender a andar nos dois.",
    "Durante trinta dias você aprende uma tática real de guerreiro — coisas que espadachins japoneses treinaram por séculos, com nome, origem e propósito. E aprende a usá-la onde ela ganha sentido: dentro de uma passagem da Bíblia, aplicada ao dia que você tem pela frente. A tática mostra o movimento; a Palavra mostra por que ele funciona e para onde ele te leva.",
    "A regra da casa: a tática é a espada; a Palavra é o chão. Espada sem chão firme não sustenta ninguém — e nenhuma sabedoria de guerreiro entra aqui sem estar pisando na Escritura.",
    "E este manual inteiro se apoia em um versículo. O Salmo 93 começa dizendo que o Senhor reina — e logo depois diz uma coisa que quase ninguém repara: “os mares se levantaram”. Eles se levantam mesmo. Deus não os manda embora. Ele é mais forte que eles, e o mar continua bramindo.",
    "É disso que trata este manual. Não de abrir o mar — quem abre é Deus, e Ele abre quando quer. É de atravessar segurando a mão Dele enquanto a água não se abre.",
  ],
  citacao: "“Nas alturas ou vales, nunca estou só.”",
  citacaoFonte: "A Batalha",
};

export type IndiceItem = {
  n: number;
  tatica: string;
  ensina: string;
  passagem: string;
  pronto: boolean;
  ressalva?: string;
};

export const indice: IndiceItem[] = [
  {
    n: 1,
    tatica: "Kamae",
    ensina: "A guarda que você assume antes de qualquer golpe",
    passagem: "Salmos 93.1",
    pronto: true,
  },
  {
    n: 2,
    tatica: "Metsuke",
    ensina: "Onde você põe os olhos decide onde você cai",
    passagem: "Mateus 14.29-31",
    pronto: true,
  },
  {
    n: 3,
    tatica: "Zanshin",
    ensina: "Não baixar a guarda depois que a pressão passa",
    passagem: "Mateus 26.41",
    pronto: true,
  },
  {
    n: 4,
    tatica: "Maai",
    ensina: "A distância certa de pessoas, telas e hábitos",
    passagem: "Provérbios 4.14-15",
    pronto: true,
  },
  {
    n: 5,
    tatica: "Suki",
    ensina: "A brecha na guarda — conhecer a sua",
    passagem: "Efésios 4.26-27",
    pronto: true,
  },
  {
    n: 6,
    tatica: "Kiai",
    ensina: "A voz que quebra a paralisia",
    passagem: "Salmos 34.6",
    pronto: true,
  },
  {
    n: 7,
    tatica: "Harai Waza",
    ensina: "Quando não há brecha, deslocar a guarda em vez de forçá-la",
    passagem: "Atos 16.25-26",
    pronto: true,
  },
  {
    n: 8,
    tatica: "Kata",
    ensina: "A forma que te sustenta quando o sentimento some",
    passagem: "Daniel 6.10",
    pronto: true,
  },
  {
    n: 9,
    tatica: "Nuki Waza",
    ensina: "O golpe passa no vazio porque Outro já sabia",
    passagem: "2 Reis 6.8-12",
    pronto: true,
  },
  {
    n: 10,
    tatica: "Suriage Waza",
    ensina: "A arma é forjada, chega — e não prevalece",
    passagem: "Isaías 54.17",
    pronto: true,
  },
  {
    n: 11,
    tatica: "Hyōshi",
    ensina: "O ritmo da batalha não é seu para escolher",
    passagem: "Salmos 27.14",
    pronto: true,
  },
  {
    n: 12,
    tatica: "Tsubazeriai",
    ensina: "O impasse: travado, cara a cara, sem soltar",
    passagem: "Gênesis 32.24-26",
    pronto: true,
  },
  {
    n: 13,
    tatica: "Kiri-otoshi",
    ensina: "A defesa e o golpe são o mesmo movimento",
    passagem: "Mateus 4.4 · Romanos 8.1",
    pronto: true,
  },
  {
    n: 14,
    tatica: "Debana Waza",
    ensina: "Golpeie a coisa quando ela nasce, não quando ela cresce",
    passagem: "Tiago 1.14-15 · Gênesis 4.7",
    pronto: true,
  },
  {
    n: 15,
    tatica: "Okuri-Ashi",
    ensina: "Avançar com passos firmes sem nunca cruzar os pés",
    passagem: "Salmos 37.23-24 · Salmos 121.3",
    pronto: true,
  },
  {
    n: 16,
    tatica: "Kaeshi Waza",
    ensina: "Não absorva o impacto de frente: gire e devolva com mansidão",
    passagem: "Provérbios 15.1 · Romanos 12.21",
    pronto: true,
  },
  {
    n: 17,
    tatica: "Uchiotoshi Waza",
    ensina: "Derrube o argumento mentiroso antes que ele alcance o coração",
    passagem: "2 Coríntios 10.5 · Efésios 6.16",
    pronto: true,
  },
  {
    n: 18,
    tatica: "Hiki Waza",
    ensina: "Recuar com postura e dignidade para escapar da cilada",
    passagem: "1 Coríntios 6.18 · Gênesis 39.12",
    pronto: true,
  },
  {
    n: 19,
    tatica: "Katsugi Waza",
    ensina: "Quebre o ritmo previsível da carne com a sabedoria do Reino",
    passagem: "1 Coríntios 1.27 · Juízes 7.16",
    pronto: true,
  },
  {
    n: 20,
    tatica: "Sen no Sen",
    ensina: "Quando o mal se projeta, a sua prontidão bíblica já corta",
    passagem: "Provérbios 22.3 · Neemias 4.13",
    pronto: true,
  },
  {
    n: 21,
    tatica: "Go no Sen",
    ensina: "Deixe a armadilha do ímpio se estender até cair sobre ela",
    passagem: "Salmos 9.15 · Ester 7.9",
    pronto: true,
  },
  {
    n: 22,
    tatica: "Sen Sen no Sen",
    ensina: "Desmonte a intenção do medo antes mesmo que ela tome forma",
    passagem: "2 Reis 6.15-16 · Romanos 8.37",
    pronto: true,
  },
  {
    n: 23,
    tatica: "Kuzushi",
    ensina: "Desfaça a base do orgulho antes de desferir a verdade",
    passagem: "1 Samuel 17.51 · Salmos 18.2",
    pronto: true,
  },
  {
    n: 24,
    tatica: "Tai-Sabaki",
    ensina: "Saia da linha de fogo das intrigas sem abandonar o dever",
    passagem: "Lucas 4.30 · Salmos 91.7",
    pronto: true,
  },
  {
    n: 25,
    tatica: "Jō-Ha-Kyū",
    ensina: "Comece em ordem, rompa com firmeza e conclua com clareza",
    passagem: "Eclesiastes 3.1 · Gálatas 6.9",
    pronto: true,
  },
  {
    n: 26,
    tatica: "Maki Waza",
    ensina: "O movimento suave e circular desfaz a violência bruta",
    passagem: "Colossenses 2.15 · Romanos 12.20-21",
    pronto: true,
  },
  {
    n: 27,
    tatica: "Irimi",
    ensina: "Avance para o esconderijo do Altíssimo onde o golpe não alcança",
    passagem: "Salmos 27.5 · Salmos 32.7",
    pronto: true,
  },
  {
    n: 28,
    tatica: "Heijōshin",
    ensina: "O mesmo pulso calmo em casa é o pulso que entra no combate",
    passagem: "Isaías 26.3 · Filipenses 4.6-7",
    pronto: true,
  },
  {
    n: 29,
    tatica: "Kiri-Musubi",
    ensina: "No instante decisivo do encontro, não há espaço para vacilo",
    passagem: "1 Reis 18.21 · Josué 24.15",
    pronto: true,
  },
  {
    n: 30,
    tatica: "Chiburui",
    ensina: "A lâmina limpa volta à bainha: a batalha encerra em reverência ao Soberano",
    passagem: "Salmos 93.1,4 · 2 Timóteo 4.7-8",
    pronto: true,
  },
];

export const substitutas = [
  { nome: "Debana", def: "Golpear no instante em que ele começa a golpear" },
  { nome: "Kaeshi", def: "Aparar e devolver no mesmo movimento" },
  { nome: "Uchiotoshi", def: "Derrubar a lâmina dele e responder" },
  { nome: "Hiki", def: "Golpear recuando, saindo do travamento" },
  { nome: "Katsugi", def: "Ombrear a lâmina para enganar antes de atacar" },
  { nome: "Sen Sen no Sen", def: "Agir antes de a intenção dele se formar" },
  { nome: "Kuzushi", def: "Quebrar o equilíbrio antes do golpe" },
  { nome: "Jō-Ha-Kyū", def: "As três fases de ritmo de um confronto" },
];
