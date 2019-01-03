import { Vector3 } from "./Vector3";

export class Sphere {
    // Diffuse reflection constant
    private kD: number;

    // Specular reflection coefficient
    private kS: number;

    // Transmission coefficient
    private kT: number;

    // Index of refraction;
    private kN: number;

    // The position of the centre of the sphere
    center: Vector3;

    // The radius of the sphere
    radius: number;

    constructor() {
        this.kD = 1.0;
        this.kS = 1.0;
        this.kT = 1.0;
        this.kN = 1.0;

        this.center = new Vector3();
        this.radius = 1.0;
    }
}