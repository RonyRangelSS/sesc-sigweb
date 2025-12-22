import ActiveLayerInfo from "../../../../types/geo/ActiveLayerInfo.ts";
import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa6";
import { useActiveLayers } from "@/hooks/geo/active-layers/useActiveLayers.ts";
import { cn } from "@/utils/style-utils.ts";
import { getLayerId } from "@/types/geo/LayerInfo.ts";
import { Accordion } from "@/components/organisms/common/accordion/Accordion.tsx";
import { IoMdArrowDropdown } from "react-icons/io";
import FeatureInfo from "@/types/geo/FeatureInfo.ts";
import * as R from "remeda";
import { isSpatialAttribute } from "@/types/geo/AttributeType.ts";
import { ActiveLayerAttributeFilter } from "./ActiveLayerFilter.tsx";
import { GeoFilter } from "@/types/geo/filters/GeoFilter.ts";
import { useCallback } from "react";

export type ActiveLayerFeatureInfoContentProps = {
  activeLayer: Omit<ActiveLayerInfo, "featureInfo"> & {
    featureInfo: FeatureInfo;
  };
  addFilter: (filter: GeoFilter) => void;
  removeFilter: (attribute: string) => void;
  getFilter: (attribute: string) => GeoFilter | undefined;
};

const ActiveLayerFeatureInfoContent = ({
  activeLayer,
  addFilter,
  removeFilter,
  getFilter,
}: ActiveLayerFeatureInfoContentProps) => {
  const attributes = R.entries(activeLayer.featureInfo.attributes).filter(
    ([_, value]) => !isSpatialAttribute(value.type)
  );

  return (
    <div className="flex flex-col gap-2">
      {attributes.map(([name, value], i) => (
        <div key={`${activeLayer.name}-${i}`} className="shadow-sm px-4 py-2">
          <span className="font-semibold">{name}:</span> {value.type}
          <ActiveLayerAttributeFilter
            layerId={getLayerId(activeLayer)}
            attribute={name}
            type={value.type}
            metadata={activeLayer.metadata.attributes[name] ?? {}}
            addFilter={addFilter}
            removeFilter={removeFilter}
            getFilter={getFilter}
          />
        </div>
      ))}
    </div>
  );
};

export type ActiveLayerAccordionItemProps = {
  activeLayer: ActiveLayerInfo;
};

export default function ActiveLayerAccordionItem({
  activeLayer,
}: ActiveLayerAccordionItemProps) {
  /// Shared State ///

  const {
    hideLayer,
    removeLayer,
    addFilter: ogAddFilter,
    removeFilter: ogRemoveFilter,
    getFilter: ogGetFilter,
  } = useActiveLayers((select) => ({
    hideLayer: select.hideLayer,
    removeLayer: select.removeLayer,
    addFilter: select.addFilter,
    removeFilter: select.removeFilter,
    getFilter: select.getFilter,
  }));

  /// Handlers ///

  const onHide = useCallback(() => {
    hideLayer(!activeLayer.hidden, activeLayer);
  }, [hideLayer, activeLayer]);

  const onDelete = useCallback(() => {
    removeLayer(activeLayer);
  }, [removeLayer, activeLayer]);

  const addFilter = useCallback(
    (filter: GeoFilter) => {
      ogAddFilter(activeLayer, filter.attribute, filter);
    },
    [ogAddFilter, activeLayer]
  );

  const removeFilter = useCallback(
    (attribute: string) => {
      ogRemoveFilter(activeLayer, attribute);
    },
    [ogRemoveFilter, activeLayer]
  );

  const getFilter = useCallback(
    (attribute: string) => {
      return ogGetFilter(activeLayer, attribute);
    },
    [ogGetFilter, activeLayer]
  );

  /// Render ///

  const hiddenIcon = activeLayer.hidden ? (
    <RiEyeCloseLine
      size={24}
      onClick={onHide}
      className={cn(
        "cursor-pointer text-primary hover:scale-110 transition-all",
        "duration-300 ease-in-out",
        "radix-state-open:rotate-180"
      )}
    />
  ) : (
    <RiEyeFill
      size={24}
      onClick={onHide}
      className={cn(
        "cursor-pointer text-primary hover:scale-110 transition-all",
        "duration-300 ease-in-out",
        "radix-state-open:rotate-180"
      )}
    />
  );

  const header = (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-4 py-2 text-[1.2rem]",
        "text-on-surface-container font-medium"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="mb-1 truncate">{activeLayer.name}</span>
        <Accordion.Trigger value={getLayerId(activeLayer)}>
          <button
            className={cn(
              "cursor-pointer transition-all duration-300 ease-in-out",
              "hover:scale-110 radix-state-open:rotate-180"
            )}
          >
            <IoMdArrowDropdown size={24} className="text-primary" />
          </button>
        </Accordion.Trigger>
      </div>
      <div className="flex items-center gap-4">
        {hiddenIcon}
        <FaTrash
          size={24}
          onClick={onDelete}
          className="cursor-pointer text-primary hover:scale-110"
        />
      </div>
    </div>
  );

  const content = activeLayer.featureInfo ? (
    <ActiveLayerFeatureInfoContent
      activeLayer={
        activeLayer as ActiveLayerFeatureInfoContentProps["activeLayer"]
      }
      addFilter={addFilter}
      removeFilter={removeFilter}
      getFilter={getFilter}
    />
  ) : null;

  return (
    <Accordion.Item
      header={header}
      content={content}
      value={getLayerId(activeLayer)}
      classNames={{
        item: cn(
          "bg-surface-container border-b-2 border-primary",
          "transition-colors duration-300 ease-in-out"
        ),
        header: "shadow-sm",
        content: cn(
          "overflow-hidden",
          "radix-state-open:animate-slideDown radix-state-closed:animate-slideUp"
        ),
      }}
    />
  );
}
