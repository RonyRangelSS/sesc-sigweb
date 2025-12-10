import useActiveLayersContext from '../../../../stores/active-layers/useActiveLayersContext.ts';
import ActiveLayerInfo from '../../../../types/geo/ActiveLayerInfo.ts';
import { RiEyeCloseLine, RiEyeFill } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa6';

type ActiveLayerItemProps = {
	activeLayer: ActiveLayerInfo;
};

export default function ActiveLayerItem({ activeLayer }: ActiveLayerItemProps) {
	const { hideLayer, removeLayer } = useActiveLayersContext();

	const onHide = () => {
		hideLayer(!activeLayer.hidden, activeLayer);
	};

	const onDelete = () => {
		removeLayer(activeLayer);
	};

	return (
		<div className='flex items-center gap-2 bg-gray-700 px-4 py-2 text-[1.2rem] text-white'>
			<span className='mb-1 truncate'>{activeLayer.name}</span>
			{activeLayer.hidden ? (
				<RiEyeCloseLine
					size={24}
					onClick={onHide}
				/>
			) : (
				<RiEyeFill
					size={24}
					onClick={onHide}
				/>
			)}
			<FaTrash
				size={24}
				onClick={onDelete}
			/>
		</div>
	);
}
