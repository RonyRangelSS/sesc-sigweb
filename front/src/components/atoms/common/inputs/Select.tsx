import { SelectCacheKeys } from "@/constants/cache-keys/select-cache-keys";
import { useQuery } from "@tanstack/react-query";
import RSelect, { ActionMeta, ClassNamesConfig, GroupBase } from "react-select";
import * as R from "remeda";
import { cn, mergeClassNamesConfig } from "@/utils/style-utils";

export type Option<T> = {
  label: string;
  value: T;
};

const baseClassNames = {
  control: (state: any) =>
    cn(
      "flex w-full bg-surface rounded-full! overflow-hidden",
      "border border-surface-container-darker min-h-0",
      state.isFocused && "border-primary",
      "shadow-inner-md"
    ),
  valueContainer: () => "px-2 py-0.5",
  input: () => "outline-none",
  placeholder: () => "text-on-surface/60",
  indicatorsContainer: () => "pr-1",
  indicatorSeparator: () => "bg-surface-container-darker",
  dropdownIndicator: () => "text-on-surface",
  clearIndicator: () => "text-on-surface",
  menu: () =>
    "bg-surface-container border border-surface-container-darker rounded-lg shadow-lg",
  menuList: () => "rounded-lg",
  option: (state: any) =>
    cn(
      "px-3 py-2 cursor-pointer",
      state.isSelected && "bg-primary text-on-primary",
      state.isFocused && !state.isSelected && "bg-surface-container-darker",
      !state.isSelected && !state.isFocused && "text-on-surface-container"
    ),
};

type SingleSelectProps<T> = {
  options: Option<T>[];
  value?: T | null;
  onChange?: (value: T | null, action: ActionMeta<Option<T>>) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  classNames?: ClassNamesConfig<Option<T>, false, GroupBase<Option<T>>>;
  menuPortalTarget?: HTMLElement | null;
};

const SingleSelect = <T,>({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  isLoading,
  isClearable,
  classNames,
  menuPortalTarget,
}: SingleSelectProps<T>) => {
  const selectedOption = R.isNonNullish(value)
    ? options.find((option) => option.value === value)
    : null;

  const defaultClassNames: ClassNamesConfig<
    Option<T>,
    false,
    GroupBase<Option<T>>
  > = {
    ...baseClassNames,
    singleValue: () => "text-on-surface",
  };

  const mergedClassNames = mergeClassNamesConfig(defaultClassNames, classNames);

  return (
    <RSelect<Option<T>>
      options={options}
      isMulti={false}
      value={selectedOption}
      onChange={(option, action) =>
        onChange?.(R.isNonNullish(option) ? option.value : null, action)
      }
      placeholder={placeholder ?? "Selecione..."}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      classNamePrefix=""
      menuPlacement="auto"
      menuPortalTarget={
        (menuPortalTarget ?? typeof window !== "undefined")
          ? document.body
          : null
      }
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
          pointerEvents: "auto",
        }),
      }}
      classNames={mergedClassNames}
    />
  );
};

type AsyncSingleSelectProps<T> = Omit<
  SingleSelectProps<T>,
  "options" | "isLoading"
> & {
  loadOptions: (signal: AbortSignal) => Promise<Option<T>[]>;
  cacheKeys: string[];
};

const AsyncSingleSelect = <T,>({
  loadOptions,
  cacheKeys,
  value,
  onChange,
  placeholder,
  isDisabled,
  isClearable,
  classNames,
}: AsyncSingleSelectProps<T>) => {
  const {
    data: options,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [SelectCacheKeys.ASYNC_SINGLE_SELECT_OPTIONS, ...cacheKeys],
    queryFn: ({ signal }) => loadOptions(signal),
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    refetchIntervalInBackground: false,
  });

  return (
    <SingleSelect<T>
      options={options ?? []}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading || isFetching}
      isClearable={isClearable}
      classNames={classNames}
    />
  );
};

export type MultiSelectProps<T> = {
  options: Option<T>[];
  values: T[];
  onChange?: (values: T[], action: ActionMeta<Option<T>>) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  classNames?: ClassNamesConfig<Option<T>, true, GroupBase<Option<T>>>;
  menuPortalTarget?: HTMLElement | null;
};

const MultiSelect = <T,>({
  options,
  values,
  onChange,
  placeholder,
  isDisabled,
  isLoading,
  isClearable,
  classNames,
  menuPortalTarget,
}: MultiSelectProps<T>) => {
  const selectedValues = values
    .map((value) => options.find((option) => option.value === value))
    .filter(R.isDefined);

  const defaultClassNames: ClassNamesConfig<
    Option<T>,
    true,
    GroupBase<Option<T>>
  > = {
    ...baseClassNames,
    valueContainer: () => "px-2 py-0.5 gap-1",
    multiValue: () => "bg-primary rounded text-on-primary",
    multiValueLabel: () => "text-on-primary px-2 py-1",
    multiValueRemove: () => "text-on-primary hover:bg-primary-darker rounded-r",
  };

  const mergedClassNames = mergeClassNamesConfig(defaultClassNames, classNames);

  return (
    <RSelect<Option<T>, true>
      options={options}
      value={selectedValues}
      isMulti={true}
      onChange={(options, action) =>
        onChange?.(
          R.isNonNullish(options) ? options.map((option) => option.value) : [],
          action
        )
      }
      placeholder={placeholder ?? "Selecione..."}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      classNamePrefix=""
      menuPlacement="auto"
      menuPortalTarget={
        (menuPortalTarget ?? typeof window !== "undefined")
          ? document.body
          : null
      }
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
          pointerEvents: "auto",
        }),
      }}
      classNames={mergedClassNames}
    />
  );
};

export type AsyncMultiSelectProps<T> = Omit<
  MultiSelectProps<T>,
  "options" | "isLoading"
> & {
  loadOptions: (signal: AbortSignal) => Promise<Option<T>[]>;
  cacheKeys: string[];
};

export const AsyncMultiSelect = <T,>({
  loadOptions,
  cacheKeys,
  values,
  onChange,
  placeholder,
  isDisabled,
  isClearable,
  classNames,
}: AsyncMultiSelectProps<T>) => {
  const {
    data: options,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [SelectCacheKeys.ASYNC_MULTI_SELECT_OPTIONS, ...cacheKeys],
    queryFn: ({ signal }) => loadOptions(signal),
    staleTime: 0,
  });

  return (
    <MultiSelect<T>
      options={options ?? []}
      values={values}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading || isFetching}
      isClearable={isClearable}
      classNames={classNames}
    />
  );
};

export const Select = {
  SingleOption: SingleSelect,
  AsyncSingleOption: AsyncSingleSelect,
  MultiOption: MultiSelect,
};
