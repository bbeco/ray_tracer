"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("../src/Camera");
const Ray_1 = require("../src/Ray");
const Vector3_1 = require("../src/Vector3");
test("Testing computeRay()", () => {
    let sensor = new Camera_1.ImageSensor([3, 3]);
    let camera = new Camera_1.Camera(sensor);
    let expected = new Ray_1.Ray(new Vector3_1.Vector3(), new Vector3_1.Vector3([0, 0, -1]));
    expect(camera.computeRay(1, 1)).toEqual(expected);
    let expectedDir = new Vector3_1.Vector3([-1, 0, -1]);
    expected = new Ray_1.Ray(new Vector3_1.Vector3(), expectedDir.normalize());
    expect(camera.computeRay(0, 1)).toEqual(expected);
    expectedDir = new Vector3_1.Vector3([0, 1, -1]);
    expected = new Ray_1.Ray(new Vector3_1.Vector3(), expectedDir.normalize());
    expect(camera.computeRay(1, 0)).toEqual(expected);
});
