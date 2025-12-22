import { GeoFilter } from "./GeoFilter";

export class BooleanGeoFilter extends GeoFilter {
  value: boolean;

  constructor({
    layerId,
    attribute,
    value,
  }: Omit<BooleanGeoFilter, "toCQLFilter" | "type">) {
    super({ layerId, attribute, type: "Boolean" });
    this.value = value;
  }

  toCQLFilter(): string {
    return `${this.attribute} = '${this.value}'`;
  }
}
