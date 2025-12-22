import { LayerId } from "../LayerId";
import { GeoFilterType } from "./GeoFilterType";

export abstract class GeoFilter {
  layerId: LayerId;

  attribute: string;

  type: GeoFilterType;

  abstract toCQLFilter(): string;

  constructor({ layerId, attribute, type }: Omit<GeoFilter, "toCQLFilter">) {
    this.layerId = layerId;
    this.attribute = attribute;
    this.type = type;
  }
}
