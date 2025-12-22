import { GeoFilter } from "./filters/GeoFilter";
import { LayerAttributesMetadata } from "./metadata/LayerAttributesMetadata";
import { AttributeType } from "./AttributeType";

export default interface FeatureInfo {
  /**
   * Attributes of the layer.
   *
   * ```AttributeName -> { type: string; metadata: LayerAttributesMetadata }```
   */
  attributes: Record<
    string,
    { type: AttributeType; metadata: LayerAttributesMetadata }
  >;
  /**
   * Filters applied to the layer.
   *
   * ```LayerId -> Field -> GeoFilter[]```
   */
  filters: Record<string, GeoFilter | undefined>;
}
