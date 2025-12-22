import { cn } from "@/utils/style-utils";
import { Select } from "./Select";

export type BooleanFieldProps = {
  value?: boolean;
  onChange: (value: boolean | null) => void;
  classNames?: {
    input?: string;
    container?: string;
  };
  disabled?: boolean;
};

export const BooleanField = ({
  value,
  onChange,
  classNames,
  disabled,
}: BooleanFieldProps) => {
  return (
    <div className={cn(classNames?.container)}>
      <Select.SingleOption
        options={[
          { label: "Verdadeiro", value: true },
          { label: "Falso", value: false },
        ]}
        value={value === undefined ? null : value}
        onChange={(value) => onChange(value)}
        isDisabled={disabled}
        isClearable={true}
      />
    </div>
  );
};
