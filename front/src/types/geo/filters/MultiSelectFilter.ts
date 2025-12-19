import { GeoFilter } from "./GeoFilter";

export class MultiSelectFilter extends GeoFilter {
  values: string[];

  constructor({
    layerId,
    field,
    values,
  }: Omit<MultiSelectFilter, "toCQLFilter">) {
    super({ layerId, field, type: "MultiSelect" });
    this.values = values;
  }

  toCQLFilter(): string {
    return `${this.field} IN (${this.values.join(",")})`;
  }
}
