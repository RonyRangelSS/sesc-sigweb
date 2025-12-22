import { useMemo } from "react";
import { useActiveLayers } from "../active-layers/useActiveLayers";
import { LayerId } from "@/types/geo/LayerId";
import { GeoFilter } from "@/types/geo/filters/GeoFilter";
import { getLayerId } from "@/types/geo/LayerInfo";
import { getCQLFilter, getGroupedCQLFilter } from "@/utils/filter-utils";
import * as R from "remeda";

export function useGeoFilters() {
  const { layers } = useActiveLayers((select) => ({
    layers: select.layers,
  }));

  const layersFilters: Record<
    LayerId,
    Record<string, GeoFilter | undefined>
  > = useMemo(() => {
    const layersFilters: Record<
      LayerId,
      Record<string, GeoFilter | undefined>
    > = {};

    layers.forEach((layer) => {
      if (layer.featureInfo?.filters) {
        layersFilters[getLayerId(layer)] = layer.featureInfo.filters;
      }
    });

    return layersFilters;
  }, [layers]);

  const groupedFiltersList: GeoFilter[][] = useMemo(() => {
    return Object.values(layersFilters).map((layerFilters) =>
      Object.values(layerFilters).filter((filter) => filter !== undefined)
    );
  }, [layersFilters]);

  const filtersList: GeoFilter[] = useMemo(() => {
    return Object.values(layersFilters)
      .flatMap((layerFilters) => Object.values(layerFilters))
      .filter((filter) => filter !== undefined);
  }, [layersFilters]);

  const CQLFilterByLayer: Record<LayerId, string> = useMemo(() => {
    return R.mapValues(layersFilters, (layerFilters) =>
      getCQLFilter(
        R.values(layerFilters).filter((filter) => filter !== undefined)
      )
    );
  }, [filtersList]);

  const joinedCQLFilter = useMemo(() => {
    return getGroupedCQLFilter(groupedFiltersList);
  }, [groupedFiltersList]);

  return {
    layersFilters,
    groupedFiltersList,
    filtersList,
    CQLFilterByLayer,
    joinedCQLFilter,
  };
}
