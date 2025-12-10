import useActiveLayersContext from '@/stores/active-layers/useActiveLayersContext';
import LayerInfo from '@/types/geo/LayerInfo';
import { useEffect, useState } from 'react';

type AvailableLayerItemProps = {
	layerInfo: LayerInfo;
};

export default function AvailableLayerItem({
	layerInfo,
}: AvailableLayerItemProps) {
	const { hasLayer, addLayer, removeLayer } = useActiveLayersContext();
	const [isLayerActive, setIsLayerActive] = useState(hasLayer(layerInfo));

	useEffect(() => {
		if (hasLayer(layerInfo)) {
			setIsLayerActive(true);
			return;
		}
		setIsLayerActive(false);
	}, [hasLayer, layerInfo]);

	const onSelect = () => {
		if (isLayerActive) {
			removeLayer(layerInfo);
			setIsLayerActive(false);
			return;
		}
		addLayer(layerInfo);
		setIsLayerActive(true);
	};

	return (
		<span
			className='flex'
			onClick={onSelect}
		>
			<input
				type='checkbox'
				onChange={onSelect}
				checked={isLayerActive}
			/>
			<span className='ml-2 truncate'>{layerInfo.name}</span>
		</span>
	);
}
