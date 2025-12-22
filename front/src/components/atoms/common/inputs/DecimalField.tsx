import { cn } from "@/utils/style-utils";
import { NumericFormat } from "react-number-format";

export type DecimalFieldProps = {
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
  precision?: number;
  placeholder?: string;
};

export const DecimalField = ({
  value,
  onChange,
  classNames,
  disabled,
  min,
  max,
  negative = true,
  precision = 2,
  placeholder,
}: DecimalFieldProps) => {
  return (
    <div
      className={cn(
        "w-full bg-surface rounded-2xl",
        "border border-surface-container-darker  focus-within:border-primary",
        "shadow-inner-md",
        classNames?.container
      )}
    >
      <NumericFormat
        className={cn(
          "w-full px-2 py-0.5 rounded-2xl outline-none",
          classNames?.input
        )}
        value={value ?? ""}
        onValueChange={(values) => {
          onChange(values.floatValue ?? null);
        }}
        disabled={disabled}
        placeholder={placeholder}
        decimalScale={precision}
        fixedDecimalScale={false}
        allowNegative={negative}
        thousandSeparator="."
        decimalSeparator=","
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
