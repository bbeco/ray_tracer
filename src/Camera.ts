import { Ray } from "./Ray"
import { Vector3 } from "./Vector3"

export class ImageSensor {
    // The sensor resolution
    res: Array<number>;

    // pixel density in the horizontal direction.
    k_u: number;

    // pixel density in the vertical direction.
    k_v: number;

    // The focal length.
    // Even thougth this does not depends on the image sensor, we keep it here because this is yet another intrinsic parameter
    fLength: number;

    constructor(res?: Array<number>, f?: number, k_u?: number, k_v?: number) {
        if (res) {
            if (res.length != 2) {
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

        this.k_u = k_u ? k_u : 1.0;
        this.k_v = k_v ? k_v : 1.0;
    }
}

// For the moment I have set both the camera position and its orientation to fixed values such that it is placed in 0, 0, 0 and
// faces toward the -z axis.
export class Camera {
    constructor(public sensor: ImageSensor) { }

    computeRay(uIndex: number, vIndex: number): Ray {
        if (uIndex < 0 || uIndex >= this.sensor.res[0] || vIndex < 0 || vIndex >= this.sensor.res[1]) {
            throw new Error("Invalid image coordinate");
        }

        let direction = new Vector3();
        direction.x = (uIndex - this.sensor.res[0] / 2) * this.sensor.fLength / this.sensor.k_u + this.sensor.k_u / 2;
        direction.y = -(vIndex - this.sensor.res[0] / 2) * this.sensor.fLength / this.sensor.k_v - this.sensor.k_v / 2;
        direction.z = -1;

        return new Ray(new Vector3([0, 0, 0]), direction.normalize());
    }
}