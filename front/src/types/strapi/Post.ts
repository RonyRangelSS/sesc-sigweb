// models/post.ts

export interface ImageFormatItem {
  ext?: string | null;
  url?: string;
  hash?: string;
  mime?: string;
  name?: string;
  path?: string | null;
  size?: number;
  width?: number;
  height?: number;
  sizeInBytes?: number;
}

export interface ImageFormats {
  large?: ImageFormatItem | null;
  medium?: ImageFormatItem | null;
  small?: ImageFormatItem | null;
  thumbnail?: ImageFormatItem | null;
  [key: string]: ImageFormatItem | undefined | null;
}

export interface PostImage {
  id: number;
  documentId?: string;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: ImageFormats | null;
  hash?: string;
  ext?: string | null;
  mime?: string | null;
  size?: number;
  url?: string;
  previewUrl?: string | null;
  provider?: string | null;
  provider_metadata?: any | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Post {
  id: number;
  documentId: string;
  titulo: string;
  endereco: string;
  observacao: string;
  minibio: string;
  descricaoServicos: string;
  redesSociais: string;
  empreendedor: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imagem: PostImage[];
  [key: string]: any;
}
