import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { GeoJSON, Popup, useMap } from "react-leaflet";
import { LeafletMouseEvent, PathOptions, LatLng, circleMarker } from "leaflet";
import { LineString, Point, Position, Feature } from "geojson";
import { lineString, point, geometryCollection, feature } from "@turf/helpers";
import { length } from "@turf/length";


type MeasurerProps = {
  pathState: [Position[], Dispatch<SetStateAction<Position[]>>];
}


export default function Measurer({
  pathState: [path, setPath],
}: MeasurerProps) {
  const map = useMap();

  useEffect(() => {
    const clickHandler = (e: LeafletMouseEvent) => {
      const position: Position = [e.latlng.lng, e.latlng.lat];
      setPath((prev) => [...prev, position]);
    };

    map.on("click", clickHandler);

    return () => {
      map.off("click", clickHandler);
    }
  }, [map, setPath]);


  return (<PathLayer path={path}/>);
}


function PathLayer({
  path,
}: { path: Position[] }): ReactNode {
  const pathFeature = createPathFeature(path);

  if (!pathFeature) return null;

  const vertices: Point[] = path.map(position => point(position).geometry);
  const group = geometryCollection([pathFeature, ...vertices]);
  const lastPosition: Position = path[path.length - 1];

  const pathStyle: PathOptions = {
    color: '#001b9f',
    stroke: true,
    weight: 4,
  };
  const pointToLayer = (_: Feature<Point>, latlng: LatLng) => circleMarker(
      latlng,
      {
        radius: 4,
        ...pathStyle
      }
  );

  const distance = pathFeature.type === 'Point'
    ? 0
    : length(feature(pathFeature), {units: 'kilometers'});

  return (<>
    <Popup
      position={new LatLng(lastPosition[1], lastPosition[0])}
    >
      {`${distance.toFixed(4)} km`}
    </Popup>
    <GeoJSON
      key={path.length}
      data={group}
      style={pathStyle}
      pointToLayer={pointToLayer}
    />
  </>);
}


function createPathFeature(path: Position[]): undefined | Point | LineString {
  if (path.length === 0) return undefined;
  if (path.length === 1) return point(path[0]).geometry;
  return lineString(path).geometry;
}
