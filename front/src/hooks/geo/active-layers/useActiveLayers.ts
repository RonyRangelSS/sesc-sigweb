import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { GeoFilter } from "@/types/geo/filters/GeoFilter";
import LayerInfo, { getLayerId } from "@/types/geo/LayerInfo";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import * as R from "remeda";

export type UseActiveLayersData = {
  layersMap: Map<string, ActiveLayerInfo>;
  layers: ActiveLayerInfo[];
};

export type UseActiveLayersProps = UseActiveLayersData & {
  addLayer: (layer: LayerInfo) => void;
  removeLayer: (layer: LayerInfo) => void;
  hasLayer: (layer: LayerInfo) => boolean;
  hideLayer: (hidden: boolean, layer: ActiveLayerInfo) => void;
  addFilter: (
    layer: ActiveLayerInfo,
    attribute: string,
    filter: GeoFilter
  ) => void;
  removeFilter: (layer: ActiveLayerInfo, attribute: string) => void;
  getFilter: (
    layer: ActiveLayerInfo,
    attribute: string
  ) => GeoFilter | undefined;
  hasFilter: (layer: ActiveLayerInfo, attribute: string) => boolean;
};

const initialState: UseActiveLayersData = {
  layersMap: new Map(),
  layers: [],
};

export const useActiveLayersStore = create<UseActiveLayersProps>((set, get) => {
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
      next.set(getLayerId(layer), { ...layer, hidden: false });
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
    attribute: string,
    filter: GeoFilter
  ) => {
    set((state) => {
      const next = new Map(state.layersMap);
      const layerToUpdate = next.get(getLayerId(layer));

      if (layerToUpdate && layerToUpdate.featureInfo) {
        const updatedFilters = {
          ...layerToUpdate.featureInfo.filters,
          [attribute]: filter,
        };

        const updatedFeatureInfo = {
          ...layerToUpdate.featureInfo,
          filters: updatedFilters,
        };

        const updatedLayer = {
          ...layerToUpdate,
          featureInfo: updatedFeatureInfo,
        };

        next.set(getLayerId(layer), updatedLayer);
      }

      return updateLayers(state, next);
    });
  };

  const getFilter = (layer: ActiveLayerInfo, attribute: string) => {
    return get().layersMap.get(getLayerId(layer))?.featureInfo?.filters[
      attribute
    ];
  };

  const hasFilter = (layer: ActiveLayerInfo, attribute: string) => {
    return getFilter(layer, attribute) !== undefined;
  };

  const removeFilter = (layer: ActiveLayerInfo, attribute: string) => {
    set((state) => {
      const next = new Map(state.layersMap);
      const layerToUpdate = next.get(getLayerId(layer));

      if (layerToUpdate && layerToUpdate.featureInfo) {
        const updatedFilters = {
          ...layerToUpdate.featureInfo.filters,
          [attribute]: undefined,
        };

        const updatedFeatureInfo = {
          ...layerToUpdate.featureInfo,
          filters: updatedFilters,
        };

        const updatedLayer = {
          ...layerToUpdate,
          featureInfo: updatedFeatureInfo,
        };

        next.set(getLayerId(layer), updatedLayer);
      }

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
    getFilter,
    hasFilter,
  };
});

export const useActiveLayers = <T = UseActiveLayersProps>(
  selector: (select: UseActiveLayersProps) => T = (select) => select as T
) => {
  return useActiveLayersStore(useShallow((select) => selector(select)));
};
