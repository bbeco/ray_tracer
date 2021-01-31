import { Ray } from "./Ray";
import { Thing } from "./Thing";
import { eps } from "./utils";
import { Vector3 } from "./Vector3";

export class Plane extends Thing {
    public origin: Vector3;
    private _normal: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        super(new Vector3(1, 0, 0), 1.0, 0.5, 0.5, 0.0);
        this.origin = origin;
        this._normal = direction;
    }

    public normal(query: Vector3) {
        return this._normal;
    }

    public intersect(ray: Ray): Vector3 | null {
        const den = this._normal.dot(ray.direction);
        const num = this._normal.dot(this.origin) - this._normal.dot(ray.origin);

        if (Math.abs(den) < eps) {
            if (Math.abs(num) < eps) {
                // The ray lies on the plane. We return the closest intersection point that is the ray's origin.
                return ray.origin.clone();
            }
            // The plane's normal is parallel to the ray's direction
            return null;
        }
        const t = num / den;
        if (t < 0) {
            // The intersection occurs behind the ray's origin.
            return null;
        }

        return ray.origin.clone().add(ray.direction.clone().multiplyScalar(t));
    }
}
