import { Ray } from "./Ray";
import { Vector3 } from "./Vector3";

export class ImageSensor {
    // The sensor resolution
    public res: number[];

    // pixel density in the horizontal direction.
    public kU: number;

    // pixel density in the vertical direction.
    public kV: number;

    // The focal length. Even thougth this does not depends on the image sensor, we keep it here because this is yet
    // another intrinsic parameter
    public fLength: number;

    constructor(res?: number[], f?: number, kU?: number, kV?: number) {
        if (res) {
            if (res.length !== 2) {
                throw new Error("res has to be an array of 2 elements");
            }
            if (!Number.isInteger(res[0]) || !Number.isInteger(res[1])) {
                throw new Error("res has to be an array of integer numbers");
            }
            this.res = res;
        } else {
            this.res = [640, 480];
        }

        this.fLength = f ? f : 1.0;

        this.kU = kU ? kU : 1.0;
        this.kV = kV ? kV : 1.0;
    }
}

// For the moment I have set both the camera position and its orientation to fixed values such that it is placed in 0,
// 0, 0 and faces toward the -z axis.
export class Camera {
    public sensor: ImageSensor;

    constructor(sensor?: ImageSensor) {
        this.sensor = sensor ? sensor : new ImageSensor();
    }

    public computeRay(uIndex: number, vIndex: number): Ray {
        if (uIndex < 0 || uIndex >= this.sensor.res[0] || vIndex < 0 || vIndex >= this.sensor.res[1]) {
            throw new Error("Invalid image coordinate");
        }

        const direction = new Vector3();
        direction.x = (uIndex - this.sensor.res[0] / 2) * this.sensor.fLength / this.sensor.kU + this.sensor.kU / 2;
        direction.y = -(vIndex - this.sensor.res[0] / 2) * this.sensor.fLength / this.sensor.kV - this.sensor.kV / 2;
        direction.z = -1;

        return new Ray(new Vector3([0, 0, 0]), direction.normalize());
    }
}
