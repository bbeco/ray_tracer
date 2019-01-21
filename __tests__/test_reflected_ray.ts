import { Ray } from "../src/Ray";
import { Sphere } from "../src/Sphere";
import { areAlmostEqual, epsSq } from "../src/utils";
import { Vector3 } from "../src/Vector3";

describe("Testing computeReflectedRay", () => {
    const s = new Sphere();
    test("ray is perpendicular to surface", () => {
        const dir = new Vector3([0, -1, 0]);
        const r = new Ray(new Vector3([0, 10, 0]), dir);
        const p = new Vector3([0, 1, 0]);
        const reflected = s.computeReflectedRay(p, r);
        const expected = new Ray(p, dir.multiplyScalar(-1));
        expect(areAlmostEqual(reflected.origin, expected.origin));
        expect(areAlmostEqual(reflected.direction, expected.direction));
    });

    test("ray is tangent to surface", () => {
        const dir = new Vector3([-1, 0, 0]);
        const r = new Ray(new Vector3([1, 1, 0]), dir);
        const p = new Vector3([0, 1, 0]);
        expect(s.computeReflectedRay(p, r)).toEqual(new Ray(p, dir.multiplyScalar(-1)));
    });

    test("ray is arrives with a 45 degrees angle with respect with the surface normal", () => {
        const dir = new Vector3([-1, -1, 0]).normalize();
        const r = new Ray(new Vector3([1, 2, 0]), dir);
        const p = new Vector3([0, 1, 0]);
        const reflected = s.computeReflectedRay(p, r);
        const expected = new Ray(p, (new Vector3([-1, 1, 0])).normalize());
        expect(areAlmostEqual(reflected.origin, expected.origin)).toBe(true);
        expect(areAlmostEqual(reflected.direction, expected.direction)).toBe(true);
    });
});
