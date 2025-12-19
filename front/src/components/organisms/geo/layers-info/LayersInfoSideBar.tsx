import { useLayersInfo } from "@/hooks/geo/info-fetchers/useLayerInfo";
import { SideBar } from "../../common/side-bar/SideBar";
import { useShallow } from "zustand/react/shallow";
import { Tabs } from "radix-ui";
import { LayersInfoFloatingButton } from "./LayersInfoFloatingButton";
import SideBarHeader from "@/components/molecules/common/side-bar/SideBarHeader";
import { cn } from "@/utils/style-utils";

export type LayersInfoSideBarProps = {
  position?: "left" | "right";
  container?: Element | DocumentFragment | null;
};

export const LayersInfoSiderBar = ({
  position = "right",
  container,
}: LayersInfoSideBarProps) => {
  const {
    layersInfo: { featuresInfo },
  } = useLayersInfo(
    useShallow((state) => ({
      layersInfo: state.layersInfo,
      isFetching: state.isFetching,
    }))
  );

  const layersMap = featuresInfo.map(
    (value) =>
      [
        `${value.layerInfo.namespace}:${value.layerInfo.name}`,
        value.features,
      ] as const
  );

  const tabs = layersMap.map(([title, _], i) => (
    <Tabs.Trigger
      value={title}
      key={`tab-${title}-${i}`}
      className={cn(
        "text-base bg-surface-container-darker px-2 py-1 rounded-2xl shadow-sm",
        "font-medium radix-state-active:bg-primary radix-state-active:text-on-primary",
        "transition-all duration-300 cursor-pointer hover:scale-105"
      )}
    >
      {title}
    </Tabs.Trigger>
  ));

  const tabsContent = layersMap.map(([title, features], i) => (
    <Tabs.Content value={title} key={`tab-content-${title}-${i}`}>
      {features.map((feature) => (
        <div
          key={feature.id}
          className={cn(
            "mb-2 max-h-64 overflow-y-auto rounded-lg border shadow-sm",
            "bg-surface-container shadow-sm"
          )}
        >
          <header
            className={cn(
              "text-md text-on-primary font-medium sticky -top-px",
              "px-2 py-1 bg-primary border-b-2 border-b-black"
            )}
          >
            ID: {feature.id}
          </header>
          <ul className="mt-1 space-y-1 text-sm pb-2 px-2">
            {Object.entries(feature.properties).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold">{key}:</span> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Tabs.Content>
  ));

  if (layersMap.length === 0) return null;

  return (
    <SideBar.Root
      trigger={<LayersInfoFloatingButton />}
      position={position}
      container={container}
      classNames={{
        content: "bg-surface-container/80",
      }}
    >
      <Tabs.Root className="flex flex-col h-full">
        <SideBarHeader
          direction={position}
          closable={true}
          title="Resultados"
        />
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs.List
            className={cn(
              "border-b-2 border-b-primary",
              "flex flex-row gap-2",
              "p-2 overflow-x-auto"
            )}
          >
            {tabs}
          </Tabs.List>
          <div className="flex-1 min-h-0 overflow-y-auto pt-2 px-2">
            {tabsContent}
          </div>
        </div>
      </Tabs.Root>
    </SideBar.Root>
  );
};
