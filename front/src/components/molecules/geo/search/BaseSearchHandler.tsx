import { featureCollection } from "@turf/helpers";
import {
  GeoJSON as LGeoJSON,
  LatLng,
  LeafletMouseEvent,
  LeafletMouseEventHandlerFn,
  Map as LMap,
  circleMarker,
} from "leaflet";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useMap, GeoJSON, Popup } from "react-leaflet";
import { Marker as RMarker } from "react-leaflet/Marker";
import { Feature, MultiPoint, Point } from "geojson";
import { getFetchedFeaturesId } from "@/components/atoms/geo/feature-info-display/featureSearchAux";
import * as R from "remeda";
import { FetchedFeatureInfo } from "@/types/geo/FetchedFeatureInfo";
import FeaturePopup from "@/components/atoms/geo/feature-info-display/FeaturePopup";

export type BaseSearchHandlerProps = {
  featureStrategy: "all" | "first";
  featuresInfo?: FetchedFeatureInfo[];
  isFetching: boolean;
  onMapClick: (e: LeafletMouseEvent, map: LMap) => void | Promise<void>;
  renderAdditionalLayers?: (markerPosition?: LatLng) => React.ReactNode;
  snapMarkerToPointFeature?: boolean;
  useMarkerPopup?: boolean;
};

export default function BaseSearchHandler({
  featureStrategy,
  featuresInfo,
  isFetching,
  onMapClick,
  renderAdditionalLayers,
  snapMarkerToPointFeature = false,
  useMarkerPopup = false,
}: BaseSearchHandlerProps) {
  const map = useMap();

  console.log("Chamou");

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
      (fetchedFeatureInfo) => fetchedFeatureInfo.features,
    );
  }, [featuresInfo, featureStrategy]);

  /// Local State ///
  const [markerPosition, setMarkerPosition] = useState<LatLng | undefined>();

  /// Refs ///
  const geoJsonLayerRef = useRef<LGeoJSON | null>(null);
  const mapClickRef = useRef<LeafletMouseEventHandlerFn | null>(null);

  /// Effects ///
  useMapClickHandler(map, mapClickRef, onMapClick, setMarkerPosition);
  useMarkerHandler(
    setMarkerPosition,
    processedFeatures,
    snapMarkerToPointFeature,
  );
  useFitBounds(map, geoJsonLayerRef, processedFeatures);
  useCursorManagement(map, isFetching);

  /// Render ///
  const pointToLayer = (_: Feature<Point>, latlng: LatLng) => {
    return circleMarker(latlng, {
      radius: 6,
      fillColor: "#56ee04",
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });
  };

  return (
    <>
      {featuresInfo && processedFeatures.length > 0 && (
        <GeoJSON
          key={getFetchedFeaturesId(featuresInfo)}
          ref={geoJsonLayerRef}
          data={featureCollection(processedFeatures)}
          style={{
            color: "#56ee04",
          }}
          pointToLayer={pointToLayer}
        />
      )}
      {markerPosition && (
        <RMarker
          key={`${markerPosition.lat}-${markerPosition.lng}`}
          position={[markerPosition.lat, markerPosition.lng]}
        >
          {useMarkerPopup && featuresInfo && featuresInfo.length > 0 && (
            <FeaturePopup fetchedFeatures={featuresInfo} />
          )}
        </RMarker>
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
  setMarkerPosition: (latlng: LatLng) => void,
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

function useCursorManagement(map: LMap, isFetching: boolean) {
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    if (isFetching) {
      container.style.cursor = "wait";
    } else {
      container.style.cursor = "";
    }

    return () => {
      container.style.cursor = "";
    };
  }, [map, isFetching]);
}

function useMarkerHandler(
  setMarkerPosition: (latlng: LatLng) => void,
  processedFeatures?: Feature[],
  snapMarkerToPointFeature?: boolean,
) {
  useEffect(() => {
    if (snapMarkerToPointFeature && processedFeatures && setMarkerPosition) {
      const pointFeature = processedFeatures.find(
        (feature) => feature.geometry.type === "MultiPoint",
      ) as Feature<MultiPoint>;

      const coordinates = pointFeature?.geometry.coordinates[0];

      if (pointFeature) {
        setMarkerPosition({
          lat: coordinates[1],
          lng: coordinates[0],
        } as LatLng);
      }
    }
  }, [processedFeatures, setMarkerPosition, snapMarkerToPointFeature]);
}

function useFitBounds(
  map: LMap,
  geoJsonLayerRef: React.RefObject<LGeoJSON | null>,
  processedFeatures?: Feature[],
) {
  useEffect(() => {
    if (
      !geoJsonLayerRef.current ||
      R.isNullish(processedFeatures) ||
      processedFeatures.length === 0
    )
      return;

    map.fitBounds(geoJsonLayerRef.current.getBounds());
  }, [map, processedFeatures]);
}
