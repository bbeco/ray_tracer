import { Vector2 } from "./Vector2";
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
    const min = new Vector3(0, 0, 0);
    const max = new Vector3(1, 1, 1);
    return (v: Vector3): void => {
        v.clamp(min, max);
    };
})();

/**
 * @brief Check whether `p` on the left side w.r.t. the line defined by `p0` and `p1`.
 *
 * This function computes the cross product between the vectors (p1 - p0) and (p - p0) and it is taken from [1].
 * The line is considered infinite for this check but `p0` and `p1` are needed to define its direction.
 *
 * [1] http://geomalgorithms.com/a01-_area.html
 *
 * @export
 * @param {Vector2} p0 The start of the line
 * @param {Vector2} p1 The end of the line; the line is considered infinite for this check.
 * @param {Vector2} p The point to be checked
 * @returns {number} a positive number if the point in on the left of the line, a negative number if it is on the right,
 * or 0 if the point lies on the line.
 */
export function isLeft(p0: Vector2, p1: Vector2, p: Vector2): number {
    return (p1.x - p0.x) * (p.y - p0.y) - (p1.y - p0.y) * (p.x - p0.x);
}
