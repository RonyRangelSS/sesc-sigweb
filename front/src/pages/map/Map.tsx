import "./Map.css";
import { Units } from "@turf/helpers";
import { Position } from "geojson";
import { ChangeEvent, MouseEventHandler, useRef, useState } from "react";
import { RiPencilRuler2Fill } from "react-icons/ri";
import { TbArrowBackUp } from "react-icons/tb";
import { FaTrash } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BackButton } from "@/components/atoms/common/buttons/BackButton";
import { Map as LMap } from "leaflet";
import ActiveLayersSideBar from "@/components/organisms/geo/active-layers/ActiveLayersSideBar";
import AvailableLayersSideBar from "@/components/organisms/geo/available-layers/AvailableLayersSideBar";
import Measurer from "@/components/molecules/geo/measurement/Measurer";
import BufferHandler from "@/components/molecules/geo/search/BufferSearchHandler";
import PointSearchHandler from "@/components/molecules/geo/search/PointSearchHandler";
import { useBufferSettings } from "@/hooks/geo/info-fetchers/buffer/useBufferSettings";
import { useShallow } from "zustand/react/shallow";
import { LayersInfoSiderBar } from "@/components/organisms/geo/layers-info/LayersInfoSideBar";
import { ActiveLayersRenderer } from "@/components/molecules/geo/renderers/ActiveLayersRenderer";

function MeasurementControlIcon({
  active,
  onClick,
  onUndo,
  onClear,
}: {
  active: boolean;
  onClick: MouseEventHandler<SVGAElement>;
  onUndo: MouseEventHandler<SVGAElement>;
  onClear: MouseEventHandler<SVGAElement>;
}) {
  return (
    <>
      <button
        className={`flex w-fit cursor-pointer flex-row-reverse items-center gap-4 rounded p-1.5 ${active ? "bg-gray-300" : "aspect-square bg-white"}`}
      >
        <RiPencilRuler2Fill size={32} onClick={onClick} />
        {active && (
          <>
            <TbArrowBackUp size={32} onClick={onUndo} className="text-black" />
            <FaTrash size={24} onClick={onClear} />
          </>
        )}
      </button>
    </>
  );
}

export default function MapPage() {
  const map = useRef<LMap | null>(null);

  const {
    isBufferActive,
    bufferRadius,
    bufferUnits,
    setBufferRadius,
    setBufferUnits,
    toggleIsBufferActive,
  } = useBufferSettings(
    useShallow((state) => ({
      isBufferActive: state.bufferSettings.isActive,
      bufferRadius: state.bufferSettings.radius,
      bufferUnits: state.bufferSettings.units,
      setBufferRadius: state.setRadius,
      setBufferUnits: state.setUnits,
      toggleIsBufferActive: state.toggleIsActive,
    }))
  );

  const handleBufferActivation = () => {
    toggleIsBufferActive();
  };

  const handleBufferRadiusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBufferRadius(e.target.valueAsNumber || 0);
  };

  const handleBufferUnitsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBufferUnits(e.target.value as Units);
  };

  /// 2. Local States ///
  const searchParams = new URLSearchParams(location.search);
  const markerRef = useRef<L.Marker | null>(null);

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const nome = searchParams.get("nome") || null;
  const foto = searchParams.get("foto") || null;
  const tipo = searchParams.get("tipo");
  const endereco = searchParams.get("endereco");

  const availableUnits: Units[] = ["kilometers", "meters", "millimetres"];

  const defaultCenter = { lat: -8.023348, lng: -34.905891 };

  const lat = parseFloat(searchParams.get("lat") || `${defaultCenter.lat}`);

  const lng = parseFloat(searchParams.get("lng") || `${defaultCenter.lng}`);

  const [pageRoot, setPageRoot] = useState<HTMLElement | null>(null);

  ////// 2.1. Measuring //////
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  const handleMeasuringActivation = () => {
    setIsMeasuring((prev) => !prev);
  };

  const [path, setPath] = useState<Position[]>([]);

  const onUndo = () => {
    setPath((prev) => prev.slice(0, -1));
  };

  const onClear = () => {
    setPath([]);
  };

  /// Render ///
  return (
    <div className="relative h-full w-screen!" ref={setPageRoot}>
      <div id="back-button" className="absolute top-2.5 left-2.5 z-500">
        <BackButton to="/" />
      </div>

      <section
        id="map-options"
        className="absolute top-2.5 left-16 z-500 max-w-[40%] rounded-xl bg-white p-1.5"
      >
        <label>
          Buffer
          <input
            checked={isBufferActive}
            onChange={handleBufferActivation}
            id="buffer-button"
            type="checkbox"
            className="ml-2"
          />
        </label>
        <div className="flex flex-col gap-2">
          <input
            className="w-full rounded-full bg-gray-200 px-2"
            value={bufferRadius}
            onChange={handleBufferRadiusChange}
            type="number"
            defaultValue={5}
          />
          <select
            value={bufferUnits}
            className="w-full max-w-full rounded-full bg-gray-200 px-2"
            onChange={handleBufferUnitsChange}
          >
            {availableUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section
        id="right-side-options"
        className="layout-container absolute top-0 right-0 z-500 flex h-full w-fit flex-col items-end gap-4 pt-2 pr-2.5"
      >
        <AvailableLayersSideBar container={pageRoot} />
        <ActiveLayersSideBar container={pageRoot} />
        <MeasurementControlIcon
          active={isMeasuring}
          onClick={handleMeasuringActivation}
          onUndo={onUndo}
          onClear={onClear}
        />
        <LayersInfoSiderBar container={pageRoot} />
      </section>

      <MapContainer
        className="leaflet-control-layers h-full w-screen!"
        center={[lat, lng]}
        zoom={12}
        ref={map}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
        {!isBufferActive && !isMeasuring && <PointSearchHandler />}
        <ActiveLayersRenderer />
        {isBufferActive && !isMeasuring && <BufferHandler />}

        {isMeasuring && <Measurer pathState={[path, setPath]} />}

        {latParam && lngParam && !isBufferActive && (
          <Marker
            position={[parseFloat(latParam), parseFloat(lngParam)]}
            ref={markerRef}
          >
            <Popup>
              <div
                style={{
                  width: "180px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {foto && (
                  <img
                    src={foto}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#111",
                  }}
                >
                  {nome}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "#444",
                  }}
                >
                  {endereco}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
