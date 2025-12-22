import { useMemo } from "react";
import { fetchFeaturesIntersectingBuffer } from "@/api/FeatureService";
import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { pointGeometry } from "@/utils/geo-utils";
import { FeatureCollection } from "geojson";
import { PointSettings } from "./usePointSettings";
import { useLayersInfoFetcher } from "../useLayersInfoFetcher";
import { useGeoFilters } from "../../filters/useGeoFilters";
import { getLayerId } from "@/types/geo/LayerInfo";

export function useLayersInfoPointFetcher(
  pointSettings: PointSettings,
  radius: number
) {
  const { CQLFilterByLayer } = useGeoFilters();

  const fetchFn = useMemo(() => {
    if (!pointSettings.origin || radius === 0) {
      return undefined;
    }

    return (activeLayer: ActiveLayerInfo): Promise<FeatureCollection> =>
      fetchFeaturesIntersectingBuffer(
        activeLayer,
        pointGeometry(pointSettings.origin!),
        radius,
        "meters",
        5,
        CQLFilterByLayer[getLayerId(activeLayer)]
      );
  }, [pointSettings, radius, CQLFilterByLayer]);

  const fetchData = useLayersInfoFetcher(
    [
      pointSettings.origin?.lat || "undefined",
      pointSettings.origin?.lng || "undefined",
      radius,
    ],
    fetchFn
  );

  return {
    pointSettings,
    fetchData,
  };
}
