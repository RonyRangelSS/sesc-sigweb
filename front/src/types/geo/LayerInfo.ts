import BoundingBox from "./BoundingBox.ts";
import FeatureInfo from "./FeatureInfo.ts";


export default interface LayerInfo {
  owsURL: string;
  name: string;
  namespace: string;
  title?: string;
  description?: string;
  attribution: string;
  nativeBoundingBox?: BoundingBox;
  latLonBoundingBox?: Omit<BoundingBox, 'crs'> & { crs: 'EPSG:4326' };
  featureInfo?: FeatureInfo;
}
