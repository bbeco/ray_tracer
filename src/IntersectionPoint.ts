import { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";

// Describe the intersection that occurs between a ray and a generic scene object
export class IntersectionPoint {
    // The 3d point intersection point
    public point?: Vector3;

    // The normal unit vector of the intersected object's surface computed at the intersection point
    public normal?: Vector3;

    // A reference to the object that was intersected
    public obj?: Sphere;

    // The squared distance between the intersection point and the camera's centre of projection
    public distanceSq: number;

    constructor() {
        this.distanceSq = Infinity;
    }

    /**
     * Set the intersection attributes according to the parameters provided.
     *
     * @param point
     * @param normal
     * @param obj
     * @param distanceSq
     */
    public set(point: Vector3, normal: Vector3, obj: Sphere, distanceSq: number) {
        this.point = point;
        this.normal = normal;
        this.obj = obj;
        this.distanceSq = distanceSq;
    }
}
