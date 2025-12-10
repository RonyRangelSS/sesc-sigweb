import { FaSearch } from "react-icons/fa";
import logoSESC from "/logo_SESC.png";
import { NavLink } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex flex-row items-center justify-between bg-[#0C4484] p-4">
      <NavLink to="/" className="flex items-center gap-2">
        <img src={logoSESC} alt="Logomarca do SESC" />
      </NavLink>
    </header>
  );
}
