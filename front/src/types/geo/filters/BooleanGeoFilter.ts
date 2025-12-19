import { GeoFilter } from "./GeoFilter";

export class BooleanGeoFilter extends GeoFilter {
  value: boolean;

  constructor({
    layerId,
    field,
    value,
  }: Omit<BooleanGeoFilter, "toCQLFilter">) {
    super({ layerId, field, type: "Boolean" });
    this.value = value;
  }

  toCQLFilter(): string {
    return `${this.field} = ${this.value}`;
  }
}
