import { GeoFilter } from "./GeoFilter";
import * as R from "remeda";

export class IntervalGeoFilter<T extends number | Date> extends GeoFilter {
  min?: T;

  max?: T;

  constructor({
    layerId,
    attribute,
    max,
  }: Omit<IntervalGeoFilter<T>, "toCQLFilter" | "min" | "type">);

  constructor({
    layerId,
    attribute,
    min,
  }: Omit<IntervalGeoFilter<T>, "toCQLFilter" | "max" | "type">);

  constructor({
    layerId,
    attribute,
    min,
    max,
  }: Omit<IntervalGeoFilter<T>, "toCQLFilter" | "type">);

  constructor({ layerId, attribute, min, max }: IntervalGeoFilter<T>) {
    super({ layerId, attribute, type: "Interval" });
    this.min = min;
    this.max = max;
  }

  toCQLFilter(): string {
    const min =
      this.min instanceof Date ? `'${this.min.toISOString()}'` : this.min;

    const max =
      this.max instanceof Date ? `'${this.max.toISOString()}'` : this.max;

    if (R.isDefined(this.min) && R.isDefined(this.max)) {
      return `"${this.attribute}" >= ${min} AND "${this.attribute}" <= ${max}`;
    } else if (R.isDefined(this.min)) {
      return `"${this.attribute}" >= ${min}`;
    } else if (R.isDefined(this.max)) {
      return `"${this.attribute}" <= ${max}`;
    }
    throw new Error("Either min or max must be provided");
  }
}
