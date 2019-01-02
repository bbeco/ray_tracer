export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(pos?: Array<number>) {
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

    lengthSq(): number {
        return (Math.pow(this.x, 2), Math.pow(this.y, 2), Math.pow(this.z, 2));
    }

    normalize(): Vector3 {
        let lengthSq = this.lengthSq();
        this.x /= lengthSq;
        this.y /= lengthSq;
        this.z /= lengthSq;
        return this;
    }
}