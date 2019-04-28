import { IntersectionPoint } from "../src/IntersectionPoint";
import { PointLight } from "../src/Light";
import { RayTracer, Scene } from "../src/RayTracer";
import { Sphere } from "../src/Sphere";
import { areAlmostEqual } from "../src/utils";
import { Vector3 } from "../src/Vector3";

describe("A lambertian surface (completely diffuse) is used to test the effect of several lights", () => {
    const obj = new Sphere();
    obj.center.set(0, -1, 0);
    obj.material.kD = 1;
    obj.material.kT = 0;
    obj.material.kS = 0;
    obj.material.kN = 0;

    const xCoordinate = Math.sqrt(3) / 2;
    const light1 = new PointLight(new Vector3([-xCoordinate, 0.5, 0]));
    const light2 = new PointLight(new Vector3([xCoordinate, 0.5, 0]));

    const lights: PointLight[] = [
        light1,
    ];

    const scene = new Scene();
    scene.lightList = lights;
    scene.objectList = [obj];

    const rayTracer = new RayTracer();
    rayTracer.scene = scene;
    rayTracer.ambient.set(0, 0, 0);

    test("Reset ambient light so that it becames easier to compute diffuse component", () => {
        expect(areAlmostEqual(rayTracer.ambient, new Vector3([0, 0, 0])));
    });

    test("The surface is centered in (0, 0, 0) with unitary radius", () => {
        expect(obj.center = new Vector3([0, -1, 0]));
        expect(obj.radius = 1);
    });

    const int = new IntersectionPoint();
    int.obj = obj;
    int.point = new Vector3([0, 0, 0]);
    int.normal = obj.normal(int.point);

    test("The normal in the intersection point is parallel to the Y-axis", () => {
        expect(areAlmostEqual(int.normal!, new Vector3([0, 1, 0])));
    });

    test("The point is partly shaded when lit by a single light", () => {
        expect(scene.lightList).toHaveLength(1);
        const diffuse = rayTracer.shade(int, new Vector3(), new Vector3());
        expect(areAlmostEqual(diffuse, new Vector3([0.5, 0.5, 0.5]))).toBeTruthy();
    });

    test("The two lights sum up if the point is lit by both", () => {
        scene.lightList.push(light2);
        expect(scene.lightList).toHaveLength(2);
        const diffuse = rayTracer.shade(int, new Vector3(), new Vector3());
        expect(areAlmostEqual(diffuse, new Vector3([1, 1, 1]))).toBeTruthy();
    });
});
