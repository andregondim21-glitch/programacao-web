export type Especie = 'cachorro' | 'gato' | 'ave' | 'outro';

export interface Pet {
  nome: string;
  especie: Especie;
  idade: number;
  peso: number;
}
