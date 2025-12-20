import * as RadixAccordion from "@radix-ui/react-accordion";
import { forwardRef } from "react";

/// Common Root Props ///

export type AccordionProps = {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
};

/// Single Item Root ///

export type AccordionSingleProps = AccordionProps & {
  children: React.ReactNode;
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const SingleItemRoot = ({
  orientation = "vertical",
  children,
  collapsible = true,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
}: AccordionSingleProps) => {
  return (
    <RadixAccordion.Root
      type="single"
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      collapsible={collapsible}
      disabled={disabled}
    >
      {children}
    </RadixAccordion.Root>
  );
};

/// Multiple Items Root ///

export type AccordionMultipleProps = AccordionProps & {
  children: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
};

const MultipleItemsRoot = ({
  orientation = "vertical",
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
}: AccordionMultipleProps) => {
  return (
    <RadixAccordion.Root
      type="multiple"
      defaultValue={defaultValue}
      value={value}
      orientation={orientation}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
    >
      {children}
    </RadixAccordion.Root>
  );
};

/// Item ///

export type AccordionItemProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  value: string;
  disabled?: boolean;
  classNames?: {
    item?: string;
    header?: string;
    content?: string;
  };
};

const Item = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ header, content, value, disabled, classNames }, ref) => {
    return (
      <RadixAccordion.Item
        value={value}
        disabled={disabled}
        ref={ref}
        className={classNames?.item}
      >
        <RadixAccordion.Header className={classNames?.header}>
          {header}
        </RadixAccordion.Header>
        <RadixAccordion.Content className={classNames?.content}>
          {content}
        </RadixAccordion.Content>
      </RadixAccordion.Item>
    );
  }
);

/// Trigger ///

export type AccordionTriggerProps = {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
};

const Trigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, value, disabled }, ref) => {
    return (
      <RadixAccordion.Trigger
        value={value}
        disabled={disabled}
        ref={ref}
        asChild
      >
        {children}
      </RadixAccordion.Trigger>
    );
  }
);

/// Exported Components ///

export const Accordion = {
  SingleItemRoot,
  MultipleItemsRoot,
  Item,
  Trigger,
};
