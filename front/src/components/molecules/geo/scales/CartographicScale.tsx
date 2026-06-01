import { CollapseButton } from '@/components/atoms/common/buttons/CollapseButton';
import L from 'leaflet';
import { useState, useEffect, useCallback } from 'react';

interface ScaleState {
  labelFull: string;
  labelHalf: string;
  labelQuarter: string;
}

export interface CartographicScaleProps {
  map: L.Map;
  className?: string;
  startsCollapsed?: boolean;
  pixelWidthResolver?: (screenWidth: number) => number;
  onCollapse?: () => void;
}

export const CartographicScale = ({
  map,
  pixelWidthResolver,
  onCollapse,
}: CartographicScaleProps) => {
  const [scaleBarPixelWidth, setScaleBarPixelWidth] = useState<number>(() => {
    return resolveScaleBarPixelWidth(pixelWidthResolver, getScreenWidth());
  });
  const [scale, setScale] = useState<ScaleState>({
    labelFull: '0 m',
    labelHalf: '0',
    labelQuarter: '0',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = (): void => {
      setScaleBarPixelWidth(
        resolveScaleBarPixelWidth(pixelWidthResolver, window.innerWidth)
      );
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pixelWidthResolver]);

  const updateScale = useCallback(() => {
    if (!map) return;

    const centerLatLng = map.getCenter();
    const centerPoint = map.latLngToContainerPoint(centerLatLng);
    const targetPoint = L.point(
      centerPoint.x + scaleBarPixelWidth,
      centerPoint.y
    );
    const targetLatLng = map.containerPointToLatLng(targetPoint);
    const representedMeters = map.distance(centerLatLng, targetLatLng);

    const isKm = representedMeters >= 1000;
    const unit = isKm ? ' km' : ' m';
    const divisor = isKm ? 1000 : 1;
    const representedDistanceInUnit = representedMeters / divisor;
    const roundedDistanceInUnit = roundToNiceScaleValue(
      representedDistanceInUnit
    );

    const fullVal = formatScaleValue(roundedDistanceInUnit);
    const halfVal = formatScaleValue(roundedDistanceInUnit / 2);
    const quarterVal = formatScaleValue(roundedDistanceInUnit / 4);

    setScale({
      labelFull: `${fullVal}${unit}`,
      labelHalf: halfVal,
      labelQuarter: quarterVal,
    });
  }, [map, scaleBarPixelWidth]);

  useEffect(() => {
    if (!map) return;

    updateScale();
    map.on('zoomend moveend', updateScale);

    return () => {
      map.off('zoomend moveend', updateScale);
    };
  }, [map, updateScale]);

  return (
    <div className='rounded bg-white py-2 pr-5 pl-2 shadow'>
      <div className='flex items-end justify-end'>
        <CollapseButton
          direction={'down'}
          defaultIsOpen={true}
          onClick={onCollapse}
          classNames={{ icon: 'w-4 h-4' }}
        />
      </div>

      <div className='p-2'>
        <div style={{ width: `${scaleBarPixelWidth}px` }}>
          <div className='relative h-4 font-bold'>
            <span className='absolute left-0'>0</span>
            <span className='absolute left-[25%] -translate-x-1/2'>
              {scale.labelQuarter}
            </span>
            <span className='absolute left-1/2 -translate-x-1/2'>
              {scale.labelHalf}
            </span>
            <span className='absolute right-0 translate-x-1/2 whitespace-nowrap'>
              {scale.labelFull}
            </span>
          </div>

          <div className='box-content flex h-2.5 border border-black'>
            {['primary', 'white', 'primary', 'white'].map((color, idx) => (
              <div
                key={idx}
                className={`flex-1 ${color === 'primary' ? 'bg-primary' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <hr className='border-primary border-2 border-t' />

      <div className='font-sans text-xs text-black'>
        <strong className='text-primary'>Datum:</strong> WGS 84 (EPSG:4326)
      </div>
    </div>
  );
};

/// Constants ///

const DEFAULT_SCREEN_WIDTH_PX = 1280;
const MIN_SCALE_BAR_WIDTH_PX = 120;
const MAX_SCALE_BAR_WIDTH_PX = 320;

/// Aux. Functions ///

const DEFAULT_PIXEL_WIDTH_RESOLVER = (screenWidth: number): number => {
  return screenWidth * 0.5;
};

const getScreenWidth = (): number => {
  if (typeof window === 'undefined') {
    return DEFAULT_SCREEN_WIDTH_PX;
  }

  return window.innerWidth;
};

const clampScaleBarWidth = (width: number): number => {
  const normalizedWidth = Number.isFinite(width) ? Math.round(width) : 0;

  if (normalizedWidth < MIN_SCALE_BAR_WIDTH_PX) {
    return MIN_SCALE_BAR_WIDTH_PX;
  }

  if (normalizedWidth > MAX_SCALE_BAR_WIDTH_PX) {
    return MAX_SCALE_BAR_WIDTH_PX;
  }

  return normalizedWidth;
};

const resolveScaleBarPixelWidth = (
  pixelWidthResolver: CartographicScaleProps['pixelWidthResolver'],
  screenWidth: number
): number => {
  const resolver = pixelWidthResolver ?? DEFAULT_PIXEL_WIDTH_RESOLVER;
  return clampScaleBarWidth(resolver(screenWidth));
};

const roundToNiceScaleValue = (value: number): number => {
  if (value <= 0) return 0;

  const scaleOrder = Math.pow(10, Math.floor(Math.log10(value)));
  const normalizedValue = value / scaleOrder;
  const roundedStep = [1, 2, 3, 5, 10].reduce(
    (bestStep: number, currentStep: number) => {
      const currentDistance = Math.abs(currentStep - normalizedValue);
      const bestDistance = Math.abs(bestStep - normalizedValue);

      return currentDistance < bestDistance ? currentStep : bestStep;
    },
    1
  );

  return roundedStep * scaleOrder;
};

const formatScaleValue = (value: number): string => {
  return `${Math.round(value)}`;
};
