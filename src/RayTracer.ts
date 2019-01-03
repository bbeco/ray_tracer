import { Camera, ImageSensor } from "./Camera"
import { Sphere } from "./Sphere"
import { PointLight as Light } from "./Light"

class Scene {
    camera: Camera;

    constructor() {
        this.camera = new Camera(new ImageSensor());
    }
}
let canv = document.createElement("canvas");
canv.width = 640;
canv.height = 480;

document.body.appendChild(canv);
let ctx = canv.getContext("2d");
ctx!.fillStyle = "blue";
ctx!.fillRect(0, 0, canv.width, canv.height);

console.log("It works! Sort of...");