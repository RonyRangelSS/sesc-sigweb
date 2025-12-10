import { Enterprise } from "@/types/strapi/Enterprise";
import Post from "../types/strapi/Post";

export const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL;

export async function getPosts(): Promise<Post[]> {
  const url = `${STRAPI_BASE_URL}/api/posts?populate=*`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()).data as Post[];

  return data || [];
}

export async function getPost(enterpriseId: string): Promise<Post> {
  const url = `${STRAPI_BASE_URL}/api/posts/${enterpriseId}?populate=*`;
  const response = await fetch(url);
  const data = (await response.json()).data as Post;
  return data || null;
}

export async function getEnterprises(): Promise<Enterprise[]> {
  const url = `${STRAPI_BASE_URL}/api/empreendimentos?populate=*&filters[imagem][id][$notNull]=true`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()).data as Enterprise[];
  return data || [];
}

export async function getEnterprise(enterpriseId: string): Promise<Enterprise> {
  const url = `${STRAPI_BASE_URL}/api/empreendimentos/${enterpriseId}?populate=*`;
  const response = await fetch(url);
  const data = (await response.json()).data as Enterprise;
  return data || null;
}
