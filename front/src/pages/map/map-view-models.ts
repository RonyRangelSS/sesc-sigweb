import { LayersAtomKeys } from '@/constants/atom-keys/map-atom-keys';
import { FetchedFeatureInfo } from '@/types/geo/FetchedFeatureInfo';
import { atom, useRecoilState } from 'recoil';



export function useMapViewModel() {
  const useFetchedLayerInfo = () => useRecoilState(fetchedLayerInfoAtom);

  const setFetchedLayerInfo = (fetchedFeaturesInfo: FetchedFeatureInfo[]) => {
    useFetchedLayerInfo()[1]({
      fetchedFeaturesInfo,
    });
  };

  return {
    useFetchedLayerInfo,
  }
}