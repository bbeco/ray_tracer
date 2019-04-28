import { isLeft } from "../src/utils";
import { Vector2 } from "../src/Vector2";

describe("isLeft checks if a point lies on the left of a given line", () => {
    const p0 = new Vector2(0, 0);
    const p1 = new Vector2(0, 1);
    test("The point is on the left w.r.t. the line", () => {
        const p = new Vector2(-1, 0);
        expect(isLeft(p0, p1, p)).toBeGreaterThan(0);
    });
    test("The point is on the right w.r.t. the line", () => {
        const p = new Vector2(1, 0);
        expect(isLeft(p0, p1, p)).toBeLessThan(0);
    });
    test("The point belongs to the line", () => {
        const p = new Vector2(0, 2);
        expect(isLeft(p0, p1, p)).toBe(0);
    });
});
