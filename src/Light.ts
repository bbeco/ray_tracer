import { Vector3 } from "./Vector3"

export class PointLight {
    color: Vector3;

    position: Vector3;

    constructor() {
        this.position = new Vector3([0, 1, 0]);
        this.color = new Vector3([1, 1, 1]);
    }
}