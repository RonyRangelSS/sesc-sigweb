import { LayerId } from "../LayerId";
import { GeoFilterType } from "./GeoFilterType";

export abstract class GeoFilter {
  layerId: LayerId;

  field: string;

  type: GeoFilterType;

  abstract toCQLFilter(): string;

  constructor({ layerId, field, type }: Omit<GeoFilter, "toCQLFilter">) {
    this.layerId = layerId;
    this.field = field;
    this.type = type;
  }
}
