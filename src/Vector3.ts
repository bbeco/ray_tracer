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
        return (Math.pow(this.x, 2), Math.pow(this.y, 2), Math.pow(this.z, 2));
    }

    public normalize(): Vector3 {
        const lengthSq = this.lengthSq();
        this.x /= lengthSq;
        this.y /= lengthSq;
        this.z /= lengthSq;
        return this;
    }
}
