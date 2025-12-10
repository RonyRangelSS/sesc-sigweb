import { Image } from "./Image";

export default interface Post {
  id: number;
  documentId: string;
  imagem: Image[];
  titulo: string;
  categoria: string;
  descricao: string;
  horario: string;
  endereco: string;
  local: {
    lat: number;
    lng: number;
  };
  contato: string;
}
