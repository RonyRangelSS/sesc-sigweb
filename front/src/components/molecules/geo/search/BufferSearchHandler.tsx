import { buffer } from "@turf/buffer";
import { point } from "@turf/helpers";
import { LatLng, LeafletMouseEvent } from "leaflet";
import { GeoJSON } from "react-leaflet";
import { useLayersInfoBufferFetcher } from "@/hooks/geo/info-fetchers/buffer/useLayersInfoBufferFetcher";
import { useBufferSettings } from "@/hooks/geo/info-fetchers/buffer/useBufferSettings";
import { useLayersInfo } from "@/hooks/geo/info-fetchers/useLayerInfo";
import BaseSearchHandler from "./BaseSearchHandler";

export default function BufferHandler() {
  /// Shared States ///

  const setBufferOrigin = useBufferSettings((state) => state.setOrigin);

  const bufferSettings = useBufferSettings((state) => state.bufferSettings);

  const { radius, units, steps } = bufferSettings;

  useLayersInfoBufferFetcher(bufferSettings);

  const {
    layersInfo: { featuresInfo },
    isFetching,
  } = useLayersInfo();

  /// Handlers ///

  const handleMapClick = (e: LeafletMouseEvent) => {
    setBufferOrigin(e.latlng);
  };

  const renderBufferLayer = (markerPosition?: LatLng) => {
    if (!markerPosition) return null;

    return (
      <GeoJSON
        key={`buffer:${markerPosition.lat}-${markerPosition.lng}`}
        data={
          buffer(point([markerPosition.lng, markerPosition.lat]), radius, {
            steps,
            units,
          })!
        }
      />
    );
  };

  /// Render ///

  return (
    <BaseSearchHandler
      featureStrategy="all"
      featuresInfo={featuresInfo}
      isFetching={isFetching}
      onMapClick={handleMapClick}
      renderAdditionalLayers={renderBufferLayer}
    />
  );
}
