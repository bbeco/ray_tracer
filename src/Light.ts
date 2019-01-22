import { Vector3 } from "./Vector3";

export class PointLight {
    public color: Vector3;

    public position: Vector3;

    constructor(position: Vector3, color?: Vector3) {
        this.position = position;
        this.color = color ? color : new Vector3([1, 1, 1]);
    }
}
