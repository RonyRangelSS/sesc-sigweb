import {createContext} from "react";
import ActiveLayerInfo from "../../types/geo/ActiveLayerInfo.ts";
import LayerInfo from "../../types/geo/LayerInfo.ts";


type ActiveLayersContextProps = {
  layers: ActiveLayerInfo[];
  addLayer: (layer: LayerInfo) => void;
  removeLayer: (layer: LayerInfo) => void;
  hasLayer: (layer: LayerInfo) => boolean;
  hideLayer: (hidden: boolean, layer: ActiveLayerInfo) => void;
}


export const _ActiveLayersContext = createContext<ActiveLayersContextProps>({
  layers: [],
  addLayer: (_layer: LayerInfo) => {},
  removeLayer: (_layer: LayerInfo) => {},
  hasLayer: (_layer: LayerInfo) => false,
  hideLayer: (_hidden: boolean, _layer: LayerInfo) => {},
});
