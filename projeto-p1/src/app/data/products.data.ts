import { Product } from '../models/product.model';

export const PRODUTOS: Product[] = [
  {
    id: 'racao-premium',
    nome: 'Ração Premium Cães 15kg',
    categoria: 'racao',
    preco: 189.9,
    promo: 139.99,
    quantidade: 10,
    descricao:
      'Ração super premium para cães adultos, rica em proteínas de alta qualidade, com ômega 3 e 6 para pele e pelagem saudáveis. Pacote de 15kg.',
    especies: ['cachorro'],
  },
  {
    id: 'areia-higienica',
    nome: 'Areia Higiênica Gatos 4kg',
    categoria: 'higiene',
    preco: 39.9,
    promo: 0,
    quantidade: 15,
    descricao:
      'Areia sanitária aglomerante com excelente poder de absorção e controle de odores, ideal para caixas de areia de gatos de todos os portes.',
    especies: ['gato'],
  },
  {
    id: 'brinquedo-mordedor',
    nome: 'Brinquedo Mordedor',
    categoria: 'brinquedo',
    preco: 24.9,
    promo: 15.99,
    quantidade: 5,
    descricao:
      'Mordedor em borracha atóxica e resistente, perfeito para aliviar a ansiedade e ajudar na limpeza dos dentes de cães de pequeno e médio porte.',
    especies: ['cachorro'],
  },
  {
    id: 'sementes-aves',
    nome: 'Mistura de Sementes Aves',
    categoria: 'racao',
    preco: 19.9,
    promo: 0,
    quantidade: 3,
    descricao:
      'Mistura balanceada de sementes, cereais e frutas desidratadas, desenvolvida para fornecer energia e nutrientes essenciais para aves domésticas.',
    especies: ['ave'],
  },
  {
    id: 'petisco-natural',
    nome: 'Petisco Natural',
    categoria: 'racao',
    preco: 14.9,
    promo: 10.99,
    quantidade: 19,
    descricao:
      'Petisco 100% natural, sem conservantes artificiais, indicado para recompensar e reforçar o vínculo com cães e gatos de qualquer idade.',
    especies: ['cachorro', 'gato'],
  },
  {
    id: 'comedouro-inox',
    nome: 'Comedouro Inox',
    categoria: 'higiene',
    preco: 29.9,
    promo: 0,
    quantidade: 2,
    descricao:
      'Comedouro em aço inoxidável, antiderrapante, fácil de higienizar e resistente a ferrugem, indicado para qualquer tipo de pet.',
    especies: ['cachorro', 'gato', 'ave', 'outro'],
  },
  {
    id: 'coleira-ajustavel',
    nome: 'Coleira Ajustável',
    categoria: 'brinquedo',
    preco: 32.9,
    promo: 30,
    quantidade: 1,
    descricao:
      'Coleira ajustável em nylon reforçado, com fivela de segurança, confortável e disponível para diferentes tamanhos de pescoço.',
    especies: ['cachorro', 'gato'],
  },
  {
    id: 'feno-pressionado-mini-pig',
    nome: 'Feno de Alfafa Premium para Porcos',
    categoria: 'racao',
    preco: 29.9,
    promo: 0,
    quantidade: 15,
    descricao:
      'Alimento rico em fibras e cálcio, essencial para o bom funcionamento do trato digestivo e desgaste natural dos dentes de porcos e minipigs.',
    especies: ['outro'],
  },
  {
    id: 'mordedor-madeira-roedores',
    nome: 'Brinquedo Mordedor de Madeira',
    categoria: 'brinquedo',
    preco: 12.5,
    promo: 0,
    quantidade: 30,
    descricao:
      'Mordedor atóxico de madeira natural, ideal para entreter hamsters e auxiliar na saúde bucal, prevenindo o crescimento excessivo dos dentes.',
    especies: ['outro'],
  },
  {
    id: 'rede-suspensa-furao',
    nome: 'Rede Suspensa Dupla para Furão',
    categoria: 'brinquedo',
    preco: 45.0,
    promo: 0,
    quantidade: 10,
    descricao:
      'Rede em tecido macio e resistente para descanso e exploração dentro da gaiola, perfeita para atender o comportamento ativo do furão.',
    especies: ['outro'],
  },
  {
    id: 'cama-cachorro',
    nome: 'Cama para Cachorro',
    categoria: 'acessorio',
    preco: 39.9,
    promo: 0,
    quantidade: 2,
    descricao:
      'Cama confortável e resistente para cachorros de pequeno porte, ideal para o descanso e o bem-estar do seu animal de estimação.',
    especies: ['cachorro'],
  },
  {
    id: 'gaiola-passaros-2-andares',
    nome: 'Gaiola para Pássaros com 2 Andares',
    categoria: 'acessorio',
    preco: 39.9,
    promo: 0,
    quantidade: 2,
    descricao:
      'Gaiola para Pássaros com 2 Andares',
    especies: ['ave'],
  },
];
