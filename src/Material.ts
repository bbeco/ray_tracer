import { Vector3 } from "./Vector3";

/**
 * @brief This class describe the property of a material
 *
 * @export
 * @class Material
 */
export class Material {
    /**
     * The diffuse color of the sphere
     *
     * @type {Vector3}
     * @memberof Material
     */
    public color: Vector3;

    /**
     * Index of refraction, this is 0 for opaque (non-transparent) objects.
     *
     * @type {number}
     * @memberof Material
     */
    public kN: number;

    /**
     * Specular reflection coefficient.
     *
     * @type {number}
     * @memberof Material
     */
    public kS: number;

    /**
     * Diffuse reflection constant.
     *
     * @type {number}
     * @memberof Material
     */
    public kD: number;

    /**
     *  Transmission coefficient
     *
     * @type {number}
     * @memberof Material
     */
    public kT: number;

    constructor(color: Vector3, kN: number, kS: number, kD: number, kT: number) {
        this.color = color;
        this.kN = kN;
        this.kS = kS;
        this.kD = kD;
        this.kT = kT;
    }
}
