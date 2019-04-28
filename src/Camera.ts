import { Ray } from "./Ray";
import { Vector3 } from "./Vector3";

export class ImageSensor {
    // pixel density in the horizontal direction.
    public kU: number;

    // pixel density in the vertical direction.
    public kV: number;

    // The focal length.
    // Even though this does not depends on the image sensor, we keep it here because this is yet another intrinsic
    // parameter
    public fLength: number;

    // The sensor resolution
    private _res: number[];

    // principal point coordinates
    private _u0: number;
    private _v0: number;

    constructor(res?: number[], f?: number, kU?: number, kV?: number) {
        if (res) {
            if (res.length !== 2) {
                throw new Error("res has to be an array of 2 elements");
            }
            if (!Number.isInteger(res[0]) || !Number.isInteger(res[1])) {
                throw new Error("res has to be an array of integer numbers");
            }
            this._res = res;
        } else {
            this._res = [640, 480];
        }

        this.fLength = f ? f : 1.0;

        this.kU = kU ? kU : 1.0;
        this.kV = kV ? kV : 1.0;
        this._u0 = Math.floor(this._res[0] / 2);
        this._v0 = Math.floor(this._res[1] / 2);
    }

    get u0(): number {
        return this._u0;
    }

    get v0(): number {
        return this._v0;
    }

    get res(): number[] {
        return this._res;
    }

    set res(newRes: number[]) {
        this._res = newRes;
        this._u0 = Math.floor(this._res[0] / 2);
        this._v0 = Math.floor(this._res[1] / 2);
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
        direction.x = (uIndex - this.sensor.u0) / (this.sensor.fLength * this.sensor.kU);
        // The order of the subtraction parameter is inverted w.r.t. the previous one, such that it can pass the test
        // (the problem was -0 is not equal to 0, which caused one of the test to fail)
        direction.y = (this.sensor.v0 - vIndex) / (this.sensor.fLength * this.sensor.kV);
        direction.z = -1;

        return new Ray(new Vector3(0, 0, 0), direction.normalize());
    }
}
