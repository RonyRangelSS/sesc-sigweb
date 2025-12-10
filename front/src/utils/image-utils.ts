import { STRAPI_BASE_URL } from "@/api/Strapi";
import { PostImage } from "@/types/strapi/Post";

export function getMainImageUrl(
  image: PostImage | undefined
): string | undefined {
  if (!image) return undefined;

  if (image.formats?.medium?.url) {
    return `${STRAPI_BASE_URL}${image.formats.medium.url}`;
  }
  if (image.formats?.large?.url) {
    return `${STRAPI_BASE_URL}${image.formats.large.url}`;
  }
  if (image.formats?.small?.url) {
    return `${STRAPI_BASE_URL}${image.formats.small.url}`;
  }
  if (image.formats?.thumbnail?.url) {
    return `${STRAPI_BASE_URL}${image.formats.thumbnail.url}`;
  }
  if (image.url) {
    return `${STRAPI_BASE_URL}${image.url}`;
  }

  return undefined;
}
