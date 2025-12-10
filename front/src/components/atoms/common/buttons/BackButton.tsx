import { cn } from "@/utils/style-utils";
import { FaChevronLeft } from "react-icons/fa";
import { NavLink } from "react-router";

type BackButtonProps = {
  to: string;
  classNames?: {
    button?: string;
    icon?: string;
  };
};

export const BackButton = ({ to, classNames }: BackButtonProps) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "hover:cursor-pointer hover:scale-110 bg-primary text-on-primary",
        "p-2 rounded-full flex items-center justify-center",
        classNames?.button
      )}
    >
      <FaChevronLeft size={32} className={classNames?.icon} />
    </NavLink>
  );
};
