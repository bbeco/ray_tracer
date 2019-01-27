import { eps } from "./utils";
import { Vector3 } from "./Vector3";

export class Ray {
    public origin: Vector3;
    public direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin ? origin : new Vector3();
        this.direction = direction ? direction : new Vector3();
    }
}

/**
 * Offsets the point the ray origin so that its is moved away from the intersecting object.
 *
 * The origin is shifted toward the `n` direction by `t` units.
 *
 * The shift is when computing reflected and refracted ray that would otherwise be shadowed by the object itself if
 * their origin was not moved away from the surface.
 *
 * @param r original ray.
 * @param n the normal of the intersected object at its intersection point.
 * @param t how much to move the origin in the chosen direction. This is `eps` by default.
 */
export function shiftRayOrigin(r: Ray, n: Vector3, t: number = eps): Ray {
    r.origin.add(n.clone().multiplyScalar(t));
    return r;
}
