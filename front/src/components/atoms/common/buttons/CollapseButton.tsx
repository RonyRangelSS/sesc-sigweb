import { cn } from "@/utils/style-utils";
import React, { Dispatch, forwardRef, SetStateAction, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export type CollapseButtonProps = {
  direction: "left" | "right" | "up" | "down";
  defaultIsOpen?: boolean;
  onClick?: (
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  classNames: {
    button?: string;
    icon?: string;
  };
};

export const CollapseButton = forwardRef<
  HTMLButtonElement,
  CollapseButtonProps
>(({ onClick, direction, defaultIsOpen = false, classNames }, ref) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const iconRotations: Record<CollapseButtonProps["direction"], string> = {
    left: isOpen ? "" : "rotate-180",
    right: isOpen ? "rotate-180" : "",
    up: isOpen ? "rotate-270" : "rotate-90",
    down: isOpen ? "rotate-90" : "rotate-270",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("CollapseButton clicked. Current isOpen:", isOpen);
    onClick ? onClick(setIsOpen, e) : setIsOpen((prev) => !prev);
  };

  return (
    <button ref={ref} onClick={handleClick} className={classNames.button}>
      <MdKeyboardDoubleArrowRight
        className={cn(
          "transition-transform duration-75 ease-in-out",
          classNames.icon,
          iconRotations[direction]
        )}
      />
    </button>
  );
});
