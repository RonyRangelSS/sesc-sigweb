import { ClassNameValue, twJoin } from "tailwind-merge";
import * as R from "remeda";

export function cn(...inputs: ClassNameValue[]): string {
  return twJoin(inputs);
}

export function cns<T extends Record<string, ClassNameValue>[]>(
  ...inputs: (T[number] | undefined)[]
): { [K in keyof T[number]]: string } {
  const cnMap: Map<keyof T[number], string> = new Map();

  R.pipe(
    inputs,
    R.filter(R.isDefined),
    R.flatMap(R.entries()),
    R.forEach(([key, value]: [keyof T[number], ClassNameValue]) => {
      const currentValue = cnMap.get(key);

      if (!R.isDefined(currentValue)) {
        cnMap.set(key, cn(value));
        return;
      }

      cnMap.set(key, cn(currentValue, value));
    })
  );

  return R.fromKeys(Array.from(cnMap.keys()), (key) => cnMap.get(key)!) as {
    [K in keyof T[number]]: string;
  };
}

/**
 * Merges classNames config objects (like react-select's classNames prop).
 * Handles both string values and function values that return strings.
 * When both values are functions, they are combined to call both and merge results.
 */
export function mergeClassNamesConfig<
  T extends Record<string, string | ((state: any) => string)>,
>(...configs: (T | undefined)[]): T {
  const result = {} as T;

  for (const config of configs) {
    if (!config) continue;

    for (const [key, value] of Object.entries(config)) {
      const existingValue = result[key as keyof T];

      if (!existingValue) {
        result[key as keyof T] = value as T[keyof T];
      } else if (
        typeof value === "function" &&
        typeof existingValue === "function"
      ) {
        // Both are functions - combine them to call both and merge results
        result[key as keyof T] = ((state: any) =>
          cn(existingValue(state), value(state))) as T[keyof T];
      } else if (typeof value === "function") {
        // New value is function, existing is string - use function
        result[key as keyof T] = value as T[keyof T];
      } else if (typeof existingValue === "function") {
        // Existing is function, new is string - combine
        result[key as keyof T] = ((state: any) =>
          cn(existingValue(state), value)) as T[keyof T];
      } else {
        // Both are strings - merge
        result[key as keyof T] = cn(existingValue, value) as T[keyof T];
      }
    }
  }

  return result;
}
