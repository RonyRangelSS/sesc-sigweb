import {
  CloseButton,
  CloseButtonProps,
} from "@/components/atoms/common/buttons/CloseButton";
import { CollapseButton } from "@/components/atoms/common/buttons/CollapseButton";
import { SideBar } from "@/components/organisms/common/side-bar/SideBar";
import { cn, cns } from "@/utils/style-utils";
import { forwardRef } from "react";

export type SideBarHeaderProps = {
  closable: boolean;
  title?: string;
  direction: "left" | "right";
  classNames?: {
    header?: string;
    title?: string;
    closeButton?: CloseButtonProps["classNames"];
  };
};

const SideBarHeader = forwardRef<HTMLButtonElement, SideBarHeaderProps>(
  ({ closable, title, classNames }, ref) => {
    return (
      <header
        className={cn(
          "flex flex-row items-center gap-2 bg-primary text-on-primary",
          "w-full px-2 py-2",
          classNames?.header
        )}
      >
        {closable && (
          <SideBar.Closer>
            <CollapseButton
              ref={ref}
              direction="right"
              defaultIsOpen={true}
              classNames={cns(classNames?.closeButton, {
                icon: "text-white text-lg",
              })}
            />
          </SideBar.Closer>
        )}
        {title && (
          <SideBar.Title
            className={cn("text-lg! font-medium", classNames?.title)}
          >
            {title}
          </SideBar.Title>
        )}
      </header>
    );
  }
);

export default SideBarHeader;
