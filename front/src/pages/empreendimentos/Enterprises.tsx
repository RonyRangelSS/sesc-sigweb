import { useEnterprises } from "@/hooks/useEnterprises";
import LargeEnterpriseCard from "@/components/molecules/LargeEnterpriseCard";
import { BackButton } from "@/components/atoms/common/buttons/BackButton";

export default function EnterprisesList() {
  const { data: enterprises, isFetching } = useEnterprises();

  if (isFetching) return <p className="mt-8 text-center">Carregando...</p>;
  if (!enterprises.length)
    return <p className="mt-8 text-center">Nenhum empreendimento encontrado.</p>;

  return (
    <div>
      <div className="flex items-center justify-start mb-6">
        <BackButton to="/" />
        <span className="w-full text-center">
          <h1 className="text-center text-2xl text-primary font-bold">
            Todos os Empreendimentos
          </h1>
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          {enterprises.map((enterprise) => (
            <LargeEnterpriseCard key={enterprise.id} enterprise={enterprise} />
          ))}
        </div>
      </div>
    </div>
  );
}

