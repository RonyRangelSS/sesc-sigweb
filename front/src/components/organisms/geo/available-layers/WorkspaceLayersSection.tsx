import { useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { getLayers } from "../../../../api/GeoClient.ts";
import LayerInfo from "../../../../types/geo/LayerInfo.ts";
import AvailableLayerItem from "@/components/atoms/geo/available-layers-control/AvailableLayerItem.tsx";

type WorkspaceLayersSection = {
  workspace: string;
};

export default function WorkspaceSection({
  workspace,
}: WorkspaceLayersSection) {
  const [isOpen, setIsOpen] = useState(false);
  const [layers, setLayers] = useState<LayerInfo[]>([]);

  const onOpen = async () => {
    setIsOpen(!isOpen);
    if (isOpen) return;

    setLayers(await getLayers(workspace));
  };

  return (
    <section className="truncate bg-gray-700 px-4 py-2 text-[1.2rem] text-white">
      <span className="flex items-center">
        <span className="mb-1.5 truncate">{workspace}</span>
        {isOpen ? (
          <IoMdArrowDropdown
            size={30}
            className="text-white"
            onClick={onOpen}
          />
        ) : (
          <IoMdArrowDropright
            size={30}
            className="text-white"
            onClick={onOpen}
          />
        )}
      </span>
      {isOpen &&
        layers.map((layer, index) => (
          <AvailableLayerItem layerInfo={layer} key={index} />
        ))}
    </section>
  );
}
