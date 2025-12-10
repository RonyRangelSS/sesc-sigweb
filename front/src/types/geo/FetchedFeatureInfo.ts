import { Feature, Geometry } from 'geojson';
import LayerInfo from './LayerInfo';

export interface FetchedFeatureInfo {
	layerInfo: LayerInfo;
	features: Feature<Geometry, Record<string, unknown>>[];
}
