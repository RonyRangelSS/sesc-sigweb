import { GeoFilter } from "./GeoFilter";

export class MultiSelectFilter extends GeoFilter {
  values: string[];

  constructor({
    layerId,
    attribute,
    values,
  }: Omit<MultiSelectFilter, "toCQLFilter" | "type">) {
    super({ layerId, attribute, type: "MultiSelect" });
    this.values = values;
  }

  toCQLFilter(): string {
    return `${this.attribute} IN ('${this.values.join("','")}')`;
  }
}
