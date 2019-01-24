import { Camera, ImageSensor } from "./Camera";
import { IntersectionPoint as Intersection } from "./IntersectionPoint";
import { PointLight as Light } from "./Light";
import { Ray } from "./Ray";
import { Sphere } from "./Sphere";
import { clampVector, distanceSq } from "./utils";
import { Vector3 } from "./Vector3";

class Scene {
    public objectList: Sphere[];
    public lightList: Light[];
    public camera: Camera;

    constructor(res?: number[]) {
        const s0 = new Sphere();
        s0.center.set(-1.5, 0, -8.01);
        s0.radius = 1;

        const s1 = new Sphere();
        s1.center.set(0.5, -1, -8.01);
        s1.color.set(1, 0, 0);
        s1.radius = 1;

        const s2 = new Sphere();
        s2.center.set(-0.5, -0.5, -6.01);
        s2.color.set(1, 1, 1);
        s2.kN = 2.0;
        s2.radius = 2.0;

        this.objectList = [s0, s1, s2];
        // this.objectList = [s0, s1];
        this.lightList = [
            new Light(new Vector3([0, 1.5, -6.5]), new Vector3([1, 1, 1])),
        ];
        const sensor = res ? new ImageSensor(res, 35.0, 20, 480 / 18) : new ImageSensor([640, 480], 1.0, 1.0, 1.0);
        this.camera = new Camera(sensor);
    }
}

export class RayTracer {
    public static readonly MaxDepth = 10;

    /**
     * ambient light.
     *
     * @private
     * @static
     * @memberof RayTracer
     */
    public static readonly ambient = new Vector3([0.01, 0.01, 0.01]);

    private static backgroundColor = new Vector3();

    /**
     * This value is used to add a margin around each object's bounding box so that when I compute the rays from the
     * intersection point to the ligth sources. In particular the new ray is created as follow:
     * @code
     * const origin = closestInt.point.add(closestInt.normal.clone().multiplyScalar(RayTracer.eps)); const lightRay =
     * new Ray(oringin, l);
     * @endcode
     *
     * `origin` is offset by eps units along the normal direction, this prevents an intersection to occur at the ray's
     * origin that would cause the object point to be shadowed by the object itself.
     *
     * @private
     * @static
     * @memberof RayTracer
     */
    private static eps = 1e-6;

    public scene: Scene;

    constructor(res?: number[]) {
        this.scene = new Scene();
        const sensor = this.scene.camera.sensor;
        sensor.res = res ? res : [320, 240];
        sensor.fLength = 35.0;
        const pixelWidth = 32.0;
        sensor.kU = sensor.res[0] / pixelWidth;
        // pixel aspect ration is set to 1
        sensor.kV = sensor.kU;
    }

    public trace(r: Ray, depth?: number): Vector3 {
        const sIntensity = new Vector3();
        const tIntensity = new Vector3();
        const color = new Vector3();
        const closestInt = new Intersection();

        if (depth === undefined) {
            depth = RayTracer.MaxDepth;
        }

        if (depth === 0) {
            return color;
        }

        for (const obj of this.scene.objectList) {
            const intPoint = obj.intersect(r);
            if (!intPoint) {
                continue;
            }
            const disSq = distanceSq(intPoint, r.origin);
            if (disSq < closestInt.distanceSq) {
                closestInt.set(intPoint, obj.normal(intPoint), obj, disSq);
            }
        }

        if (closestInt.distanceSq === Infinity) {
            return color;
        }

        const intersectedObj = closestInt.obj!;
        const intersectionPoint = closestInt.point!;
        const rReflected = intersectedObj.computeReflectedRay(intersectionPoint, r);
        const rRefracted = intersectedObj.computeRefractedRay(intersectionPoint, r);

        sIntensity.copy(this.trace(rReflected, depth - 1));
        if (rRefracted) {
            tIntensity.copy(this.trace(rRefracted, depth - 1));
        } else {
            tIntensity.set(0, 0, 0);
        }

        return this.shade(closestInt, sIntensity, tIntensity);
    }

    public shade(intersection: Intersection, sIntensity: Vector3, tIntensity: Vector3): Vector3 {
        const color = new Vector3();
        const diffuse = new Vector3();
        const specular = new Vector3();
        const transmitted = new Vector3();

        const intersectedObj = intersection.obj!;
        const point = intersection.point!;
        const normal = intersection.normal!;

        for (const light of this.scene.lightList) {
            const l = light.position.clone().sub(point).normalize();
            const lightRay = new Ray(
                point.add(normal.clone().multiplyScalar(RayTracer.eps)),
                l);
            let shaded = false;
            for (const obj of this.scene.objectList) {
                if (obj.intersect(lightRay)) {
                    shaded = true;
                    break;
                }
            }
            if (!shaded) {
                const dot = l.dot(normal);
                if (dot >= 0) {
                    diffuse.add(light.color.clone().multiplyScalar(dot));
                }
            }
        }

        diffuse.multiplyScalar(intersectedObj.kD);
        clampVector(diffuse);
        specular.copy(sIntensity).multiplyScalar(intersectedObj.kS);
        clampVector(specular);
        transmitted.copy(tIntensity).multiplyScalar(intersectedObj.kT);
        clampVector(transmitted);

        color.add(RayTracer.ambient).add(diffuse).add(specular).add(transmitted);
        clampVector(color);
        return color.multiplyVectors(color, intersectedObj.color);
    }
}
