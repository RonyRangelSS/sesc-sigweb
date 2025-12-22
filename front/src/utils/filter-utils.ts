import { GeoFilter } from "@/types/geo/filters/GeoFilter";

export function getCQLFilter(filters: GeoFilter[]): string {
  return filters.map((filter) => `(${filter.toCQLFilter()})`).join(" AND ");
}

export function getGroupedCQLFilter(filters: GeoFilter[][]): string {
  // 1. Filtra grupos vazios para não gerar "()" ou strings vazias
  const validLayerGroups = filters.filter((group) => group.length > 0);

  const layersCQLFilters = validLayerGroups.map((layerGroup) => {
    // Junta os filtros da mesma camada com AND
    const groupCQL = layerGroup
      .map((filter) => `(${filter.toCQLFilter()})`)
      .join(" AND ");

    return groupCQL;
  });

  // 2. O join(";") só é útil se você estiver fazendo WMS com múltiplas camadas.
  // Se for WFS de uma camada só, isso não atrapalha se o array tiver tamanho 1.
  return layersCQLFilters.join(";");
}
