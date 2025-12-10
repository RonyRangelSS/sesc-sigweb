import { forwardRef } from "react";
import { TbEyeFilled } from "react-icons/tb";

export const ActiveLayersFloatingButton = forwardRef<HTMLButtonElement>(
  (props, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className="aspect-square w-fit cursor-pointer rounded bg-white p-1.5"
      >
        <TbEyeFilled size={32} />
      </button>
    );
  }
);

ActiveLayersFloatingButton.displayName = "ActiveLayersFloatingButton";
