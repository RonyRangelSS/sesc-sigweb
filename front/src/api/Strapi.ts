import { Enterprise } from "@/types/strapi/Enterprise";
import { Post } from "@/types/strapi/Post";
import { StrapiRequest } from "@/types/strapi/StrapiRequest";
import { PageRequest } from "@/types/common/pagination/PageRequest";

export const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL;

export async function getPosts(
  pageRequest: PageRequest
): Promise<StrapiRequest<Post[]>> {
  const url = `${STRAPI_BASE_URL}/api/posts?populate=*&pagination[page]=${pageRequest.page}&pagination[pageSize]=${pageRequest.pageSize}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result as StrapiRequest<Post[]>;
}

export async function getPost(enterpriseId: string): Promise<Post> {
  const url = `${STRAPI_BASE_URL}/api/posts/${enterpriseId}?populate=*`;
  const response = await fetch(url);
  const data = (await response.json()).data as Post;
  return data || null;
}

export async function getEnterprises(
  pageRequest: PageRequest
): Promise<StrapiRequest<Enterprise[]>> {
  const url = `${STRAPI_BASE_URL}/api/empreendimentos?populate=*&filters[imagem][id][$notNull]=true&pagination[page]=${pageRequest.page}&pagination[pageSize]=${pageRequest.pageSize}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result as StrapiRequest<Enterprise[]>;
}

export async function getEnterprise(enterpriseId: string): Promise<Enterprise> {
  const url = `${STRAPI_BASE_URL}/api/empreendimentos/${enterpriseId}?populate=*`;
  const response = await fetch(url);
  const data = (await response.json()).data as Enterprise;
  return data || null;
}
