import { Feature, FeatureCollection, Position } from "geojson";
import { Polygon, Point } from "geojson";
import { geojsonToWKT } from "@terraformer/wkt";
import { buffer } from "@turf/buffer";
import {
  Units,
  polygon as createPolygon,
  point as createPoint,
} from "@turf/helpers";

const owsUrl = import.meta.env.VITE_GEOSERVER_URL;

type LayerID = { name: string; namespace: string };
const getLayerID = (layerID: LayerID) => `${layerID.namespace}:${layerID.name}`;

function getWFSGetFeatureURL(layers: LayerID[], cqlFilter: string = "") {
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeNames: layers.map(getLayerID).join(","),
    outputFormat: "application/json",
    CQL_FILTER: cqlFilter,
    srsName: "EPSG:4326",
  });

  return `${owsUrl}/ows?${params}`;
}

// CONVERSORES
/**
 * Função que irá converter as coordenadas no formato EPSG:4326,
 * ou seja [lng lat], padrão do GeoJSON, para coordenadas do formato [lat lng]
 */
type LatLngConversor = (coordinates: Position) => Position;
function defaultLatLngConversor(coordinates: Position): Position {
  return [coordinates[1], coordinates[0]];
}
function correctPolygon(
  polygon: Polygon,
  latLngConversor: LatLngConversor
): Polygon {
  return createPolygon(
    polygon.coordinates.map((line) =>
      line.map((point) => latLngConversor(point))
    ),
    undefined,
    { bbox: polygon.bbox }
  ).geometry;
}
function correctPoint(point: Point, latLngConversor: LatLngConversor): Point {
  return createPoint(latLngConversor(point.coordinates), undefined, {
    bbox: point.bbox,
  }).geometry;
}

// FETCH FUNCTIONS
export async function fetchFeatures(
  layers: LayerID[],
  cqlFilter: string
): Promise<FeatureCollection> {
  const response = await fetch(getWFSGetFeatureURL(layers, cqlFilter));
  return (await response.json()) as FeatureCollection;
}

export async function fetchFeaturesIntersects(
  layer: LayerID,
  polygon: Polygon,
  latLngConversor: LatLngConversor = defaultLatLngConversor
): Promise<FeatureCollection> {
  const correctedPolygon = correctPolygon(polygon, latLngConversor);

  const cqlFilter = `INTERSECTS(geom, ${geojsonToWKT(correctedPolygon)})`;
  const response = await fetch(getWFSGetFeatureURL([layer], cqlFilter));

  return (await response.json()) as FeatureCollection;
}

export async function fetchFeaturesIntersectingBuffer(
  layer: LayerID,
  origin: Point,
  radius: number,
  units: Units = "kilometers",
  steps: number = 5,
  latLngConversor: LatLngConversor = defaultLatLngConversor
): Promise<FeatureCollection> {
  const bufferPolygon = buffer(origin, radius, {
    units,
    steps,
  }) as Feature<Polygon>;
  return await fetchFeaturesIntersects(
    layer,
    bufferPolygon.geometry,
    latLngConversor
  );
}

export async function fetchFeaturesInPoint(
  layer: LayerID,
  position: Point,
  latLngConversor: LatLngConversor = defaultLatLngConversor
): Promise<FeatureCollection> {
  const correctedPoint = correctPoint(position, latLngConversor);

  const cqlFilter = `INTERSECTS(geom, ${geojsonToWKT(correctedPoint)})`;
  const response = await fetch(getWFSGetFeatureURL([layer], cqlFilter));

  return (await response.json()) as FeatureCollection;
}
