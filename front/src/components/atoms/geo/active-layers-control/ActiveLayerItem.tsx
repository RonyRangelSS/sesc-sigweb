import ActiveLayerInfo from "../../../../types/geo/ActiveLayerInfo.ts";
import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa6";
import { useActiveLayers } from "@/hooks/geo/active-layers/useActiveLayers.ts";

type ActiveLayerItemProps = {
  activeLayer: ActiveLayerInfo;
};

export default function ActiveLayerItem({ activeLayer }: ActiveLayerItemProps) {
  const { hideLayer, removeLayer } = useActiveLayers((select) => ({
    hideLayer: select.hideLayer,
    removeLayer: select.removeLayer,
  }));

  const onHide = () => {
    hideLayer(!activeLayer.hidden, activeLayer);
  };

  const onDelete = () => {
    removeLayer(activeLayer);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 text-[1.2rem] text-white">
      <span className="mb-1 truncate">{activeLayer.name}</span>
      {activeLayer.hidden ? (
        <RiEyeCloseLine size={24} onClick={onHide} />
      ) : (
        <RiEyeFill size={24} onClick={onHide} />
      )}
      <FaTrash size={24} onClick={onDelete} />
    </div>
  );
}
