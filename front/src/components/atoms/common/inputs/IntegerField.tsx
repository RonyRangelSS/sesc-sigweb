import { cn } from "@/utils/style-utils";
import { NumericFormat } from "react-number-format";

export type IntegerFieldProps = {
  value?: number;
  onChange: (value: number | null) => void;
  classNames?: {
    input?: string;
    container?: string;
  };
  disabled?: boolean;
  min?: number;
  max?: number;
  negative?: boolean;
  allowLeadingZeros?: boolean;
};

export const IntegerField = ({
  value,
  onChange,
  classNames,
  disabled,
  min,
  max,
  negative = false,
  allowLeadingZeros = false,
}: IntegerFieldProps) => {
  return (
    <div className={cn(classNames?.container)}>
      <NumericFormat
        className={cn(
          "w-full rounded-full bg-gray-200 px-2",
          classNames?.input
        )}
        value={value ?? ""}
        onValueChange={(values) => {
          onChange(values.floatValue ?? null);
        }}
        disabled={disabled}
        allowNegative={negative}
        decimalScale={0}
        allowLeadingZeros={allowLeadingZeros}
        min={min}
        max={max}
        isAllowed={(values) => {
          const { floatValue } = values;
          if (floatValue === undefined) return true;
          return (
            (min === undefined || floatValue >= min) &&
            (max === undefined || floatValue <= max)
          );
        }}
      />
    </div>
  );
};
