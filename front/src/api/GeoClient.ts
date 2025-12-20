import { LayerAttributesMetadata } from "@/types/geo/metadata/LayerAttributesMetadata.ts";
import BoundingBox from "../types/geo/BoundingBox.ts";
import LayerInfo from "../types/geo/LayerInfo.ts";
import { LayerMetadata } from "@/types/geo/metadata/LayerMetadata.ts";
import setValue from "set-value";
import * as R from "remeda";

const GEO_URL = import.meta.env.VITE_GEOSERVER_URL;

/// Workspaces ///

type GetWorkspacesResponse = {
  workspaces: {
    workspace: {
      name: string;
      href: string;
    }[];
  };
};

export async function getWorkspaces(): Promise<string[]> {
  const response = await fetch(`${GEO_URL}/rest/workspaces`);
  const data = (await response.json()) as GetWorkspacesResponse;
  return data.workspaces.workspace.map((workspace) => workspace.name);
}

/// Layers ///

type GetLayersResponse = {
  layers: {
    layer: {
      name: string;
      href: string;
    }[];
  };
};

type CommonLayerDetailsResponse = {
  name: string;
  namespace: { name: string };
  title?: string;
  keywords?: {
    string: string[];
  };
  abstract?: string;
  nativeBoundingBox: BoundingBox;
  latLonBoundingBox: BoundingBox & { crs: "EPSG:4326" };
};

type GetFeatureDetailsResponse = {
  featureType: CommonLayerDetailsResponse & {
    attributes: {
      attribute: {
        name: string;
        minOccurs: number;
        maxOccurs: number;
        nillable: boolean;
        binding: string;
      }[];
    };
  };
};

type GetCoverageDetailsResponse = {
  coverage: CommonLayerDetailsResponse & {};
};

export async function getLayers(workspace: string): Promise<LayerInfo[]> {
  const getLayersResponse = await fetch(
    `${GEO_URL}/rest/workspaces/${workspace}/layers`
  );
  const getLayersData = (await getLayersResponse.json()) as GetLayersResponse;

  return await Promise.all(
    getLayersData.layers.layer.map(async (layer) => {
      const layerInfo: Partial<LayerInfo> = {};
      await fillLayerInfo(workspace, layer.name, layerInfo);
      return layerInfo as LayerInfo;
    })
  );
}

async function fillLayerInfo(
  workspace: string,
  layerName: string,
  layerInfo: Partial<LayerInfo>
) {
  const injectionStrategies = [
    injectFeatureDetailsStrategy,
    injectCoverageDetailsStrategy,
  ];

  let filled = false;
  while (!filled && injectionStrategies.length > 0) {
    const strategy = injectionStrategies.shift()!;
    filled = await strategy(workspace, layerName, layerInfo);
  }

  if (!filled) {
    console.warn(`Could not resolve layerInfo for: ${workspace}:${layerInfo}`);
  }
}

async function injectFeatureDetailsStrategy(
  workspace: string,
  layer: string,
  layerInfo: Partial<LayerInfo>
): Promise<boolean> {
  const response = await fetch(
    `${GEO_URL}/rest/workspaces/${workspace}/featuretypes/${layer}.json`
  );

  if (!response.ok) return false;

  const data = ((await response.json()) as GetFeatureDetailsResponse)
    .featureType;

  const metadata: LayerMetadata = parseKeywordsToMetadata(
    data.keywords?.string ?? []
  );

  layerInfo.owsURL = `${GEO_URL}/ows`;
  layerInfo.name = data.name;
  layerInfo.namespace = data.namespace.name;
  layerInfo.title = data.title;
  layerInfo.metadata = metadata;
  layerInfo.description = data.abstract;
  layerInfo.attribution = "-";
  layerInfo.nativeBoundingBox = data.nativeBoundingBox;
  layerInfo.latLonBoundingBox = data.latLonBoundingBox;
  layerInfo.featureInfo = {
    attributes: R.fromEntries(
      data.attributes.attribute.map((attribute) => [
        attribute.name,
        {
          type: attribute.binding.split(".").pop()!,
          metadata: metadata.attributes[attribute.name],
        },
      ])
    ),
    filters: {},
  };

  return true;
}

function parseKeywordsToMetadata(keywords: string[]): LayerMetadata {
  const mapping = {
    attributes: {
      "*": {
        hidden: (value: string) => value === "true",
        range: {
          maxDate: (value: string) => new Date(value),
          minDate: (value: string) => new Date(value),
          maxNumber: (value: string) => Number(value),
          minNumber: (value: string) => Number(value),
        },
        enum: (value: string) => value.split(","),
      },
    },
  };

  const metadata: LayerMetadata = {
    attributes: {},
  };

  for (const keyword of keywords) {
    const parts = keyword.split(":");
    if (parts.length < 2) continue;

    const path: string[] = [];
    let currentMapping: any = mapping;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const hasWildcard =
        typeof currentMapping === "object" && "*" in currentMapping;

      const keyToUse = hasWildcard ? "*" : part;

      if (typeof currentMapping !== "object" || !(keyToUse in currentMapping)) {
        console.warn(`Unknown path part: ${part} in keyword: ${keyword}`);
        break;
      }

      path.push(part);
      currentMapping = currentMapping[keyToUse];

      if (i === parts.length - 2 && typeof currentMapping === "function") {
        const value = parts[parts.length - 1];
        const convertedValue = currentMapping(value);

        setValue(metadata, path.join("."), convertedValue);
        break;
      }
    }
  }

  return metadata;
}

async function injectCoverageDetailsStrategy(
  workspace: string,
  layer: string,
  layerInfo: Partial<LayerInfo>
): Promise<boolean> {
  const response = await fetch(
    `${GEO_URL}/rest/workspaces/${workspace}/coverages/${layer}.json`
  );

  if (!response.ok) return false;

  const data = ((await response.json()) as GetCoverageDetailsResponse).coverage;

  layerInfo.owsURL = `${GEO_URL}/ows`;
  layerInfo.name = data.name;
  layerInfo.namespace = data.namespace.name;
  layerInfo.title = data.title;
  layerInfo.description = data.abstract;
  layerInfo.attribution = "-";
  layerInfo.nativeBoundingBox = data.nativeBoundingBox;
  layerInfo.latLonBoundingBox = data.latLonBoundingBox;

  return true;
}
