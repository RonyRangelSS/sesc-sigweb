export const IntegerAttribute = ["Integer", "Long", "Short"] as const;

export type IntegerAttribute = (typeof IntegerAttribute)[number];

export function isIntegerAttribute(
  attribute: string
): attribute is IntegerAttribute {
  return IntegerAttribute.includes(attribute as IntegerAttribute);
}

export const DecimalAttribute = ["BigDecimal", "Double", "Float"] as const;

export type DecimalAttribute = (typeof DecimalAttribute)[number];

export function isDecimalAttribute(
  attribute: string
): attribute is DecimalAttribute {
  return DecimalAttribute.includes(attribute as DecimalAttribute);
}

export const NumericAttribute = [
  ...IntegerAttribute,
  ...DecimalAttribute,
] as const;

export type NumericAttribute = (typeof NumericAttribute)[number];

export function isNumericAttribute(
  attribute: string
): attribute is NumericAttribute {
  return NumericAttribute.includes(attribute as NumericAttribute);
}

export const TextAttribute = ["String", "UUID"] as const;

export type TextAttribute = (typeof TextAttribute)[number];

export function isTextAttribute(attribute: string): attribute is TextAttribute {
  return TextAttribute.includes(attribute as TextAttribute);
}

export const TemporalAttribute = ["Date", "Timestamp", "DateTime"] as const;

export type TemporalAttribute = (typeof TemporalAttribute)[number];

export function isTemporalAttribute(
  attribute: string
): attribute is TemporalAttribute {
  return TemporalAttribute.includes(attribute as TemporalAttribute);
}

export const BooleanAttribute = ["Boolean"] as const;

export type BooleanAttribute = (typeof BooleanAttribute)[number];

export function isBooleanAttribute(
  attribute: string
): attribute is BooleanAttribute {
  return BooleanAttribute.includes(attribute as BooleanAttribute);
}

export const SpatialAttribute = [
  "Geometry",
  "Point",
  "LineString",
  "Polygon",
  "MultiPoint",
  "MultiLineString",
  "MultiPolygon",
  "GeometryCollection",
] as const;

export type SpatialAttribute = (typeof SpatialAttribute)[number];

export function isSpatialAttribute(
  attribute: string
): attribute is SpatialAttribute {
  return SpatialAttribute.includes(attribute as SpatialAttribute);
}

export type AttributeType =
  | NumericAttribute
  | TextAttribute
  | TemporalAttribute
  | BooleanAttribute
  | SpatialAttribute;

export function isAttributeType(attribute: string): attribute is AttributeType {
  return (
    isNumericAttribute(attribute) ||
    isTextAttribute(attribute) ||
    isTemporalAttribute(attribute) ||
    isBooleanAttribute(attribute) ||
    isSpatialAttribute(attribute)
  );
}
