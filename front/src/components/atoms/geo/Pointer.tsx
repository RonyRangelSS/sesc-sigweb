import { FaMapMarkerAlt } from "react-icons/fa";
import { NavLink } from "react-router";

type PointerProps = {
  lat?: number;
  lng?: number;
};

export default function Pointer({ lat, lng }: PointerProps) {
  return (
    <NavLink to={`/mapa?lat=${lat}&lng=${lng}`}>
      <div className="items-center justify-center self-end rounded-full bg-[#0C4484] p-2">
        <FaMapMarkerAlt size={32} color="white" />
      </div>
    </NavLink>
  );
}
