import { FaAlignJustify, FaHome, FaMap } from "react-icons/fa";
import { NavLink } from "react-router";
import { twMerge } from "tailwind-merge";

export default function Footer() {
  return (
    <div
      className={twMerge(
        "sticky bottom-0 z-1000 flex w-full flex-row items-center",
        "bg-primary justify-around px-8 py-4 shadow-t-md",
      )}
    >
      <NavLink to="/">
        <FaHome size={32} className="text-on-primary" />
      </NavLink>
      <NavLink to="/mapa">
        <FaMap size={32} className="text-on-primary" />
      </NavLink>
      {/* <FaAlignJustify
        size={32}
        className="text-on-primary hover:cursor-pointer"
      /> */}
    </div>
  );
}
