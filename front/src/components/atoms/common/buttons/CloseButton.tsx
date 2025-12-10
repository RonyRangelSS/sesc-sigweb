import { cn } from "@/utils/style-utils";
import { forwardRef } from "react";
import { IoMdClose } from "react-icons/io";

export type CloseButtonProps = {
  classNames?: {
    button?: string;
    icon?: string;
  };
  onClick?: () => void;
};

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ classNames, onClick }, ref) => {
    return (
      <button ref={ref} className={classNames?.button} onClick={onClick}>
        <IoMdClose size={40} className={cn("text-primary", classNames?.icon)} />
      </button>
    );
  }
);
