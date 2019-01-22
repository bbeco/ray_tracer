import { Camera, ImageSensor } from "./Camera";
import { IntersectionPoint as Intersection } from "./IntersectionPoint";
import { PointLight as Light } from "./Light";
import { Ray } from "./Ray";
import { Sphere } from "./Sphere";
import { distanceSq } from "./utils";
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
        s1.cDiffuse.set(1, 0, 0);
        s1.radius = 1;

        this.objectList = [s0, s1];
        this.lightList = [
            new Light(new Vector3([0, 1.5, -6.5]), new Vector3([1, 1, 1])),
        ];
        const sensor = res ? new ImageSensor(res, 35.0, 20, 480 / 18) : new ImageSensor([640, 480], 1.0, 1.0, 1.0);
        this.camera = new Camera(sensor);
    }
}

export class RayTracer {
    public static MaxDepth = 2;

    private static minColor = new Vector3([0, 0, 0]);
    private static maxColor = new Vector3([1, 1, 1]);

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

    /**
     * ambient light.
     *
     * @private
     * @static
     * @memberof RayTracer
     */
    private static ambient = new Vector3([0.01, 0.01, 0.01]);

    private static colorRange = [new Vector3([0, 0, 0]), new Vector3([1, 1, 1])];

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

    get ambient(): Vector3 {
        return RayTracer.ambient;
    }

    public trace(ray: Ray, depth?: number): Vector3 {
        if (depth === undefined) {
            depth = RayTracer.MaxDepth;
        }

        if (depth === 0) {
            return new Vector3();
        }

        const closestInt = new Intersection();
        for (const obj of this.scene.objectList) {
            const intPoint = obj.intersect(ray);
            if (!intPoint) {
                continue;
            }
            const disSq = distanceSq(intPoint, ray.origin);
            if (disSq < closestInt.distanceSq) {
                closestInt.set(intPoint, obj.normal(intPoint), obj, disSq);
            }
        }

        if (closestInt.distanceSq === Infinity) {
            return RayTracer.backgroundColor;
        }

        const color = new Vector3();
        const reflected = closestInt.obj!.computeReflectedRay(closestInt.point!, ray);
        const refracted = closestInt.obj!.computeRefractedRay(closestInt.point!, ray);

        color.add(this.trace(reflected, depth - 1));
        color.add(this.trace(refracted, depth - 1));

        color.add(this.shade(closestInt));

        return color;
    }

    public shade(intersection: Intersection): Vector3 {
        const color = RayTracer.ambient.clone();
        const diffuse = new Vector3();
        for (const light of this.scene.lightList) {
            const l = light.position.clone().sub(intersection.point!).normalize();
            const lightRay = new Ray(
                intersection.point!.add(intersection.normal!.clone().multiplyScalar(RayTracer.eps)),
                l);
            for (const obj of this.scene.objectList) {
                if (!obj.intersect(lightRay)) {
                    const dot = l.dot(intersection.normal!);
                    if (dot >= 0) {
                        diffuse.add(light.color.clone().multiplyScalar(dot));
                    }
                }
            }
        }
        diffuse.multiplyVectors(diffuse, intersection.obj!.cDiffuse)
            .multiplyScalar(intersection.obj!.kD)
            .clamp(RayTracer.colorRange[0], RayTracer.colorRange[1]);

        color.add(diffuse).clamp(RayTracer.colorRange[0], RayTracer.colorRange[1]);
        return color;
    }
}
