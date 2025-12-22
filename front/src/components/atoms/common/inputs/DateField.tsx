// TODO: Refactor this component to use radix-ui/popover.
// There's too much boilerplate code.

import { cn } from "@/utils/style-utils";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseButton } from "../buttons/CloseButton";

export type DateFieldProps = {
  classNames?: {
    input?: string;
    container?: string;
  };
  disabled?: boolean;
  min?: Date;
  max?: Date;
};

export type SingleDateFieldProps = DateFieldProps & {
  value?: Date;
  onChange: (value: Date | null) => void;
  placeholder?: string;
};

export const SingleDateField = ({
  value,
  onChange,
  placeholder = "Selecione uma data",
  classNames,
  disabled,
  min,
  max,
}: SingleDateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      setInputValue(format(value, "dd/MM/yyyy", { locale: ptBR }));
    } else {
      setInputValue("");
    }
  }, [value]);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        popupRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use click instead of mousedown to allow calendar interactions
      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("click", handleClickOutside, true);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  // Calculate popup position (centered on screen)
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Center the popup on screen
      const popupWidth = 350; // Approximate width of calendar
      const popupHeight = 350; // Approximate height of calendar
      setPopupPosition({
        top: window.scrollY + window.innerHeight / 2 - popupHeight / 2,
        left: window.scrollX + window.innerWidth / 2 - popupWidth / 2,
      });
    }
  }, [isOpen]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      // Don't close automatically - user must click X or outside
    } else {
      onChange(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the input
    const parsedDate = parseDateInput(newValue);
    if (parsedDate) {
      onChange(parsedDate);
    } else if (newValue === "") {
      onChange(null);
    }
  };

  const parseDateInput = (input: string): Date | null => {
    // Try DD/MM/YYYY format
    const parts = input.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (
        !isNaN(date.getTime()) &&
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        return date;
      }
    }
    return null;
  };

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative w-full bg-surface rounded-full",
          "border border-surface-container-darker focus-within:border-primary",
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
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          onClick={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
        />
      </div>
      {isOpen &&
        popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-[9999] pointer-events-auto"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div className="relative bg-surface-container border border-surface-container-darker rounded-lg shadow-lg p-2">
              <CloseButton
                onClick={() => setIsOpen(false)}
                classNames={{
                  button: "absolute top-2 right-2 z-10",
                  icon: "text-on-surface-container opacity-70 hover:opacity-100 transition-opacity text-lg!",
                }}
              />
              <DayPicker
                mode="single"
                selected={value}
                onSelect={handleSelect}
                disabled={disabled}
                fromDate={min}
                toDate={max}
                locale={ptBR}
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-4",
                  caption:
                    "flex justify-between items-center pt-1 relative mb-4 px-1",
                  caption_label:
                    "text-sm font-medium text-on-surface flex-1 text-center",
                  nav: "flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    "border border-surface-container-darker rounded",
                    "hover:bg-surface-container-darker text-on-surface"
                  ),
                  nav_button_previous: "",
                  nav_button_next: "",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-on-surface-container w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    "rounded-full hover:bg-surface-container-darker text-on-surface",
                    "focus:bg-surface-container-darker"
                  ),
                  day_selected:
                    "bg-primary text-on-primary hover:bg-primary hover:text-on-primary focus:bg-primary focus:text-on-primary",
                  day_today: "font-semibold",
                  day_outside: "opacity-50",
                  day_disabled: "opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export type RangeDateFieldProps = DateFieldProps & {
  value?: DateRange;
  onChange: (value: DateRange | null) => void;
  placeholder?: string;
};

export const RangeDateField = ({
  value,
  onChange,
  placeholder = "Selecione um intervalo",
  classNames,
  disabled,
  min,
  max,
}: RangeDateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Update input value when value prop changes
  useEffect(() => {
    if (value?.from && value?.to) {
      const fromStr = format(value.from, "dd/MM/yyyy", { locale: ptBR });
      const toStr = format(value.to, "dd/MM/yyyy", { locale: ptBR });
      setInputValue(`${fromStr} - ${toStr}`);
    } else if (value?.from) {
      const fromStr = format(value.from, "dd/MM/yyyy", { locale: ptBR });
      setInputValue(`${fromStr} - ...`);
    } else if (value?.to) {
      const toStr = format(value.to, "dd/MM/yyyy", { locale: ptBR });
      setInputValue(`... - ${toStr}`);
    } else {
      setInputValue("");
    }
  }, [value]);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        popupRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use click instead of mousedown to allow calendar interactions
      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("click", handleClickOutside, true);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  // Calculate popup position (centered on screen)
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Center the popup on screen
      const popupWidth = 350; // Approximate width of single-month calendar
      const popupHeight = 350; // Approximate height of calendar
      setPopupPosition({
        top: window.scrollY + window.innerHeight / 2 - popupHeight / 2,
        left: window.scrollX + window.innerWidth / 2 - popupWidth / 2,
      });
    }
  }, [isOpen]);

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange(range);
      // Don't close automatically - user must click X or outside
    } else {
      onChange(null);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative w-full bg-surface rounded-full",
          "border border-surface-container-darker focus-within:border-primary",
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
          value={inputValue}
          readOnly
          onFocus={() => !disabled && setIsOpen(true)}
          onClick={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {isOpen &&
        popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-[9999] pointer-events-auto"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div className="relative bg-surface-container border border-surface-container-darker rounded-lg shadow-lg p-2">
              <CloseButton
                onClick={() => setIsOpen(false)}
                classNames={{
                  button: "absolute top-2 right-2 z-10",
                  icon: "text-on-surface-container opacity-70 hover:opacity-100 transition-opacity text-lg!",
                }}
              />
              <DayPicker
                mode="range"
                selected={value}
                onSelect={handleSelect}
                disabled={disabled}
                fromDate={min}
                toDate={max}
                locale={ptBR}
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-4",
                  caption:
                    "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-sm font-medium text-on-surface",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    "border border-surface-container-darker rounded",
                    "hover:bg-surface-container-darker text-on-surface"
                  ),
                  nav_button_previous: "",
                  nav_button_next: "",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-on-surface-container w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    "rounded-full hover:bg-surface-container-darker text-on-surface",
                    "focus:bg-surface-container-darker"
                  ),
                  day_selected:
                    "bg-primary text-on-primary hover:bg-primary hover:text-on-primary focus:bg-primary focus:text-on-primary",
                  day_range_start: "bg-primary text-on-primary rounded-l-full",
                  day_range_end: "bg-primary text-on-primary rounded-r-full",
                  day_range_middle:
                    "aria-selected:bg-primary/50 aria-selected:text-on-primary",
                  day_today: "font-semibold",
                  day_outside: "opacity-50",
                  day_disabled: "opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export const DateField = {
  Single: SingleDateField,
  Range: RangeDateField,
};
