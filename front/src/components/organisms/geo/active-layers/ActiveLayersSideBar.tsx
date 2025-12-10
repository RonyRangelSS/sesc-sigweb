import useActiveLayersContext from "../../../../stores/active-layers/useActiveLayersContext.ts";
import ActiveLayerItem from "../../../atoms/geo/active-layers-control/ActiveLayerItem.tsx";
import { SideBar } from "@/components/organisms/common/side-bar/SideBar.tsx";
import { ActiveLayersFloatingButton } from "./ActiveLayersFloatingButton.tsx";
import SideBarHeader from "@/components/molecules/common/side-bar/SideBarHeader.tsx";

type ActiveLayersSideBarProps = {
  container?: Element | DocumentFragment | null;
  position?: "left" | "right";
};

export default function ActiveLayersSideBar({
  container,
  position = "right",
}: ActiveLayersSideBarProps) {
  const { layers } = useActiveLayersContext();

  return (
    <SideBar.Root
      position={position}
      trigger={<ActiveLayersFloatingButton />}
      container={container}
      classNames={{
        content: "bg-surface-container/80",
      }}
    >
      <SideBarHeader
        direction={position}
        closable={true}
        title="Camadas Selecionadas"
      />
      {layers.map((layer, index) => (
        <ActiveLayerItem activeLayer={layer} key={index} />
      ))}
    </SideBar.Root>
  );
}
