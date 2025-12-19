import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import LayerInfo from "@/types/geo/LayerInfo";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type UseActiveLayersData = {
  layersMap: Map<string, ActiveLayerInfo>;
  layers: ActiveLayerInfo[];
};

export type UseActiveLayersProps = UseActiveLayersData & {
  addLayer: (layer: LayerInfo) => void;
  removeLayer: (layer: LayerInfo) => void;
  hasLayer: (layer: LayerInfo) => boolean;
  hideLayer: (hidden: boolean, layer: ActiveLayerInfo) => void;
};

const initialState: UseActiveLayersData = {
  layersMap: new Map(),
  layers: [],
};

const useActiveLayersStore = create<UseActiveLayersProps>((set, get) => {
  const updateLayers = (
    state: UseActiveLayersData,
    layersMap: Map<string, ActiveLayerInfo>
  ) => {
    return {
      ...state,
      layersMap: layersMap,
      layers: Array.from(layersMap.values()),
    };
  };

  const addLayer = (layer: LayerInfo) => {
    set((state) => {
      const next = new Map(state.layersMap);
      next.set(`${layer.namespace}:${layer.name}`, { ...layer, hidden: false });
      return updateLayers(state, next);
    });
  };

  const removeLayer = (layer: LayerInfo) => {
    set((state) => {
      const next = new Map(state.layersMap);
      next.delete(`${layer.namespace}:${layer.name}`);
      return updateLayers(state, next);
    });
  };

  const hasLayer = (layer: LayerInfo) => {
    return get().layersMap.has(`${layer.namespace}:${layer.name}`);
  };

  const hideLayer = (hidden: boolean, layer: ActiveLayerInfo) => {
    set((state) => {
      const next = new Map(state.layersMap);
      const layerToHide = next.get(`${layer.namespace}:${layer.name}`);
      if (layerToHide) layerToHide.hidden = hidden;
      return updateLayers(state, next);
    });
  };

  return {
    ...initialState,
    addLayer,
    removeLayer,
    hasLayer,
    hideLayer,
  };
});

export const useActiveLayers = <T = UseActiveLayersProps>(
  selector: (select: UseActiveLayersProps) => T = (select) => select as T
) => {
  return useActiveLayersStore(useShallow((select) => selector(select)));
};
