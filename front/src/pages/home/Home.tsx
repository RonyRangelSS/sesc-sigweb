import SectionEnterpriseItem from "@/components/molecules/SectionEnterpriseItem";
import SectionPostItem from "@/components/molecules/SectionPostItem";
import Carrossel from "@/components/organisms/Carrossel";
import Section from "@/components/organisms/Section";
import { IMAGES } from "@/DUMMIES";
import { useEnterprises } from "@/hooks/useEnterprises";
import { usePosts } from "@/hooks/usePost";
import { Enterprise } from "@/types/strapi/Enterprise";
import Post from "@/types/strapi/Post";

function Home() {
  const { posts } = usePosts();
  const { data: enterprises} = useEnterprises();

  const postRenderer = (post: Post) => (
    <SectionPostItem
      id={post.id.toString()}
      key={post.id}
      descricao={post.descricao}
      textoAlt={post.titulo}
      titulo={post.titulo}
      img={post.imagem[0] || ""}
      tag={{ nome: post.categoria, cor: "#FBB904" }}
    />
  );

  const enterpriseRenderer = (enterprise: Enterprise) => (
  <SectionEnterpriseItem
    key={enterprise.id}
    enterprise={enterprise}
  />
);


  return (
    <div>
      <main>
        <Carrossel imagens={IMAGES} />
        <Section titulo="Postagens" items={posts} itemRenderer={postRenderer} urlPath="posts"/>
        <Section titulo="Empreendimentos" items={enterprises} itemRenderer={enterpriseRenderer} urlPath="empreendimentos"/>
      </main>
    </div>
  );
}

export default Home;
