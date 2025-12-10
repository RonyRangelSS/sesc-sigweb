import { cn } from "@/utils/style-utils";
import * as Dialog from "@radix-ui/react-dialog";

export type SiderBarProps = {
  position: "left" | "right";
  trigger: React.ReactNode;
  children: React.ReactNode;
  classNames?: {
    overlay?: string;
    content?: string;
  };
  container?: Element | DocumentFragment | null;
  accessibility?: {
    description?: string;
  };
};

const Root = ({
  position,
  trigger,
  children,
  classNames,
  container,
  accessibility,
}: SiderBarProps) => {
  const positionClassNames: Record<"left" | "right", string> = {
    left: cn(
      "left-0 radix-state-open:animate-slideInLeft",
      "radix-state-closed:animate-slideOutLeft"
    ),
    right: cn(
      "right-0 radix-state-open:animate-slideInRight",
      "radix-state-closed:animate-slideOutRight"
    ),
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal container={container}>
        <Dialog.Overlay
          className={cn(
            "absolute inset-0 bg-black/20 transition-opacity duration-300",
            "z-500 opacity-0 ease-in-out",
            "radix-state-open:animate-fadeIn radix-state-open:opacity-100",
            "radix-state-closed:animate-fadeOut radix-state-closed:opacity-0",
            classNames?.overlay
          )}
        />
        <Dialog.Content
          aria-describedby={accessibility?.description}
          className={cn(
            "absolute top-0 h-full w-[60vw] bg-surface-container shadow-lg sm:w-[40vw]",
            "z-500 transition-transform duration-300 ease-in-out",
            "radix-state-open:translate-x-0",
            positionClassNames[position],
            classNames?.content
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export type SiderBarCloserProps = {
  children: React.ReactNode;
};

const Closer = ({ children }: SiderBarCloserProps) => {
  return <Dialog.Close asChild>{children}</Dialog.Close>;
};

export type SideBarTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const Title = ({ children, className }: SideBarTitleProps) => {
  return <Dialog.Title className={className}>{children}</Dialog.Title>;
};

export const SideBar = {
  Root,
  Closer,
  Title,
};
