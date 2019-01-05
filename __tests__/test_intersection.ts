import { Ray } from "../src/Ray";
import { Sphere } from "../src/Sphere";
import { Vector3 } from "../src/Vector3";

describe("Non intersecting ray", () => {
    const ray = new Ray(new Vector3(), new Vector3([0, 1, 0]));
    test("Sphere is behind the ray's origin", () => {
        const sphere = new Sphere();
        sphere.center.set(0, -2, 0);
        expect(sphere.intersect(ray)).toBeNull();
    });

    test("The sphere is too far from the ray", () => {
        const sphere = new Sphere();
        sphere.center.set(2, 0, 0);
        expect(sphere.intersect(ray)).toBeNull();
    });
});

describe("Single point intersection", () => {
    const ray = new Ray(new Vector3(), new Vector3([0, 1, 0]));

    test("The ray is tangent to the sphere", () => {
        const sphere = new Sphere();
        sphere.center.set(1, 3, 0);
        expect(sphere.intersect(ray)).toEqual(new Vector3([0, 3, 0]));
    });

    test("The ray's origin is inside the sphere's volume", () => {
        const sphere = new Sphere();
        sphere.center.set(0, -0.5, 0);
        expect(sphere.intersect(ray)).toEqual(new Vector3([0, 0.5, 0]));
    });
});

describe("Two intersection points", () => {
    const ray = new Ray(new Vector3(), new Vector3([0, 1, 0]));

    test("The ray hits the sphere in two different intersection points", () => {
        const sphere = new Sphere();
        sphere.center.set(0, 3, 0);
        expect(sphere.intersect(ray)).toEqual(new Vector3([0, 2, 0]));
    });
});
