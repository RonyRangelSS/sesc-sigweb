import { Units } from '@turf/helpers';
import { LatLng } from 'leaflet';
import { create } from 'zustand';

export type BufferSettings = {
	isActive: boolean;
	origin: LatLng | undefined;
	radius: number;
	units: Units;
	steps: number;
};

type BufferSettingsProps = {
	bufferSettings: BufferSettings;
	setBufferSettings: (settings: BufferSettings) => void;
	setOrigin: (origin: LatLng) => void;
	setRadius: (radius: number) => void;
	setUnits: (units: Units) => void;
	setSteps: (steps: number) => void;
	setIsActive: (isActive: boolean) => void;
	toggleIsActive: () => void;
	clear: () => void;
};

const initialState: BufferSettings = {
	isActive: false,
	origin: undefined,
	radius: 5,
	units: 'kilometers',
	steps: 5,
};

export const useBufferSettings = create<BufferSettingsProps>()((set) => {
	const setBufferSettings = (
		settings: (state: BufferSettings) => Partial<BufferSettings>
	) => {
		set((state) => ({
			...state,
			bufferSettings: {
				...state.bufferSettings,
				...settings(state.bufferSettings),
			},
		}));
	};

	return {
		bufferSettings: initialState,
		setBufferSettings: (bufferSettings) =>
			setBufferSettings(() => bufferSettings),
		setOrigin: (origin) => setBufferSettings(() => ({ origin })),
		setRadius: (radius) => setBufferSettings(() => ({ radius })),
		setUnits: (units) => setBufferSettings(() => ({ units })),
		setSteps: (steps) => setBufferSettings(() => ({ steps })),
		setIsActive: (isActive) => setBufferSettings(() => ({ isActive })),
		toggleIsActive: () =>
			setBufferSettings((state) => ({ isActive: !state.isActive })),
		clear: () => set((state) => ({ ...state, bufferSettings: initialState })),
	};
});
