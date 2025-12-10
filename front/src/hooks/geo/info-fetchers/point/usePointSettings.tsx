import { LatLng } from "leaflet";
import { create } from "zustand";

export type PointSettings = {
  isActive: boolean;
  origin: LatLng | undefined;
};

type PointSettingsProps = {
  pointSettings: PointSettings;
  setPointSettings: (settings: PointSettings) => void;
  setOrigin: (origin: LatLng) => void;
  clear: () => void;
};

const initialState: PointSettings = {
  isActive: false,
  origin: undefined,
};

export const usePointSettings = create<PointSettingsProps>()((set) => {
  const setPointSettings = (
    settings: (state: PointSettings) => Partial<PointSettings>
  ) => {
    set((state) => ({
      ...state,
      pointSettings: {
        ...state.pointSettings,
        ...settings(state.pointSettings),
      },
    }));
  };

  return {
    pointSettings: initialState,
    setPointSettings: (pointSettings) => setPointSettings(() => pointSettings),
    setOrigin: (origin) => setPointSettings(() => ({ origin })),
    clear: () => set((state) => ({ ...state, pointSettings: initialState })),
  };
});
