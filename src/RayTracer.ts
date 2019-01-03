import { Camera, ImageSensor } from "./Camera";
import { PointLight as Light } from "./Light";
import { Sphere } from "./Sphere";

class Scene {
    public objectList: Sphere[];
    public lightList: Light[];
    public camera: Camera;

    constructor() {
        this.objectList = [new Sphere()];
        this.lightList = [new Light()];
        this.camera = new Camera(new ImageSensor());
    }
}

const scene = new Scene();

const canv = document.createElement("canvas");
canv.width = scene.camera.sensor.res[0];
canv.height = scene.camera.sensor.res[1];

document.body.appendChild(canv);
const ctx = canv.getContext("2d");
ctx!.fillStyle = "red";
ctx!.fillRect(0, 0, canv.width, canv.height);

for (let v = 0; v < canv.height; ++v) {
    for (let u = 0; u < canv.width; ++u) {
        scene.camera.computeRay(u, v);
    }
}

console.log("It works! (Sort of)");
