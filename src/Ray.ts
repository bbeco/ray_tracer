import { Vector3 } from "./Vector3";

export class Ray {
    public origin: Vector3;
    public direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin ? origin : new Vector3();
        this.direction = direction ? direction : new Vector3();
    }
}
