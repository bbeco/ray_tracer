import { Ray } from "./Ray";
import { Vector3 } from "./Vector3";

export class Sphere {

    // The position of the centre of the sphere
    public center: Vector3;

    // The radius of the sphere
    public radius: number;

    // The diffuse color of the sphere
    private _cDiffuse: Vector3;

    // Diffuse reflection constant
    private _kD: number;

    // Specular reflection coefficient
    private kS: number;

    // Transmission coefficient
    private kT: number;

    // Index of refraction;
    private kN: number;

    constructor() {
        this._cDiffuse = new Vector3([1, 1, 1]);
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

    get cDiffuse(): Vector3 {
        return this._cDiffuse;
    }

    // returns the normal of the point of the sphere that is the closest to the query point
    public normal(query: Vector3): Vector3 {
        return query.clone().sub(this.center).normalize();
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
