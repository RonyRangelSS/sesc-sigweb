import logoSESC from "/logo_SESC.png";
import { NavLink } from "react-router";
import { cn } from "@/utils/style-utils";

export default function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-1000 flex flex-row",
        "items-center justify-between bg-primary p-4",
        "shadow-md",
      )}
    >
      <NavLink to="/" className="flex items-center gap-2">
        <img src={logoSESC} alt="Logomarca do SESC" />
      </NavLink>
    </header>
  );
}
