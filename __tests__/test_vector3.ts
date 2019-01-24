import { Vector3 } from "../src/Vector3";

describe("Testing additions", () => {
    test("Addition can be concatenated", () => {
        const a = new Vector3([3, 3, 3]);
        const b = new Vector3([1, 1, 1]);
        const c = new Vector3([2, 2, 2]);
        a.add(b).add(c);
        expect(a).toEqual(new Vector3([6, 6, 6]));
    });
});

describe("Testing clamping", () => {
    const min = new Vector3([0, 0, 0]);
    const max = new Vector3([10, 10, 10]);

    test("No clamp", () => {
        const v = new Vector3([5, 5, 5]);
        const expected = v.clone();
        expect(v.clamp(min, max)).toEqual(expected);
    });

    test("Clamping all axes", () => {
        const v = new Vector3([-5, 15, 20]);
        const expected = new Vector3([0, 10, 10]);
        expect(v.clamp(min, max)).toEqual(expected);
    });

    test("Clamping some axes only", () => {
        const v = new Vector3([-5, 5, 20]);
        const expected = new Vector3([0, 5, 10]);
        expect(v.clamp(min, max)).toEqual(expected);
    });
});

describe("Testing component-wise multiplication", () => {
    test("component-wise multiplication", () => {
        const a = new Vector3([1, 0, 2]);
        const b = new Vector3([-1, 10, 3]);
        const expected = new Vector3([-1, 0, 6]);

        expect(a.multiplyVectors(a, b)).toEqual(expected);
    });
});
