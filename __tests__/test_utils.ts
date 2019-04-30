import { Polygon } from "../src/Polygon";
import { areAlmostEqual, isLeft, polygonOrientation } from "../src/utils";
import { Vector2 } from "../src/Vector2";
import { Vector3 } from "../src/Vector3";

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

describe("polygonOrientation returns the normal of a 3D polygon that lies on a plane", () => {
    const A = new Vector3(0, 0, 0);
    const B = new Vector3(1, 0, 0);
    const C = new Vector3(1, 1, 0);
    const D = new Vector3(0, 1, 0);

    const poly = new Polygon([A, B, C, D]);
    test("The normal is the cross produce between two directions that lies on the polygon", () => {
        const res = polygonOrientation(poly);
        const expected = new Vector3(0, 0, 1);

        expected.multiplyScalar(Math.sqrt(2) / 2);
        expect(areAlmostEqual(res, expected));
    });
});
