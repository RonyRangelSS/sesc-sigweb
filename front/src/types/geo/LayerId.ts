export type LayerId = `${string}:${string}`;

export function layerId(namespace: string, name: string): LayerId {
  return `${namespace}:${name}`;
}

export function fromLayerId(layerId: LayerId): {
  namespace: string;
  name: string;
} {
  const [namespace, name] = layerId.split(":");
  return { namespace, name };
}
