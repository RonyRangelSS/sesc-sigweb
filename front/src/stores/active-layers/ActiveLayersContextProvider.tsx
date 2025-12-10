import {ReactNode, useCallback, useState} from "react";
import ActiveLayerInfo from "../../types/geo/ActiveLayerInfo.ts";
import LayerInfo from "../../types/geo/LayerInfo.ts";
import { _ActiveLayersContext } from "./_ActiveLayersContext.ts";


type ActiveLayersContextProviderProps = {
  children: ReactNode;
}


export default function ActiveLayersContextProvider({
  children,
}: ActiveLayersContextProviderProps) {
  const [layers, setLayers] = useState<Map<string, ActiveLayerInfo>>(new Map());

  function addLayer(layer: LayerInfo): void {
    setLayers((prev) => {
      const newLayer: ActiveLayerInfo = { ...layer, hidden: false };
      const next = new Map(prev);
      next.set(`${layer.namespace}:${layer.name}`, newLayer);
      return next;
    });
  }

  function removeLayer(layer: LayerInfo): void {
    setLayers((prev) => {
      const next = new Map(prev);
      next.delete(`${layer.namespace}:${layer.name}`);
      return next;
    });
  }

  const hasLayer = useCallback((layer: LayerInfo) => {
    return layers.has(`${layer.namespace}:${layer.name}`);
  }, [layers]);

  function hideLayer(hidden: boolean, layer: LayerInfo): void {
    setLayers((prev) => {
      const next = new Map(prev);
      const layerToHide = next.get(`${layer.namespace}:${layer.name}`);

      if (layerToHide) layerToHide.hidden = hidden;

      return next;
    })
  }

  return (
    <_ActiveLayersContext.Provider
        value={{
          layers: Array.from(layers.values()),
          addLayer,
          removeLayer,
          hasLayer,
          hideLayer
        }}>
      {children}
    </_ActiveLayersContext.Provider>
  );
};