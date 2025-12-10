import ActiveLayerInfo from '@/types/geo/ActiveLayerInfo';
import { FetchedFeatureInfo } from '@/types/geo/FetchedFeatureInfo';
import LayerInfo from '@/types/geo/LayerInfo';
import { Feature, FeatureCollection, Geometry } from 'geojson';

export async function fetchFeatures(
	layers: ActiveLayerInfo[],
	fetchFunc: (activeLayer: ActiveLayerInfo) => Promise<FeatureCollection>
) {
	const fetchedFeatures = layers
		.filter((layer) => layer.featureInfo !== undefined)
		.map(async (layer) => {
			const featureCollection = await fetchFunc(layer);

			return {
				layerInfo: layer,
				features: featureCollection.features,
			} as FetchedFeatureInfo;
		});

	const resolvedFeatures = await Promise.all(fetchedFeatures);

	return resolvedFeatures.filter((feature) => feature.features.length > 0);
}

export function getFetchedFeaturesId(
	fetchedFeaturesInfo: FetchedFeatureInfo[]
): string {
	return fetchedFeaturesInfo
		.flatMap((fetchedFeaturesInfo) =>
			fetchedFeaturesInfo.features.map((f) => f.id)
		)
		.join(', ');
}
