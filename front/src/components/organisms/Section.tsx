import { cn } from "@/utils/style-utils";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router";

type SectionProps<T> = {
  titulo: string;
  href?: string;
  items: T[];
  urlPath?: string;
  itemRenderer: (item: T) => React.ReactNode;
};

export default function Section<T>({
  titulo,
  items,
  href,
  itemRenderer,
}: SectionProps<T>) {
  return (
    <section
      id={`${titulo.toLowerCase()}-section`}
      className="h-full overflow-y-auto flex flex-col"
    >
      <header
        className={cn(
          "m-2 flex flex-row items-baseline justify-between",
          "border-b-4 border-[#D9D9D9]"
        )}
      >
        <h2 className="capitalize">{titulo}</h2>
        {href && (
          <NavLink
            to={href}
            className={cn(
              "flex flex-row items-center gap-2 transition",
              "hover:scale-110 hover:cursor-pointer hover:font-medium"
            )}
          >
            <p className="text-[#FBB904]">Ver Mais</p>
            <FaArrowRight color="#0C4484" size={24} />
          </NavLink>
        )}
      </header>

      {!items || items.length < 1 ? (
        <div className="m-2 flex min-h-36 items-center justify-center">
          <p className="text-center">
            Não conseguimos encontrar nenhum dado. Tente novamente mais tarde.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-row scrollbar-hide p-2 min-h-36 snap-x snap-mandatory",
            "gap-4 md:gap-6 overflow-x-auto md:overflow-y-auto",
            "md:grid md:auto-rows-min",
            "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          )}
        >
          {items.map((item) => itemRenderer(item))}
        </div>
      )}
    </section>
  );
}
