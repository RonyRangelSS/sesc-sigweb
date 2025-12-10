import { useMemo } from 'react';
import { allNonNullish } from '@/utils/object-utils';
import { fetchFeaturesIntersectingBuffer } from '@/api/FeatureService';
import ActiveLayerInfo from '@/types/geo/ActiveLayerInfo';
import { pointGeometry } from '@/utils/geo-utils';
import { FeatureCollection } from 'geojson';
import { BufferSettings } from './useBufferSettings';
import { useLayersInfoFetcher } from '../useLayersInfoFetcher';

export function useLayersInfoBufferFetcher(bufferSettings: BufferSettings) {
	const fetchFn = useMemo(() => {
		if (!allNonNullish(bufferSettings) || !bufferSettings.isActive) {
			return undefined;
		}

		return (activeLayer: ActiveLayerInfo): Promise<FeatureCollection> =>
			fetchFeaturesIntersectingBuffer(
				activeLayer,
				pointGeometry(bufferSettings.origin!),
				bufferSettings.radius,
				bufferSettings.units
			);
	}, [bufferSettings]);

	const fetchData = useLayersInfoFetcher(
		[
			bufferSettings.origin?.lat || 'undefined',
			bufferSettings.origin?.lng || 'undefined',
			bufferSettings.radius,
			bufferSettings.units,
			bufferSettings.steps,
		],
		fetchFn
	);

	return {
		bufferSettings,
		fetchData,
	};
}
