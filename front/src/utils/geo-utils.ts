import { point } from '@turf/helpers';
import type { Point } from 'geojson';
import { LatLng } from 'leaflet';

export function pointGeometry(latlng: [number, number] | LatLng): Point {
	if (latlng instanceof LatLng) return point([latlng.lng, latlng.lat]).geometry;
	return point([latlng[1], latlng[0]]).geometry;
}
