import { Ray } from "./Ray";
import { eps } from "./utils";
import { Vector3 } from "./Vector3";

export class Sphere {

    // The position of the centre of the sphere
    public center: Vector3;

    // The radius of the sphere
    public radius: number;

    // The diffuse color of the sphere
    public cDiffuse: Vector3;

    // Diffuse reflection constant
    private _kD: number;

    // Specular reflection coefficient
    private kS: number;

    // Transmission coefficient
    private kT: number;

    // Index of refraction;
    private kN: number;

    constructor() {
        this.cDiffuse = new Vector3([1, 1, 1]);
        this._kD = 1.0;
        this.kS = 1.0;
        this.kT = 1.0;
        this.kN = 1.0;

        this.center = new Vector3();
        this.radius = 1.0;
    }

    get kD(): number {
        return this._kD;
    }

    // returns the normal of the point of the sphere that is the closest to the query point
    public normal(query: Vector3): Vector3 {
        return query.clone().sub(this.center).normalize();
    }

    /**
     * Compute the refraction of r at point p.
     *
     * @private
     * @param {Vector3} p
     * @param {Ray} r
     * @returns
     * @memberof Sphere
     */
    public computeRefractedRay(p: Vector3, r: Ray) {
        return new Ray(p, new Vector3());
    }

    /**
     * @brief Compute the reflection of r at point p.
     *
     * This function assumes the dot product between the viewer direction and the normal is less than 0.
     *
     * @private
     * @param {Vector3} p
     * @param {Ray} r
     * @returns
     * @memberof Sphere
     */
    public computeReflectedRay(p: Vector3, r: Ray) {
        const n = this.normal(p);
        if (r.direction.dot(n) === 0) {
            return new Ray(p, r.direction);
        }

        const v = r.direction.clone();
        // the negative sign is due to the fact that v.dot(n) is always negative, and the formula requires its absolute
        // value
        v.multiplyScalar(-1 / v.dot(n));
        const reflectedDir = v.add(n.multiplyScalar(2));
        reflectedDir.normalize();

        // The ray's origin is translated a little toward the normal to prevent the object itself from shadowing the ray
        const origin = p.clone().add(this.normal(p).multiplyScalar(eps));
        return new Ray(origin, reflectedDir.normalize());
    }

    // In case there are two intersection points, this method returns the one that is closer to the ray's origin.
    public intersect(ray: Ray): Vector3 | null {
        const v = ray.origin.clone().sub(this.center);
        const a = 1;
        const b = ray.direction.dot(v) * 2;
        const c = v.lengthSq() - Math.pow(this.radius, 2);
        const delta = Math.pow(b, 2) - 4 * a * c;

        const interpolate = (t: number): Vector3 => ray.origin.clone().add(ray.direction.clone().multiplyScalar(t));

        if (delta < 0) {
            return null;
        } else if (delta === 0) {
            const t = -b / (2 * a);
            if (t < 0) {
                // The intersection point is behind the ray's origin
                return null;
            } else if (t === 0) {
                return ray.origin.clone();
            } else {
                return interpolate(t);
            }
        } else {
            const root = Math.sqrt(delta);
            let ts = [(-b - root) / (2 * a), (-b + root) / (2 * a)];
            ts = ts.filter((e) => e >= 0);
            if (ts.length === 0) {
                return null;
            }

            const minT = ts.reduce((min, e) => e < min ? e : min);

            if (minT === 0) {
                return ray.origin.clone();
            }

            return (interpolate(minT));
        }
    }
}
