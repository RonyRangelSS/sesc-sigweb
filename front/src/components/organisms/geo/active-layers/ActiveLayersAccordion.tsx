import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { Accordion } from "../../common/accordion/Accordion";
import ActiveLayerAccordionItem from "@/components/atoms/geo/active-layers/ActiveLayerAccordionItem";
import { getLayerId } from "@/types/geo/LayerInfo";

export type ActiveLayersAccordionProps = {
  layers: ActiveLayerInfo[];
  className?: string;
};

export const ActiveLayersAccordion = ({
  layers,
  className,
}: ActiveLayersAccordionProps) => {
  return (
    <Accordion.SingleItemRoot className={className}>
      {layers.map((layer) => (
        <ActiveLayerAccordionItem activeLayer={layer} key={getLayerId(layer)} />
      ))}
    </Accordion.SingleItemRoot>
  );
};
