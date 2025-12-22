import { cn } from "@/utils/style-utils";

export type TextFieldProps = {
  value?: string;
  placeholder?: string;
  onChange: (value: string | null) => void;
  classNames?: {
    input?: string;
    container?: string;
  };
  disabled?: boolean;
};

export const TextField = ({
  value,
  placeholder,
  onChange,
  classNames,
  disabled,
}: TextFieldProps) => {
  return (
    <div
      className={cn(
        "w-full bg-surface rounded-full",
        "border border-surface-container-darker  focus-within:border-primary",
        "shadow-inner-md",
        classNames?.container
      )}
    >
      <input
        type="text"
        className={cn(
          "w-full px-2 py-0.5 rounded-2xl outline-none",
          classNames?.input
        )}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ?? null)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
