import { Camera, ImageSensor } from "../src/Camera";
import { Ray } from "../src/Ray";
import { Vector3 } from "../src/Vector3";

test("Testing computeRay()", () => {
    const sensor = new ImageSensor([3, 3]);
    const camera = new Camera(sensor);

    let expected = new Ray(new Vector3(), new Vector3([0, 0, -1]));

    expect(camera.computeRay(1, 1)).toEqual(expected);

    let expectedDir = new Vector3([-1, 0, -1]);
    expected = new Ray(new Vector3(), expectedDir.normalize());
    expect(camera.computeRay(0, 1)).toEqual(expected);

    expectedDir = new Vector3([0, 1, -1]);
    expected = new Ray(new Vector3(), expectedDir.normalize());
    expect(camera.computeRay(1, 0)).toEqual(expected);
});
