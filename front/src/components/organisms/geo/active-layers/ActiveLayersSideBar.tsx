import { SideBar } from "@/components/organisms/common/side-bar/SideBar.tsx";
import { ActiveLayersFloatingButton } from "./ActiveLayersFloatingButton.tsx";
import SideBarHeader from "@/components/molecules/common/side-bar/SideBarHeader.tsx";
import { useActiveLayers } from "@/hooks/geo/active-layers/useActiveLayers.ts";
import { ActiveLayersAccordion } from "./ActiveLayersAccordion.tsx";

type ActiveLayersSideBarProps = {
  container?: Element | DocumentFragment | null;
  position?: "left" | "right";
};

export default function ActiveLayersSideBar({
  container,
  position = "right",
}: ActiveLayersSideBarProps) {
  const { layers } = useActiveLayers((select) => ({
    layers: select.layers,
  }));

  return (
    <SideBar.Root
      position={position}
      trigger={<ActiveLayersFloatingButton />}
      container={container}
      classNames={{
        content: "bg-surface-container/80 flex flex-col",
      }}
    >
      <SideBarHeader
        direction={position}
        closable={true}
        title="Camadas Selecionadas"
      />
      <ActiveLayersAccordion
        layers={layers}
        className="flex-1 overflow-y-auto"
      />
    </SideBar.Root>
  );
}
