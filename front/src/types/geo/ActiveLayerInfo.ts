import { LayerId } from "./LayerId.ts";
import LayerInfo from "./LayerInfo.ts";
import { GeoFilter } from "./filters/GeoFilter.ts";

export default interface ActiveLayerInfo extends LayerInfo {
  hidden: boolean;
  /**
   * Filters applied to the layer.
   *
   * ```LayerId -> Field -> GeoFilter[]```
   */
  filters: Record<LayerId, Record<string, GeoFilter>>;
}
