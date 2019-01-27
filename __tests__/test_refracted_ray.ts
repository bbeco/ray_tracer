import { Ray } from "../src/Ray";
import { Sphere } from "../src/Sphere";
import { areAlmostEqual } from "../src/utils";
import { Vector3 } from "../src/Vector3";

describe("Testing refracted ray computation", () => {
    test("The refracted ray obeys Snell's law", () => {
        const s = new Sphere();
        s.kN = 2.0;
        const intersectionPoint = new Vector3([0, 1, 0]);
        const r = new Ray(intersectionPoint, (new Vector3([-1, -1, 0])).normalize());
        const rRay = s.computeRefractedRay(intersectionPoint, r);
        expect(rRay).not.toBeNull();
        const refractedDir = rRay!.direction;
        const angle = Math.asin(Math.sqrt(2) / (2 * s.kN));
        const expectedX = -Math.sin(angle);
        const expectedY = -Math.cos(angle);
        const expected = new Vector3([expectedX, expectedY, 0]);
        expect(areAlmostEqual(refractedDir, expected)).toBe(true);
    });

    test("The direction of ray does not change before and after it traversed the object", () => {
        const s = new Sphere();
        s.kN = 2.0;
        const entryPoint = new Vector3([0, 1, 0]);
        const rEntering = new Ray(entryPoint, (new Vector3([-1, -1, 0])).normalize());
        const rRay = s.computeRefractedRay(entryPoint, rEntering);
        expect(rRay).not.toBeNull();

        // the real exit point does not matter, if we are just interested in the ray's exit direction
        const exitPoint = new Vector3([0, -1, 0]);
        const rExiting = s.computeRefractedRay(exitPoint, rRay!);
        expect(areAlmostEqual(rEntering.direction, rExiting!.direction)).toBe(true);
    });
});
