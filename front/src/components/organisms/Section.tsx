import { FaArrowRight } from "react-icons/fa";
import { ReactNode } from "react";

type SectionProps<T> = {
  titulo: string;
  items: T[];
  itemRenderer: (data: T) => ReactNode;
};

export default function Section<T>({
  titulo,
  items,
  itemRenderer,
}: SectionProps<T>) {
  return (
    <>
      <nav className="m-2 flex flex-row items-baseline justify-between border-b-4 border-[#D9D9D9]">
        <h2 className="capitalize">{titulo}</h2>
        <div className="flex flex-row items-center gap-2 transition hover:scale-110 hover:font-medium">
          <p className="text-[#FBB904]">Ver Mais</p>
          <FaArrowRight color="#0C4484" size={24} />
        </div>
      </nav>
      <div className="scrollbar-hide max-ro m-2 flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:auto-rows-min md:grid-cols-4 md:gap-4 md:overflow-y-auto">
        {items.map(itemRenderer)}
      </div>
    </>
  );
}
