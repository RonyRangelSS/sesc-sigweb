import { forwardRef } from "react";
import { BiSolidLayerPlus } from "react-icons/bi";

export const AvailableLayersFloatingButton = forwardRef<HTMLButtonElement>(
  (props, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className="aspect-square w-fit cursor-pointer rounded bg-white p-1.5"
      >
        <BiSolidLayerPlus size={32} />
      </button>
    );
  }
);

AvailableLayersFloatingButton.displayName = "AvailableLayersFloatingButton";
