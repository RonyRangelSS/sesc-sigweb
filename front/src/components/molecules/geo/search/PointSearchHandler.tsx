import { point } from "@turf/helpers";
import { distance } from "@turf/distance";
import { LeafletMouseEvent, Map as LMap } from "leaflet";
import { useState } from "react";
import { useLayersInfoPointFetcher } from "@/hooks/geo/info-fetchers/point/useLayersInfoPointFetcher";
import { usePointSettings } from "@/hooks/geo/info-fetchers/point/usePointSettings";
import { useLayersInfo } from "@/hooks/geo/info-fetchers/useLayerInfo";
import BaseSearchHandler from "./BaseSearchHandler";

export default function PointSearchHandler() {
  /// Local States ///

  const [radius, setRadius] = useState<number>(0);

  /// Shared States ///

  const setPointOrigin = usePointSettings((state) => state.setOrigin);

  const pointSettings = usePointSettings((state) => state.pointSettings);

  useLayersInfoPointFetcher(pointSettings, radius);

  const {
    layersInfo: { featuresInfo },
    isFetching,
  } = useLayersInfo();

  /// Handlers ///

  const handleMapClick = async (e: LeafletMouseEvent, map: LMap) => {
    const clickScreenPoint = map.project(e.latlng);
    const lngLatPoint = point([e.latlng.lng, e.latlng.lat]).geometry;

    const bufferVertexScreenPoint = clickScreenPoint.add([10, 0]);
    const bufferVertexLatLng = map.unproject(bufferVertexScreenPoint);
    const bufferVertexLngLatPoint = point([
      bufferVertexLatLng.lng,
      bufferVertexLatLng.lat,
    ]).geometry;

    const calculatedRadius = distance(lngLatPoint, bufferVertexLngLatPoint, {
      units: "meters",
    });

    setPointOrigin(e.latlng);
    setRadius(calculatedRadius);
  };

  /// Render ///

  return (
    <BaseSearchHandler
      featureStrategy="first"
      featuresInfo={featuresInfo}
      isFetching={isFetching}
      onMapClick={handleMapClick}
      fitBoundsOptions={{
        updateMarkerFromPointFeature: true,
      }}
    />
  );
}
