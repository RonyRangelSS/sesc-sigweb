import { GeoFilter } from "@/types/geo/filters/GeoFilter";

export function getCQLFilter(filters: GeoFilter[]): string {
  return filters.map((filter) => `(${filter.toCQLFilter()})`).join(" AND ");
}
