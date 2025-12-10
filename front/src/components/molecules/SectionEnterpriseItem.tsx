import { NavLink } from "react-router";
import { STRAPI_BASE_URL } from "../../api/Strapi";
import { Enterprise } from "../../types/strapi/Enterprise";

type SectionEnterpriseItemProps = {
  enterprise: Enterprise;
};

export default function SectionEnterpriseItem({ enterprise }: SectionEnterpriseItemProps) {
  const firstImage = Array.isArray(enterprise.imagem)
    ? enterprise.imagem[0]
    : null;

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

      <h2 className="mt-4 px-2 text-xl font-normal leading-tight text-black line-clamp-1">
        {enterprise.nome}
      </h2>

      <span className="font-semibold my-1 rounded-full px-2 py-1 text-xs bg-blue-300">
        {enterprise.tipo}
      </span>

      <p className="mt-2 px-2 text-justify text-sm leading-tight text-black">
        {enterprise.endereco}, {enterprise.bairro}
      </p>
    </NavLink>
  );
}
