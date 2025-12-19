import { useActiveLayers } from "@/hooks/geo/active-layers/useActiveLayers";
import ActiveLayerInfo from "@/types/geo/ActiveLayerInfo";
import { LatLngBoundsExpression } from "leaflet";
import { useEffect } from "react";
import { useMap, WMSTileLayer } from "react-leaflet";

export const ActiveLayersRenderer = () => {
  const { layers } = useActiveLayers((select) => ({
    layers: select.layers,
  }));
  const map = useMap();

  useEffect(() => {
    // Filtra as camadas visíveis com BBOX válido
    const validBBoxes = layers
      .filter((layer) => !layer.hidden && layer.latLonBoundingBox)
      .map((layer) => layer.latLonBoundingBox!);

    if (validBBoxes.length === 0) return;

    // Calcula o BBOX englobando todas as camadas visíveis
    const south = Math.min(...validBBoxes.map((b) => b.miny));
    const west = Math.min(...validBBoxes.map((b) => b.minx));
    const north = Math.max(...validBBoxes.map((b) => b.maxy));
    const east = Math.max(...validBBoxes.map((b) => b.maxx));

    const bounds: LatLngBoundsExpression = [
      [south, west],
      [north, east],
    ];

    map.fitBounds(bounds, { padding: [20, 20] }); // Adiciona margem
  }, [layers, map]);

  const createLayer = (layer: ActiveLayerInfo, index: number) => {
    if (!layer || layer.hidden) return null;

    return (
      <WMSTileLayer
        url={layer.owsURL}
        layers={`${layer.namespace}:${layer.name}`}
        format="image/png"
        transparent={true}
        opacity={0.6}
        attribution={layer.attribution}
        key={index}
      />
    );
  };

  return <>{layers.map(createLayer)}</>;
};
