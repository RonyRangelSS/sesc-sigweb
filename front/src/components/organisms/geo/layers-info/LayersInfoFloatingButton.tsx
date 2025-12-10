import { cn } from "@/utils/style-utils";
import { forwardRef } from "react";
import { MdInfo } from "react-icons/md";

export const LayersInfoFloatingButton = forwardRef<HTMLButtonElement>(
  (props, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "bg-surface-container aspect-square w-fit hover:cursor-pointer",
          "p-1.5 rounded"
        )}
      >
        <MdInfo className={"animate-pulse"} size={32} />
      </button>
    );
  }
);

LayersInfoFloatingButton.displayName = "LayersInfoFloatingButton";
