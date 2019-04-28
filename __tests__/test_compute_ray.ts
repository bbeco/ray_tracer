import { Camera, ImageSensor } from "../src/Camera";
import { Ray } from "../src/Ray";
import { Vector3 } from "../src/Vector3";

describe("Test camera's computeRay()", () => {
    const sensor = new ImageSensor([3, 3]);
    const camera = new Camera(sensor);

    test("sampling center of image", () => {
        const expected = new Ray(new Vector3(), new Vector3(0, 0, -1));

        expect(camera.computeRay(1, 1)).toEqual(expected);
    });

    test("Testing a ray passing through a pixel on the left hand side of the image", () => {
        const expectedDir = new Vector3(-1, 0, -1);
        const expected = new Ray(new Vector3(), expectedDir.normalize());
        expect(camera.computeRay(0, 1)).toEqual(expected);
    });

    test("Testing a ray passing through a pixel on the upper side of the image", () => {
        const expectedDir = new Vector3(0, 1, -1);
        const expected = new Ray(new Vector3(), expectedDir.normalize());
        expect(camera.computeRay(1, 0)).toEqual(expected);
    });
});
