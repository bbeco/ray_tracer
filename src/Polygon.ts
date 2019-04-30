import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

export class Polygon<V extends Vector2 | Vector3> {
    public points: V[];

    constructor(points: V[]) {
        this.points = points;
    }
}
