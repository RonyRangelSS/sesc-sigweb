import BoundingBox from "../types/geo/BoundingBox.ts";
import LayerInfo from "../types/geo/LayerInfo.ts";

const GEO_URL = import.meta.env.VITE_GEOSERVER_URL;

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
  abstract?: string;
  nativeBoundingBox: BoundingBox;
  latLonBoundingBox: BoundingBox & { crs: "EPSG:4326" };
};

type GetFeatureDetailsResponse = {
  featureType: CommonLayerDetailsResponse & {
    attributes: {
      attribute: {
        name: string;
        nillable: boolean;
      }[];
    };
  };
};

type GetCoverageDetailsResponse = {
  coverage: CommonLayerDetailsResponse & {};
};

export async function getLayers(workspace: string): Promise<LayerInfo[]> {
  const getLayersResponse = await fetch(
    `${GEO_URL}/rest/workspaces/${workspace}/layers`,
  );
  const getLayersData = (await getLayersResponse.json()) as GetLayersResponse;

  return await Promise.all(
    getLayersData.layers.layer.map(async (layer) => {
      const layerInfo: Partial<LayerInfo> = {};
      await fillLayerInfo(workspace, layer.name, layerInfo);
      return layerInfo as LayerInfo;
    }),
  );
}

async function fillLayerInfo(
  workspace: string,
  layerName: string,
  layerInfo: Partial<LayerInfo>,
) {
  const injectionStrategies = [
    injectFeatureDetailsStrategy, 
    injectCoverageDetailsStrategy
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
  layerInfo: Partial<LayerInfo>,
): Promise<boolean> {
  const response = await fetch(
    `${GEO_URL}/rest/workspaces/${workspace}/featuretypes/${layer}.json`,
  );

  if (!response.ok) return false;

  const data = ((await response.json()) as GetFeatureDetailsResponse)
    .featureType;

  layerInfo.owsURL = `${GEO_URL}/ows`;
  layerInfo.name = data.name;
  layerInfo.namespace = data.namespace.name;
  layerInfo.title = data.title;
  layerInfo.description = data.abstract;
  layerInfo.attribution = "-";
  layerInfo.nativeBoundingBox = data.nativeBoundingBox;
  layerInfo.latLonBoundingBox = data.latLonBoundingBox;
  layerInfo.featureInfo = {
    attributes: data.attributes.attribute.map((attribute) => ({
      name: attribute.name,
      nullable: attribute.nillable,
    })),
  };

  return true;
}

async function injectCoverageDetailsStrategy(
  workspace: string,
  layer: string,
  layerInfo: Partial<LayerInfo>,
): Promise<boolean> {
  const response = await fetch(
    `${GEO_URL}/rest/workspaces/${workspace}/coverages/${layer}.json`,
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
