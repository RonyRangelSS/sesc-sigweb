import { NavLink } from "react-router";
import { STRAPI_BASE_URL } from "../../api/Strapi";
import { Enterprise } from "../../types/strapi/Enterprise";
import { cn } from "@/utils/style-utils";

function getColorFromTipo(tipo: string): string {
  let hash = 0;
  for (let i = 0; i < tipo.length; i++) {
    hash = tipo.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Constrain hue to pleasant pastel range (0-360, but we can filter out certain ranges)
  const hue = Math.abs(hash) % 360;

  // Pastel colors: lower saturation (30-40%) and higher lightness (80-90%)
  const saturation = 35 + (Math.abs(hash) % 10); // 35-45%
  const lightness = 80 + (Math.abs(hash) % 10); // 80-90%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export type SectionEnterpriseItemProps = {
  enterprise: Enterprise;
};

export default function SectionEnterpriseItem({
  enterprise,
}: SectionEnterpriseItemProps) {
  let firstImage = null;
  if (Array.isArray(enterprise.imagem) && enterprise.imagem.length > 0) {
    firstImage = enterprise.imagem[0];
  }
  const imageUrl = firstImage?.formats?.medium?.url
    ? `${STRAPI_BASE_URL}${firstImage.formats.medium.url}`
    : firstImage?.url
      ? `${STRAPI_BASE_URL}${firstImage.url}`
      : "https://placehold.co/600x400?text=Sem+Imagem";

  return (
    <NavLink
      to={`/mapa?lat=${enterprise.localizacao.lat}
          &lng=${enterprise.localizacao.lng}
          &nome=${encodeURIComponent(enterprise.nome)}
          &foto=${encodeURIComponent(imageUrl)}
          &tipo=${encodeURIComponent(enterprise.tipo)}
          &endereco=${encodeURIComponent(`${enterprise.endereco}, ${enterprise.bairro}`)}`}
      draggable={false}
      className="relative h-72 w-60 flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 shadow-md"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl shadow">
        <img
          src={imageUrl}
          draggable={false}
          alt={enterprise.nome}
          className="h-full w-full object-cover"
        />
      </div>

      <h2 className="mt-4 text-lg! font-medium leading-tight text-black line-clamp-1">
        {enterprise.nome}
      </h2>

      <span
        className={cn(
          "text-xs font-semibold my-1 rounded-full px-2 py-1",
          "block overflow-hidden whitespace-nowrap text-ellipsis w-fit max-w-full"
        )}
        style={{ backgroundColor: getColorFromTipo(enterprise.tipo) }}
      >
        {enterprise.tipo}
      </span>

      <p className="mt-2 px-2 text-sm line-clamp-2 leading-tight text-black">
        {enterprise.endereco}, {enterprise.bairro}
      </p>
    </NavLink>
  );
}
