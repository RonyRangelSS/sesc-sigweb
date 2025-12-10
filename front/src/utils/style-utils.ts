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
