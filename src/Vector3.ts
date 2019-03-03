export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(pos?: number[]) {
        if (pos) {
            this.x = pos[0];
            this.y = pos[1];
            this.z = pos[2];
        } else {
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
        }
    }

    public lengthSq(): number {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
    }

    public length(): number {
        return Math.sqrt(this.lengthSq());
    }

    public normalize(): this {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
    }

    public set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public clone(): Vector3 {
        return (new Vector3()).set(this.x, this.y, this.z);
    }

    /**
     * Copies the values of the passed vector3's x, y and z properties to this vector3.
     * @param v the vector to be copied
     */
    public copy(v: Vector3): this {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    public sub(v: Vector3): this {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    public add(v: Vector3): this {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    /**
     * Scale this vector by the given scaling factor
     * @param s The scaling factor
     */
    public multiplyScalar(s: number): this {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    /**
     * Sets this vector equals to a * b, component-wise
     * @param a
     * @param b
     */
    public multiplyVectors(a: Vector3, b: Vector3): this {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }

    public dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Clamp this vector's components to the range [`min`, `max`] (extremes are included).
     * Clamping is performed component wise.
     *
     * @param min The minimum allowed value
     * @param max The maximum allowed value
     */
    public clamp(min: Vector3, max: Vector3): this {
        const clampValue = (val: number, minV: number, maxV: number) => Math.max(Math.min(val, maxV), minV);

        this.x = clampValue(this.x, min.x, max.x);
        this.y = clampValue(this.y, min.y, max.y);
        this.z = clampValue(this.z, min.z, max.z);

        return this;
    }
}

export function isVector3(x: any): x is Vector3 {
    return x && typeof x.x === "number" && typeof x.y === "number" && typeof x.z === "number"
        && x.length && x.lengthSq && x.add
        && x.clone && x.copy && x.dot && x.clamp && x.normalize && x.set && x.sub && x.multiplyScalar
        && x.multiplyVectors;
}
