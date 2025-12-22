import { useMemo } from "react";
import { allNonNullish } from "@/utils/object-utils";
import { fetchFeaturesIntersectingBuffer } from "@/api/FeatureService";
import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { pointGeometry } from "@/utils/geo-utils";
import { FeatureCollection } from "geojson";
import { BufferSettings } from "./useBufferSettings";
import { useLayersInfoFetcher } from "../useLayersInfoFetcher";
import { useGeoFilters } from "../../filters/useGeoFilters";
import { getLayerId } from "@/types/geo/LayerInfo";
import * as R from "remeda";

export function useLayersInfoBufferFetcher(bufferSettings: BufferSettings) {
  const { CQLFilterByLayer } = useGeoFilters();

  const fetchFn = useMemo(() => {
    if (!allNonNullish(bufferSettings) || !bufferSettings.isActive) {
      return undefined;
    }

    return (activeLayer: ActiveLayerInfo): Promise<FeatureCollection> =>
      fetchFeaturesIntersectingBuffer(
        activeLayer,
        pointGeometry(bufferSettings.origin!),
        bufferSettings.radius,
        bufferSettings.units,
        bufferSettings.steps,
        CQLFilterByLayer[getLayerId(activeLayer)]
      );
  }, [bufferSettings, CQLFilterByLayer]);

  const fetchData = useLayersInfoFetcher(
    [
      bufferSettings.origin?.lat || "undefined",
      bufferSettings.origin?.lng || "undefined",
      bufferSettings.radius,
      bufferSettings.units,
      bufferSettings.steps,
      R.values(CQLFilterByLayer).join(","),
    ],
    fetchFn
  );

  return {
    bufferSettings,
    fetchData,
  };
}
