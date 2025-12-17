import SectionEnterpriseItem from "@/components/molecules/SectionEnterpriseItem";
import SectionPostItem from "@/components/molecules/SectionPostItem";
import Carrossel from "@/components/organisms/Carrossel";
import Section from "@/components/organisms/Section";
import { IMAGES } from "@/DUMMIES";
import { useEnterprises } from "@/hooks/useEnterprises";
import { usePosts } from "@/hooks/usePost";
import { Enterprise } from "@/types/strapi/Enterprise";
import { Post } from "@/types/strapi/Post";

function Home() {
  const { data: posts } = usePosts();
  const { data: enterprises } = useEnterprises();

  const postRenderer = (post: Post) => (
    <SectionPostItem
      id={post.documentId}
      key={post.documentId}
      descricao={post.minibio}
      textoAlt={post.titulo}
      titulo={post.titulo}
      img={{
        url: post.imagem[0].url ?? "",
        formats: {
          thumbnail: {
            url: post.imagem[0].formats?.thumbnail?.url ?? "",
          },
          small: {
            url: post.imagem[0].formats?.small?.url ?? "",
          },
        },
      }}
    />
  );

  const enterpriseRenderer = (enterprise: Enterprise) => (
    <SectionEnterpriseItem key={enterprise.id} enterprise={enterprise} />
  );

  return (
    <div id="home-page" className="h-full overflow-y-auto flex flex-col">
      <main className="flex flex-col gap-2">
        <Carrossel imagens={IMAGES} />
        <Section
          titulo="Postagens"
          items={posts}
          itemRenderer={postRenderer}
          href="/posts"
        />
        <Section
          titulo="Empreendimentos"
          items={enterprises}
          itemRenderer={enterpriseRenderer}
          href="/empreendimentos"
        />
      </main>
    </div>
  );
}

export default Home;
