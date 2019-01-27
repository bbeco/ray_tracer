import { Ray, shiftRayOrigin } from "./Ray";
import { eps } from "./utils";
import { Vector3 } from "./Vector3";

/**
 * Scale the viewer's direction so that its projection along n has unitary length.
 * This computes the vector that Whitted called `v'` in his paper.
 */
function scaleViewerDirection(r: Ray, n: Vector3) {
    const v = r.direction.clone();
    v.multiplyScalar(-1 / v.dot(n));
    return v;
}

export class Sphere {
    // The position of the centre of the sphere
    public center: Vector3;

    // The radius of the sphere
    public radius: number;

    // The diffuse color of the sphere
    public color: Vector3;

    // Index of refraction, this is 0 for opaque (non-transparent) objects.
    public kN: number;

    // Specular reflection coefficient
    public kS: number;

    // Diffuse reflection constant
    public kD: number;

    // Transmission coefficient
    public kT: number;

    constructor() {
        this.color = new Vector3([1, 1, 1]);
        this.kD = 1.0;
        this.kS = 0.5;
        this.kT = 0.5;
        this.kN = 0.0;

        this.center = new Vector3();
        this.radius = 1.0;
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
    public computeRefractedRay(p: Vector3, r: Ray): Ray | null {
        const refractedDir = new Vector3();
        const refractedOrigin = new Vector3();

        const n = this.normal(p);
        // store whether `r` is travelling inside the object or not. If we are inside the object, we need to adjust the
        // the index of refraction and the normal direction.
        const inside = n.dot(r.direction) >= 0;
        if (inside) {
            n.multiplyScalar(-1);
        }
        const kN = inside ? 1 / this.kN : this.kN;

        const v = scaleViewerDirection(r, n);
        const invKf2 = Math.pow(kN, 2) * Math.pow(v.length(), 2) - Math.pow(n.clone().add(v).length(), 2);
        if (invKf2 <= 0) {
            // This is the case when light is entirely reflected.
            return null;
        }

        const kF = 1 / Math.sqrt(invKf2);
        refractedDir.copy(v).add(n).multiplyScalar(kF).sub(n).normalize();
        refractedOrigin.copy(p);
        // The ray's origin is translated a little toward the normal to prevent the object itself from shadowing the
        return shiftRayOrigin(new Ray(refractedOrigin, refractedDir), n.multiplyScalar(-1));
    }

    // returns the normal of the point of the sphere that is the closest to the query point
    public normal(query: Vector3): Vector3 {
        return query.clone().sub(this.center).normalize();
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

        const inside = n.dot(r.direction) > 0;
        if (inside) {
            n.multiplyScalar(-1);
        }

        const v = scaleViewerDirection(r, n);
        const reflectedDir = v.add(n.clone().multiplyScalar(2));
        reflectedDir.normalize();

        // The ray's origin is translated a little toward the normal to prevent the object itself from shadowing the ray
        const origin = p.clone().add(this.normal(p).multiplyScalar(eps));
        return shiftRayOrigin(new Ray(origin, reflectedDir), n);
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

            return interpolate(minT);
        }
    }
}
