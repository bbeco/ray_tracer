import { Vector3 } from "./Vector3";

export class Sphere {

    // The position of the centre of the sphere
    public center: Vector3;

    // The radius of the sphere
    public radius: number;

    // Diffuse reflection constant
    private kD: number;

    // Specular reflection coefficient
    private kS: number;

    // Transmission coefficient
    private kT: number;

    // Index of refraction;
    private kN: number;

    constructor() {
        this.kD = 1.0;
        this.kS = 1.0;
        this.kT = 1.0;
        this.kN = 1.0;

        this.center = new Vector3();
        this.radius = 1.0;
    }
}
