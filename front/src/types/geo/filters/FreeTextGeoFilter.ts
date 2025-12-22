import { GeoFilter } from "./GeoFilter";

export class FreeTextGeoFilter extends GeoFilter {
  value: string;

  constructor({
    layerId,
    attribute,
    value,
  }: Omit<FreeTextGeoFilter, "toCQLFilter" | "type">) {
    super({ layerId, attribute, type: "FreeTextSearch" });
    this.value = value;
  }

  toCQLFilter(): string {
    return `${this.attribute} ILIKE '%${this.value}%'`;
  }
}
