import { LayersInfo } from '@/types/geo/LayersInfo';
import { create } from 'zustand';

type UseLayersInfoData = {
	layersInfo: LayersInfo;
	isFetching: boolean;
	isFeatchingFeaturesInfo: boolean;
};

type UseLayersInfoProps = UseLayersInfoData & {
	setData: (state: Omit<UseLayersInfoData, 'isFetching'>) => void;
	clear: () => void;
};

const initialState: UseLayersInfoData = {
	layersInfo: { featuresInfo: [] },
	isFeatchingFeaturesInfo: false,
	isFetching: false,
};

export const useLayersInfo = create<UseLayersInfoProps>()((set) => ({
	...initialState,
	setData: (data) => {
		set((state) => ({
			...state,
			...data,
			isFetching: data.isFeatchingFeaturesInfo,
		}));
	},
	clear: () => set(initialState),
}));
