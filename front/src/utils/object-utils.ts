import * as R from 'remeda';

/**
 * Returns true if all values in the given object are non-null and non-undefined.
 * @param {Record<string, unknown>} obj - the object to check
 * @returns {boolean} true if all values are non-null and non-undefined, false otherwise
 */
export function allNonNullish(obj: Record<string, unknown>): boolean {
	return R.values(obj).every(R.isNonNullish);
}
