import { Ray, shiftRayOrigin } from "../src/Ray";
import { Vector3 } from "../src/Vector3";

describe("shiftRayOrigin() move the ray's origin away from the intersected object", () => {
    const t = 10;
    test("The ray is coming away from the intersected object (i.e. reflected ray)", () => {
        const n = new Vector3([0, 1, 0]);
        const r = new Ray(new Vector3([1, 2, 3]), new Vector3([1, 1, 0]));
        const expected = new Ray(new Vector3([1, 12, 3]), r.direction);
        expect(shiftRayOrigin(r, n, t)).toEqual(expected);
    });

    test("The ray is going toward the intersected object (i.e. refracted ray)", () => {
        const n = new Vector3([0, -1, 0]);
        const r = new Ray(new Vector3([1, 2, 3]), new Vector3([-1, -1, 0]));
        const expected = new Ray(new Vector3([1, -8, 3]), r.direction);
        expect(shiftRayOrigin(r, n, t)).toEqual(expected);
    });
});
