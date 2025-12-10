import { STRAPI_BASE_URL } from "@/api/Strapi";
import { usePost } from "@/hooks/usePost";
import { FaClock, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { NavLink, useParams } from "react-router";
import Pointer from "../../../components/atoms/geo/Pointer";
import { cn } from "@/utils/style-utils";
import { getMainImageUrl } from "@/utils/image-utils";
import { BackButton } from "@/components/atoms/common/buttons/BackButton";

type InfoCardProps = {
  title: string;
  content: string;
  divClassName?: string;
  h2ClassName?: string;
  pClassName?: string;
};

function SectionCard({
  title,
  content,
  divClassName,
  h2ClassName,
  pClassName,
}: InfoCardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow p-4 mb-2", divClassName)}>
      <h2
        className={cn("text-lg font-semibold mb-2 border-b pb-1", h2ClassName)}
      >
        {title}
      </h2>
      <p className={cn("text-justify text-sm", pClassName)}>{content}</p>
    </div>
  );
}

export default function PostDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const { post } = usePost(itemId ?? "");

  if (!itemId) return <p>Item não encontrado</p>;

  const mainImage =
    post?.imagem && post.imagem.length > 0 ? post.imagem[0] : undefined;
  const imageUrl = getMainImageUrl(mainImage);

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="mt-2 mb-4 flex self-start w-full max-w-2xl">
        <BackButton to="/" />
      </div>
      <div
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg mb-6"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(180deg, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.432) 53.15%, rgba(0, 0, 0, 0.664) 68.84%, rgba(0, 0, 0, 0.8) 85.75%), url(${imageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-72 items-end">
          <h3 className="w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-4 text-center text-2xl font-bold text-white rounded-b-2xl">
            {post?.titulo}
          </h3>
        </div>
      </div>

      <div className="w-full max-w-2xl px-4 flex flex-col gap-6">
        {post?.minibio && (
          <SectionCard title="Mini Bio" content={post.minibio} />
        )}
        {post?.descricaoServicos && (
          <SectionCard
            title="Serviços e Diferenciais"
            content={post.descricaoServicos}
            pClassName="whitespace-pre-line"
          />
        )}
        {post?.observacao && (
          <SectionCard
            title="Observação"
            content={post.observacao}
            pClassName="whitespace-pre-line"
          />
        )}
        <div className="bg-white rounded-xl shadow p-4 mb-2">
          <h2 className="text-lg font-semibold mb-2 border-b pb-1">Endereço</h2>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt color="#2C3E50" size={21} />
            <span>{post?.endereco}</span>
            {post?.local && post.local.lat && post.local.lng && (
              <NavLink
                to={`/mapa?lat=${post.local.lat}&lng=${post.local.lng}&nome=${encodeURIComponent(post.titulo || "")}`}
                className="ml-4 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-colors"
              >
                Ver no mapa
              </NavLink>
            )}
          </div>
        </div>
        {post?.redesSociais && (
          <SectionCard
            title="Redes Sociais / Contato"
            content={post.redesSociais}
            pClassName="whitespace-pre-line"
          />
        )}
        {post?.empreendedor && (
          <SectionCard title="Empreendedor(a)" content={post.empreendedor} />
        )}
        <div className="bg-white rounded-xl shadow p-4 mb-2 flex flex-col gap-2">
          {post?.horario && (
            <div className="flex items-center gap-2">
              <FaClock color="#2C3E50" size={21} />
              <span>{post.horario}</span>
            </div>
          )}
          {post?.contato && (
            <div className="flex items-center gap-2">
              <FaWhatsapp color="#2C3E50" size={21} />
              <span>{post.contato}</span>
            </div>
          )}
          {post?.local && post.local.lat && post.local.lng && (
            <div className="flex items-center gap-2">
              <Pointer lat={post.local.lat} lng={post.local.lng} />
              <span>Ver no mapa</span>
            </div>
          )}
        </div>
        {post?.imagem && post.imagem.length > 1 && (
          <div className="bg-white rounded-xl shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-2 border-b pb-1">
              Galeria
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.imagem.slice(1).map((img, idx) => {
                const imgUrl = img.formats?.thumbnail?.url
                  ? `${STRAPI_BASE_URL}${img.formats.thumbnail.url}`
                  : img.url
                    ? `${STRAPI_BASE_URL}${img.url}`
                    : undefined;
                return imgUrl ? (
                  <img
                    key={img.id || idx}
                    src={imgUrl}
                    alt={img.alternativeText || img.name || "Imagem"}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                ) : null;
              })}
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow p-4 mb-2 text-xs text-gray-500 flex flex-col gap-1">
          {post?.createdAt && (
            <span>Criado em: {new Date(post.createdAt).toLocaleString()}</span>
          )}
          {post?.updatedAt && (
            <span>
              Atualizado em: {new Date(post.updatedAt).toLocaleString()}
            </span>
          )}
          {post?.publishedAt && (
            <span>
              Publicado em: {new Date(post.publishedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
