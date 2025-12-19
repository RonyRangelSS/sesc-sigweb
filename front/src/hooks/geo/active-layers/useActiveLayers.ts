import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { GeoFilter } from "@/types/geo/filters/GeoFilter";
import LayerInfo, { getLayerId } from "@/types/geo/LayerInfo";
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
      next.set(getLayerId(layer), { ...layer, hidden: false, filters: {} });
      return updateLayers(state, next);
    });
  };

  const removeLayer = (layer: LayerInfo) => {
    set((state) => {
      const next = new Map(state.layersMap);
      next.delete(getLayerId(layer));
      return updateLayers(state, next);
    });
  };

  const hasLayer = (layer: LayerInfo) => {
    return get().layersMap.has(getLayerId(layer));
  };

  const hideLayer = (hidden: boolean, layer: ActiveLayerInfo) => {
    set((state) => {
      const next = new Map(state.layersMap);
      const layerToHide = next.get(getLayerId(layer));
      if (layerToHide) layerToHide.hidden = hidden;
      return updateLayers(state, next);
    });
  };

  const addFilter = (
    layer: ActiveLayerInfo,
    field: string,
    filter: GeoFilter
  ) => {
    set((state) => {
      const layerId = getLayerId(layer);
      const next = new Map(state.layersMap);
      const layerToUpdate = next.get(layerId);
      if (layerToUpdate) layerToUpdate.filters[layerId][field] = filter;
      return updateLayers(state, next);
    });
  };

  const removeFilter = (layer: ActiveLayerInfo, field: string) => {
    set((state) => {
      const layerId = getLayerId(layer);
      const next = new Map(state.layersMap);
      const layerToUpdate = next.get(layerId);
      if (layerToUpdate) delete layerToUpdate.filters[layerId][field];
      return updateLayers(state, next);
    });
  };

  return {
    ...initialState,
    addLayer,
    removeLayer,
    hasLayer,
    hideLayer,
    addFilter,
    removeFilter,
  };
});

export const useActiveLayers = <T = UseActiveLayersProps>(
  selector: (select: UseActiveLayersProps) => T = (select) => select as T
) => {
  return useActiveLayersStore(useShallow((select) => selector(select)));
};
