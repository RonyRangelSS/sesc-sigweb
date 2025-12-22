import { LayerAttributesMetadata } from "./LayerAttributesMetadata";

export interface LayerMetadata {
  attributes: Record<string, LayerAttributesMetadata | undefined>;
}
