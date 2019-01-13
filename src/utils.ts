import { Vector3 } from "./Vector3";

export function distanceSq(a: Vector3, b: Vector3): number {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
}
