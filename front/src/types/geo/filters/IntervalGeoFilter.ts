import { Require } from "@/utils/type-utils";
import { GeoFilter } from "./GeoFilter";

export class IntervalGeoFilter<T extends number | Date> extends GeoFilter {
  min?: T;

  max?: T;

  constructor({
    layerId,
    field,
    max,
  }: Omit<IntervalGeoFilter<T>, "toCQLFilter" | "min">);

  constructor({
    layerId,
    field,
    min,
  }: Omit<IntervalGeoFilter<T>, "toCQLFilter" | "max">);

  constructor({
    layerId,
    field,
    min,
    max,
  }: Omit<Require<IntervalGeoFilter<T>, "min" | "max">, "toCQLFilter">);

  constructor({
    layerId,
    field,
    min,
    max,
  }: Omit<IntervalGeoFilter<T>, "toCQLFilter">) {
    super({ layerId, field, type: "Interval" });
    this.min = min;
    this.max = max;
  }

  toCQLFilter(): string {
    if (this.min && this.max) {
      return `${this.field} BETWEEN ${this.min} AND ${this.max}`;
    } else if (this.min) {
      return `${this.field} >= ${this.min}`;
    } else if (this.max) {
      return `${this.field} <= ${this.max}`;
    }
    throw new Error("Either min or max must be provided");
  }
}
