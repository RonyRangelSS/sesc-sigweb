import { GeoFilter } from "./filters/GeoFilter";
import { LayerAttributesMetadata } from "./metadata/LayerAttributesMetadata";
import { LayerId } from "./LayerId";

export default interface FeatureInfo {
  /**
   * Attributes of the layer.
   *
   * ```AttributeName -> { type: string; metadata: LayerAttributesMetadata }```
   */
  attributes: Record<
    string,
    { type: string; metadata: LayerAttributesMetadata }
  >;
  /**
   * Filters applied to the layer.
   *
   * ```LayerId -> Field -> GeoFilter[]```
   */
  filters: Record<LayerId, Record<string, GeoFilter>>;
}
