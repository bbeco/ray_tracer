import { Material } from "./Material";
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

/**
 * @brief This is the interface exposed by all the object of the scene that interact with a light ray (a light ray can
 * intersect a `Thing` and because of the hit, it is reflected and refracted according to the intersected object
 * geometry and its material properties).
 */
export abstract class Thing {

    /**
     * Every object that interacts with a light ray has some defined material
     *
     * @type {Material}
     * @memberof Thing
     */
    public material: Material;

    constructor(color: Vector3, kN: number, kS: number, kD: number, kT: number) {
        this.material = new Material(color, kN, kS, kD, kT);
    }

    /**
     * @brief Given a point that belongs on this object, returns its normal.
     *
     * @param {Vector3} query The point we want to find the normal for.
     * @returns {Vector3} The normal direction at the `query` point.
     * @memberof Thing
     */
    public abstract normal(query: Vector3): Vector3;

    /**
     * @brief Compute the reflection of r at point `p`.
     *
     * This function assumes the dot product between the viewer direction and the normal is less than 0.
     *
     * @private
     * @param {Vector3} p
     * @param {Ray} r
     * @returns
     * @memberof Sphere
     */
    public computeReflectedRay(p: Vector3, r: Ray): Ray {
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

    /**
     * @brief Computes the refracted ray given the intersection point `p` and the incoming ray `r`.
     *
     * @param {Vector3} p The intersection point.
     * @param {Ray} r The incoming ray.
     * @returns {(Ray | null)} The refracted ray or null if the object is opaque.
     * @memberof Thing
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
        const kN = inside ? 1 / this.material.kN : this.material.kN;

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

    /**
     * @brief Computes the intersection point given an incoming ray `ray`. Returns `null` if no intersection occurred.
     *
     * @param {Ray} ray The incoming ray.
     * @returns {(Vector3 | null)} The intersection point or `null` if no intersection occurred.
     * @memberof Thing
     */
    public abstract intersect(ray: Ray): Vector3 | null;
}
