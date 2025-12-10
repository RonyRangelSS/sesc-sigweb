import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getWorkspaces } from "../../../../api/GeoClient.ts";
import WorkspaceSection from "./WorkspaceLayersSection.tsx";
import { SideBar } from "../../common/side-bar/SideBar.tsx";
import { AvailableLayersFloatingButton } from "./AvailableLayersFloatingButton.tsx";
import SideBarHeader from "@/components/molecules/common/side-bar/SideBarHeader.tsx";

type AvailableLayersSideBarProps = {
  container?: Element | DocumentFragment | null;
  position?: "left" | "right";
};

export default function AvailableLayersSideBar({
  container,
  position = "right",
}: AvailableLayersSideBarProps) {
  const [workspaces, setWorkspaces] = useState<string[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setWorkspaces(await getWorkspaces());
    };
    fetchWorkspaces().finally();
  }, [setWorkspaces]);

  return (
    <SideBar.Root
      position={position}
      container={container}
      trigger={<AvailableLayersFloatingButton />}
      classNames={{
        content: "bg-surface-container/80",
      }}
    >
      <SideBarHeader
        direction={position}
        closable={true}
        title="Camadas Disponíveis"
      />
      {workspaces.map((name, i) => (
        <WorkspaceSection workspace={name} key={i} />
      ))}
    </SideBar.Root>
  );
}
