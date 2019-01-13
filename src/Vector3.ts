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
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
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

    public multiplyScalar(s: number): this {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    public dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public clamp(min: Vector3, max: Vector3): this {
        const clampValue = (val: number, minV: number, maxV: number) => Math.max(Math.min(val, maxV), minV);

        this.x = clampValue(this.x, min.x, max.x);
        this.y = clampValue(this.y, min.y, max.y);
        this.z = clampValue(this.z, min.z, max.z);

        return this;
    }
}
