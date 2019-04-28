/**
 * @brief Defines a 2D point
 *
 * @export
 * @class Vector2
 */
export class Vector2 {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0.0;
        this.y = y || 0.0;
    }
}
