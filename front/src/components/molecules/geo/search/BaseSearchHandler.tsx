import { featureCollection } from "@turf/helpers";
import {
  GeoJSON as LGeoJSON,
  LatLng,
  LeafletMouseEvent,
  LeafletMouseEventHandlerFn,
  Map as LMap,
} from "leaflet";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import { Marker as RMarker } from "react-leaflet/Marker";
import { Feature, Point } from "geojson";
import { getFetchedFeaturesId } from "@/components/atoms/geo/feature-info-display/featureSearchAux";
import * as R from "remeda";
import { FetchedFeatureInfo } from "@/types/geo/FetchedFeatureInfo";

export type BaseSearchHandlerProps = {
  featureStrategy: "all" | "first";
  featuresInfo?: FetchedFeatureInfo[];
  isFetching: boolean;
  onMapClick: (e: LeafletMouseEvent, map: LMap) => void | Promise<void>;
  renderAdditionalLayers?: (markerPosition?: LatLng) => React.ReactNode;
  fitBoundsOptions?: {
    updateMarkerFromPointFeature?: boolean;
  };
};

export default function BaseSearchHandler({
  featureStrategy,
  featuresInfo,
  isFetching,
  onMapClick,
  renderAdditionalLayers,
  fitBoundsOptions,
}: BaseSearchHandlerProps) {
  const map = useMap();

  /// Feature Processing ///
  const processedFeatures = useMemo(() => {
    if (!featuresInfo) return [];

    if (featureStrategy === "first") {
      return featuresInfo.flatMap((fetchedFeatureInfo) => {
        if (fetchedFeatureInfo.features.length === 0) return [];
        return fetchedFeatureInfo.features[0];
      });
    }

    return featuresInfo.flatMap(
      (fetchedFeatureInfo) => fetchedFeatureInfo.features
    );
  }, [featuresInfo, featureStrategy]);

  /// Local State ///
  const [markerPosition, setMarkerPosition] = useState<LatLng | undefined>();

  /// Refs ///
  const geoJsonLayerRef = useRef<LGeoJSON | null>(null);
  const mapClickRef = useRef<LeafletMouseEventHandlerFn | null>(null);

  /// Effects ///
  useMapClickHandler(map, mapClickRef, onMapClick, setMarkerPosition);
  useFitBounds(
    map,
    geoJsonLayerRef,
    featuresInfo,
    processedFeatures,
    setMarkerPosition,
    fitBoundsOptions
  );

  /// Render ///
  if (isFetching || !featuresInfo) return null;

  return (
    <>
      <GeoJSON
        key={getFetchedFeaturesId(featuresInfo)}
        ref={geoJsonLayerRef}
        data={featureCollection(processedFeatures)}
        style={{
          color: "#56ee04",
        }}
      />
      {markerPosition && (
        <RMarker
          key={`${markerPosition.lat}-${markerPosition.lng}`}
          position={[markerPosition.lat, markerPosition.lng]}
        />
      )}
      {renderAdditionalLayers?.(markerPosition)}
    </>
  );
}

/// Effects ///
function useMapClickHandler(
  map: LMap,
  handleClickRef: MutableRefObject<LeafletMouseEventHandlerFn | null>,
  onMapClick: (e: LeafletMouseEvent, map: LMap) => void | Promise<void>,
  setMarkerPosition: (latlng: LatLng) => void
) {
  useEffect(() => {
    const activateClickHandler = (activate: boolean) => {
      if (!handleClickRef.current) return;

      if (activate) {
        map.on("click", handleClickRef.current);
      } else {
        map.off("click", handleClickRef.current);
      }
    };

    const handleClick = async (e: LeafletMouseEvent) => {
      activateClickHandler(false);
      setMarkerPosition(e.latlng);
      await onMapClick(e, map);
      activateClickHandler(true);
    };

    handleClickRef.current = handleClick;
    map.on("click", handleClick);

    return () => {
      activateClickHandler(false);
    };
  }, [map, onMapClick, setMarkerPosition]);
}

function useFitBounds(
  map: LMap,
  geoJsonLayerRef: React.RefObject<LGeoJSON | null>,
  featuresInfo?: FetchedFeatureInfo[],
  processedFeatures?: Feature[],
  setMarkerPosition?: (latlng: LatLng) => void,
  options?: { updateMarkerFromPointFeature?: boolean }
) {
  useEffect(() => {
    if (
      !geoJsonLayerRef.current ||
      R.isNullish(featuresInfo) ||
      featuresInfo.length === 0
    )
      return;

    // Optional: Update marker from point feature (PointSearchHandler specific)
    if (
      options?.updateMarkerFromPointFeature &&
      processedFeatures &&
      setMarkerPosition
    ) {
      const pointFeature = processedFeatures.find(
        (feature) => feature.geometry.type === "Point"
      );
      if (pointFeature) {
        setMarkerPosition({
          lat: (pointFeature.geometry as Point).coordinates[1],
          lng: (pointFeature.geometry as Point).coordinates[0],
        } as LatLng);
      }
    }

    map.fitBounds(geoJsonLayerRef.current.getBounds());
  }, [map, featuresInfo, processedFeatures, setMarkerPosition, options]);
}
