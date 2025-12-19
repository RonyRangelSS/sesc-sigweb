import { MapCacheKeys } from "@/constants/cache-keys/map-cache-keys";
import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { FetchedFeatureInfo } from "@/types/geo/FetchedFeatureInfo";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";
import { useLayersInfo } from "./useLayerInfo";
import { useEffect } from "react";
import { useActiveLayers } from "@/hooks/geo/active-layers/useActiveLayers";

export function useLayersInfoFetcher(
  keys: (string | number)[],
  fetchFunc?: (activeLayer: ActiveLayerInfo) => Promise<FeatureCollection>
) {
  const { layers } = useActiveLayers((select) => ({
    layers: select.layers,
  }));

  const { data: featuresInfo, isFetching: isFetchingFeaturesInfo } = useQuery({
    queryKey: [MapCacheKeys.LAYERS_INFO, ...keys],
    queryFn: () =>
      fetchFunc ? fetchFeatures(layers, fetchFunc) : Promise.resolve([]),
    enabled: layers.length > 0,
    staleTime: 0,
  });

  useLayersInfoSyncer(featuresInfo, isFetchingFeaturesInfo);
}

/// Auxiliary Functions ///
export async function fetchFeatures(
  layers: ActiveLayerInfo[],
  fetchFunc: (activeLayer: ActiveLayerInfo) => Promise<FeatureCollection>
): Promise<FetchedFeatureInfo[]> {
  const fetchedFeatures = layers
    .filter((layer) => layer.featureInfo !== undefined)
    .map(async (layer) => {
      const featureCollection = await fetchFunc(layer);

      return {
        layerInfo: layer,
        features: featureCollection.features,
      } as FetchedFeatureInfo;
    });

  const resolvedFeatures = await Promise.all(fetchedFeatures);

  return resolvedFeatures.filter((feature) => feature.features.length > 0);
}

/// Effects ///
function useLayersInfoSyncer(
  featuresInfo: FetchedFeatureInfo[] | undefined,
  isFetchingFeaturesInfo: boolean
) {
  const { setData } = useLayersInfo();

  useEffect(() => {
    setData({
      layersInfo: { featuresInfo: featuresInfo || [] },
      isFeatchingFeaturesInfo: isFetchingFeaturesInfo,
    });
  }, [featuresInfo, isFetchingFeaturesInfo, setData]);
}
