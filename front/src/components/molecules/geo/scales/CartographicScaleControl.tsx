import { useEffect, useRef, useState } from 'react';
import { DomEvent } from 'leaflet';
import { useMap } from 'react-leaflet';
import { cn } from '@/utils/style-utils';
import { BiSolidRuler } from 'react-icons/bi';
import { CartographicScale } from './CartographicScale';

interface CartographicScaleProps {
  className?: string;
  startsCollapsed?: boolean;
  pixelWidthResolver?: (screenWidth: number) => number;
}

export const CartographicScaleControl = ({
  className,
  startsCollapsed = false,
  pixelWidthResolver,
}: CartographicScaleProps) => {
  const map = useMap();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(startsCollapsed);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) | void => {
    const containerElement: HTMLDivElement | null = containerRef.current;

    if (containerElement === null) {
      return;
    }

    DomEvent.disableClickPropagation(containerElement);
    DomEvent.disableScrollPropagation(containerElement);
    DomEvent.on(
      containerElement,
      'mousedown touchstart pointerdown dblclick contextmenu',
      DomEvent.stopPropagation
    );

    return (): void => {
      DomEvent.off(
        containerElement,
        'mousedown touchstart pointerdown dblclick contextmenu',
        DomEvent.stopPropagation
      );
    };
  }, []);

  const handleToggleCollapsed = (): void => {
    setIsCollapsed((previousState: boolean) => !previousState);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'z-1000 flex cursor-auto flex-col items-start gap-2',
        className
      )}
    >
      {isCollapsed && (
        <ScaleControlButton
          handleToggleCollapsed={handleToggleCollapsed}
          isCollapsed={isCollapsed}
        />
      )}
      {!isCollapsed && (
        <CartographicScale
          map={map}
          pixelWidthResolver={pixelWidthResolver}
          onCollapse={handleToggleCollapsed}
        />
      )}
    </div>
  );
};

/// Aux. Components ///

interface ScaleControlButtonProps {
  classNames?: {
    container?: string;
    icon?: string;
  };
  handleToggleCollapsed: () => void;
  isCollapsed: boolean;
}

const ScaleControlButton = ({
  classNames,
  handleToggleCollapsed,
  isCollapsed,
}: ScaleControlButtonProps) => {
  const stopMapEventPropagation = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.PointerEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    stopMapEventPropagation(event);
    handleToggleCollapsed();
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      onMouseDown={stopMapEventPropagation}
      onPointerDown={stopMapEventPropagation}
      onTouchStart={stopMapEventPropagation}
      onDoubleClick={stopMapEventPropagation}
      aria-label={
        isCollapsed
          ? 'Expand cartographic scale control'
          : 'Collapse cartographic scale control'
      }
      className={cn(
        'text-primary pointer-events-auto flex h-fit w-fit cursor-pointer items-center justify-center',
        'rounded bg-white p-1.5 shadow',
        classNames?.container
      )}
    >
      <BiSolidRuler className={cn('h-8 w-8', classNames?.icon)} />
    </button>
  );
};
