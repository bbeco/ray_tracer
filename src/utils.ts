import { Vector3 } from "./Vector3";

/**
 * The tolerance to be used when comparing two float numbers; the values are considered the same if their difference is
 * below this threshold.
 */
export const eps = 1e-4;

/**
 * The tolerance to be used when comparing two float squared values; the values are considered the same if their
 * difference is below this threshold.
 */
export const epsSq = Math.pow(eps, 2);

export function distanceSq(a: Vector3, b: Vector3): number {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
}

export function areAlmostEqual(a: Vector3, b: Vector3): boolean {
    return distanceSq(a, b) <= epsSq;
}

export const clampVector = (() => {
    const min = new Vector3([0, 0, 0]);
    const max = new Vector3([1, 1, 1]);
    return (v: Vector3): void => {
        v.clamp(min, max);
    };
})();
