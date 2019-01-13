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
        const s = new Sphere();
        s.center.set(0, 0, -8.01);
        s.radius = 1;

        this.objectList = [s];
        this.lightList = [
            new Light(new Vector3([0, 1.5, -6.5]), new Vector3([1, 0, 0])),
            new Light(new Vector3([-1.5, -1.5, -6.5]), new Vector3([0, 1, 0])),
            new Light(new Vector3([+1.5, -1.5, -6.5]), new Vector3([0, 0, 1])),
        ];
        const sensor = res ? new ImageSensor(res, 35.0, 20, 480 / 18) : new ImageSensor([640, 480], 1.0, 1.0, 1.0);
        this.camera = new Camera(sensor);
    }
}

export class RayTracer {
    public static MaxDepth = 1;

    private static minColor = new Vector3([0, 0, 0]);
    private static maxColor = new Vector3([1, 1, 1]);

    private static backgroundColor = new Vector3();

    private static eps = 1e-6;

    // ambient light
    private static ambient = new Vector3([0.01, 0.01, 0.01]);

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

    public trace(uIndex: number, vIndex: number, depth?: number) {
        if (!depth) {
            depth = RayTracer.MaxDepth;
        }

        if (depth === 0) {
            return new Vector3();
        }

        let closestInt: Intersection | null = null;
        for (const obj of this.scene.objectList) {
            const ray = this.scene.camera.computeRay(uIndex, vIndex);
            const intPoint = obj.intersect(ray);
            if (!intPoint) {
                continue;
            }

            const disSq = distanceSq(intPoint, ray.origin);
            if (!closestInt) {
                closestInt = new Intersection(intPoint, obj.normal(intPoint), obj, disSq);
            } else if (disSq < closestInt.distanceSq) {
                closestInt.point = intPoint;
                closestInt.normal = obj.normal(intPoint);
                closestInt.obj = obj;
                closestInt.distanceSq = disSq;
            }
        }

        const color = this.ambient.clone();
        if (closestInt) {
            for (const light of this.scene.lightList) {
                const l = light.position.clone().sub(closestInt.point).normalize();
                const lightRay = new Ray(
                    closestInt.point.add(closestInt.normal.clone().multiplyScalar(RayTracer.eps)),
                    l);
                for (const obj of this.scene.objectList) {
                    if (!obj.intersect(lightRay)) {
                        const dot = l.dot(closestInt.normal);
                        if (dot >= 0) {
                            color.add(light.color.clone().multiplyScalar(dot));
                        }
                    }
                }
            }
            color.multiplyVectors(color, closestInt.obj.cDiffuse).multiplyScalar(closestInt.obj.kD);
            return color.clamp(RayTracer.minColor, RayTracer.maxColor);
        }
        return RayTracer.backgroundColor;
    }
}
