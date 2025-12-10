import { Image } from "./Image";

export interface Enterprise {
  id: number;
  nome: string;
  tipo: string;
  foto: string;
  endereco: string;
  bairro: string;
  municipio: string;
  estado: string;
  regiao: string;
  cep: string;
  pais: string;
  localizacao: {
    lat: number;
    lng: number;
    geohash: string;
  };
  imagem: Image[];
}
