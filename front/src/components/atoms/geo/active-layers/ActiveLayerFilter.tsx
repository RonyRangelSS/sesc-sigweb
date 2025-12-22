import {
  AttributeType,
  isBooleanAttribute,
  isDecimalAttribute,
  isIntegerAttribute,
  isNumericAttribute,
  isTemporalAttribute,
  isTextAttribute,
} from "@/types/geo/AttributeType";
import { LayerAttributesMetadata } from "@/types/geo/metadata/LayerAttributesMetadata";
import { Select, Option } from "../../common/inputs/Select";
import { GeoFilter } from "@/types/geo/filters/GeoFilter";
import { MultiSelectFilter } from "@/types/geo/filters/MultiSelectFilter";
import { LayerId } from "@/types/geo/LayerId";
import { BooleanField } from "../../common/inputs/BooleanField";
import { ActionMeta } from "react-select";
import { useCallback, useMemo } from "react";
import { BooleanGeoFilter } from "@/types/geo/filters/BooleanGeoFilter";
import { FreeTextGeoFilter } from "@/types/geo/filters/FreeTextGeoFilter";
import { TextField } from "../../common/inputs/TextField";
import { IntervalGeoFilter } from "@/types/geo/filters/IntervalGeoFilter";
import { DecimalField } from "../../common/inputs/DecimalField";
import { IntegerField } from "../../common/inputs/IntegerField";
import { DateField } from "../../common/inputs/DateField";
import { DateRange } from "react-day-picker";

export type ActiveLayerAttributeFilterProps = {
  layerId: LayerId;
  attribute: string;
  type: AttributeType;
  metadata: LayerAttributesMetadata;
  addFilter: (filter: GeoFilter) => void;
  removeFilter: (attribute: string) => void;
  getFilter: (attribute: string) => GeoFilter | undefined;
};

export const BooleanAttributeFilter = ({
  layerId,
  attribute,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerAttributeFilterProps) => {
  const filter = useMemo(
    () => getFilter(attribute) as BooleanGeoFilter | undefined,
    [attribute, getFilter]
  );

  const onChange = useCallback(
    (value: boolean | null) => {
      if (value === null) {
        removeFilter(attribute);
      } else {
        addFilter(new BooleanGeoFilter({ layerId, attribute, value }));
      }
    },
    [attribute, addFilter, removeFilter]
  );

  return <BooleanField value={filter?.value} onChange={onChange} />;
};

export const IntegerAttributeFilter = ({
  layerId,
  metadata,
  attribute,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerAttributeFilterProps) => {
  const filter = useMemo(
    () => getFilter(attribute) as IntervalGeoFilter<number> | undefined,
    [attribute, getFilter]
  );

  const rangeMin = useMemo(() => metadata.range?.minNumber, [metadata]);

  const rangeMax = useMemo(() => metadata.range?.maxNumber, [metadata]);

  const min = useMemo(() => filter?.min, [filter, rangeMin]);

  const max = useMemo(() => filter?.max, [filter, rangeMax]);

  const onChangeMin = useCallback(
    (value: number | null) => {
      if (value === null && max === undefined) {
        removeFilter(attribute);
      } else {
        addFilter(
          new IntervalGeoFilter<number>({
            layerId,
            attribute,
            min: value === null ? undefined : value,
            max,
          })
        );
      }
    },
    [attribute, addFilter, removeFilter, layerId, max]
  );

  const onChangeMax = useCallback(
    (value: number | null) => {
      if (value === null && min === undefined) {
        removeFilter(attribute);
      } else {
        addFilter(
          new IntervalGeoFilter<number>({
            layerId,
            attribute,
            min,
            max: value === null ? undefined : value,
          })
        );
      }
    },
    [attribute, addFilter, removeFilter, layerId, min]
  );

  return (
    <div className="flex flex-col">
      <IntegerField
        value={max}
        onChange={onChangeMax}
        classNames={{ container: "rounded-b-none" }}
        min={rangeMin}
        max={rangeMax}
      />
      <IntegerField
        value={min}
        onChange={onChangeMin}
        classNames={{ container: "rounded-t-none" }}
        min={rangeMin}
        max={rangeMax}
      />
    </div>
  );
};

export const DecimalAttributeFilter = ({
  layerId,
  metadata,
  attribute,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerAttributeFilterProps) => {
  const filter = useMemo(
    () => getFilter(attribute) as IntervalGeoFilter<number> | undefined,
    [attribute, getFilter]
  );

  const rangeMin = useMemo(() => metadata.range?.minNumber, [metadata]);

  const rangeMax = useMemo(() => metadata.range?.maxNumber, [metadata]);

  const min = useMemo(() => filter?.min, [filter, rangeMin]);

  const max = useMemo(() => filter?.max, [filter, rangeMax]);

  const onChangeMin = useCallback(
    (value: number | null) => {
      if (value === null && max === undefined) {
        removeFilter(attribute);
      } else {
        addFilter(
          new IntervalGeoFilter<number>({
            layerId,
            attribute,
            min: value === null ? undefined : value,
            max,
          })
        );
      }
    },
    [attribute, addFilter, removeFilter, layerId, max]
  );

  const onChangeMax = useCallback(
    (value: number | null) => {
      if (value === null && min === undefined) {
        removeFilter(attribute);
      } else {
        addFilter(
          new IntervalGeoFilter<number>({
            layerId,
            attribute,
            min,
            max: value === null ? undefined : value,
          })
        );
      }
    },
    [attribute, addFilter, removeFilter, layerId, min]
  );

  return (
    <div className="flex flex-col">
      <DecimalField
        value={max}
        onChange={onChangeMax}
        classNames={{ container: "rounded-b-none" }}
      />
      <DecimalField
        value={min}
        onChange={onChangeMin}
        classNames={{ container: "rounded-t-none" }}
      />
    </div>
  );
};

export const TemporalAttributeFilter = ({
  layerId,
  metadata,
  attribute,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerAttributeFilterProps) => {
  const filter = useMemo(
    () => getFilter(attribute) as IntervalGeoFilter<Date> | undefined,
    [attribute, getFilter]
  );

  const rangeMin = useMemo(() => metadata.range?.minDate, [metadata]);

  const rangeMax = useMemo(() => metadata.range?.maxDate, [metadata]);

  const value = useMemo(() => {
    if (!filter) return undefined;
    return {
      from: filter.min,
      to: filter.max,
    };
  }, [filter]);

  const onChange = useCallback(
    (range: DateRange | null) => {
      if (!range || (!range.from && !range.to)) {
        removeFilter(attribute);
      } else {
        addFilter(
          new IntervalGeoFilter<Date>({
            layerId,
            attribute,
            min: range.from,
            max: range.to,
          })
        );
      }
    },
    [attribute, addFilter, removeFilter, layerId]
  );

  return (
    <DateField.Range
      value={value}
      onChange={onChange}
      min={rangeMin}
      max={rangeMax}
    />
  );
};

export const FreeTextAttributeFilter = ({
  layerId,
  attribute,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerAttributeFilterProps) => {
  const filter = useMemo(
    () => getFilter(attribute) as FreeTextGeoFilter | undefined,
    [attribute, getFilter]
  );

  const onChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        removeFilter(attribute);
      } else {
        addFilter(new FreeTextGeoFilter({ layerId, attribute, value }));
      }
    },
    [attribute, addFilter, removeFilter]
  );

  return <TextField value={filter?.value ?? undefined} onChange={onChange} />;
};

export const MultiSelectAttributeFilter = ({
  layerId,
  attribute,
  metadata,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerAttributeFilterProps) => {
  const options = useMemo(
    () =>
      metadata.enum?.map((option) => ({
        label: option,
        value: option,
      })),
    [metadata.enum]
  );

  const filter = getFilter(attribute) as MultiSelectFilter | undefined;

  const values = useMemo(() => {
    return filter?.values ?? [];
  }, [filter]);

  const onChange = (values: string[], action: ActionMeta<Option<string>>) => {
    if (action.action === "clear" || values.length === 0) {
      removeFilter(attribute);
      return;
    }
    addFilter(new MultiSelectFilter({ layerId, attribute, values }));
  };

  return (
    <Select.MultiOption
      options={options ?? []}
      values={values}
      isClearable={true}
      onChange={onChange}
    />
  );
};

export const ActiveLayerAttributeFilter = (
  props: ActiveLayerAttributeFilterProps
) => {
  const { type, metadata } = props;
  if (isBooleanAttribute(type)) {
    return <BooleanAttributeFilter {...props} />;
  } else if (isIntegerAttribute(type)) {
    return <IntegerAttributeFilter {...props} />;
  } else if (isDecimalAttribute(type)) {
    return <DecimalAttributeFilter {...props} />;
  } else if (isTemporalAttribute(type)) {
    return <TemporalAttributeFilter {...props} />;
  } else if (isTextAttribute(type) && metadata.enum) {
    return <MultiSelectAttributeFilter {...props} />;
  } else if (isTextAttribute(type)) {
    return <FreeTextAttributeFilter {...props} />;
  }

  console.warn(`Invalid attribute type for ActiveLayerFilter: ${type}`);
  return null;
};
