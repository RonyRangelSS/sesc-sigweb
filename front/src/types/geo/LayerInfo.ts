import BoundingBox from "./BoundingBox.ts";
import FeatureInfo from "./FeatureInfo.ts";
import { layerId } from "./LayerId.ts";
import { LayerId } from "./LayerId.ts";

export default interface LayerInfo {
  owsURL: string;
  name: string;
  namespace: string;
  title?: string;
  description?: string;
  attribution: string;
  nativeBoundingBox?: BoundingBox;
  latLonBoundingBox?: Omit<BoundingBox, "crs"> & { crs: "EPSG:4326" };
  featureInfo?: FeatureInfo;
}

export function getLayerId(layerInfo: LayerInfo): LayerId {
  return layerId(layerInfo.namespace, layerInfo.name);
}
