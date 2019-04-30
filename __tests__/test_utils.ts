import { Polygon } from "../src/Polygon";
import { isLeft, projectPolygon } from "../src/utils";
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

describe("projectPolygon returns a new 3D polygon that is the projection on an axis-aligned plane", () => {
    const A = new Vector3(0, 0, 5);
    const B = new Vector3(1, 0, 5);
    const C = new Vector3(1, 1, 10);
    const D = new Vector3(0, 1, 10);

    const poly = new Polygon([A, B, C, D]);
    test("The polygon is projected on the xy plane", () => {
        const res = projectPolygon(poly);

        for (let i = 0; i < poly.points.length; ++i) {
            expect(res.points[i].x === poly.points[i].x);
            expect(res.points[i].y === poly.points[i].y);
            expect(res.points[i].z === 0);
        }
    });
});
