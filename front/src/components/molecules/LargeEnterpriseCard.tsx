import { NavLink } from "react-router";
import { Enterprise } from "@/types/strapi/Enterprise";
import { getEnterpriseImageUrl } from "@/utils/image-utils";
import { getColorFromTipo } from "@/utils/tipo-utils";
import { cn } from "@/utils/style-utils";

type LargeEnterpriseCardProps = {
  enterprise: Enterprise;
};

export default function LargeEnterpriseCard({
  enterprise,
}: LargeEnterpriseCardProps) {
  const mainImage =
    enterprise?.imagem && enterprise.imagem.length > 0
      ? enterprise.imagem[0]
      : undefined;
  const imageUrl = getEnterpriseImageUrl(mainImage);

  const mapUrl = `/mapa?lat=${enterprise.localizacao.lat}&lng=${enterprise.localizacao.lng}&nome=${encodeURIComponent(enterprise.nome)}&foto=${encodeURIComponent(imageUrl || "")}&tipo=${encodeURIComponent(enterprise.tipo)}&endereco=${encodeURIComponent(`${enterprise.endereco}, ${enterprise.bairro}`)}`;

  return (
    <NavLink
      to={mapUrl}
      draggable={false}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-300",
        "bg-white p-4 shadow-md transition-shadow duration-200",
        "hover:shadow-lg cursor-pointer block"
      )}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl shadow mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={enterprise.nome || "Enterprise image"}
            draggable={false}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>

      <h2 className="mb-2 text-xl font-semibold leading-tight text-black line-clamp-2">
        {enterprise.nome}
      </h2>

      <span
        className={cn(
          "text-xs font-semibold mb-3 rounded-full px-2 py-1",
          "block overflow-hidden whitespace-nowrap text-ellipsis w-fit max-w-full"
        )}
        style={{ backgroundColor: getColorFromTipo(enterprise.tipo) }}
      >
        {enterprise.tipo}
      </span>

      <p className="text-sm leading-tight text-gray-700">
        {enterprise.endereco}, {enterprise.bairro}
      </p>
    </NavLink>
  );
}

