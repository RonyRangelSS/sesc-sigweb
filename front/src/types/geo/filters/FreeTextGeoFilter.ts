import { GeoFilter } from "./GeoFilter";

export class FreeTextGeoFilter extends GeoFilter {
  value: string;

  constructor({
    layerId,
    field,
    value,
  }: Omit<FreeTextGeoFilter, "toCQLFilter" | "type">) {
    super({ layerId, field, type: "FreeTextSearch" });
    this.value = value;
  }

  toCQLFilter(): string {
    return `${this.field} ILIKE '%${this.value}%'`;
  }
}
