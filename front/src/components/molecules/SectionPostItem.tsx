import { NavLink } from "react-router";
import { STRAPI_BASE_URL } from "../../api/Strapi";
import { cn } from "@/utils/style-utils";

type Tag = { nome: string; cor: string };

export type SectionItemProps = {
  id: string;
  titulo: string;
  descricao: string;
  img: {
    url: string;
    formats?: { thumbnail?: { url: string }; small?: { url: string } };
  };
  textoAlt: string;
};

export default function SectionItem({
  id,
  titulo,
  descricao,
  img,
  textoAlt,
}: SectionItemProps) {
  return (
    <NavLink
      to={`/posts/${id}`}
      draggable={false}
      className={cn(
        "relative h-72 w-60 shrink-0 snap-center overflow-hidden",
        "rounded-2xl border border-gray-300 bg-white p-4 shadow-md"
      )}
    >
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl shadow">
        <img
          src={`${STRAPI_BASE_URL}${img.formats?.thumbnail?.url ?? img.url}`}
          draggable={false}
          alt={textoAlt}
          className="h-full w-full object-cover"
        />
      </div>

      <h2 className="mt-4 px-2 text-lg! font-medium leading-tight text-black line-clamp-2">
        {titulo}
      </h2>
      <p className="mt-2 px-2 text-sm leading-tight line-clamp-3 text-black">
        {descricao}
      </p>
    </NavLink>
  );
}
