declare module '@terraformer/wkt' {
  import {Geometry, GeometryCollection} from "geojson";
  export function wktToGeoJSON(WKT: string): Geometry;
  export function geojsonToWKT(GeoJSON: Geometry | GeometryCollection): string;
}