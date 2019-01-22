import { RayTracer } from "./RayTracer";

const res = [640, 480];
const rayTracer = new RayTracer(res);

const canv = document.createElement("canvas");
canv.width = res[0];
canv.height = res[1];

document.body.appendChild(canv);
const ctx = canv.getContext("2d");

console.log(rayTracer.scene.camera.sensor);
for (let v = 0; v < canv.height; ++v) {
    for (let u = 0; u < canv.width; ++u) {
        const color = rayTracer.trace(rayTracer.scene.camera.computeRay(u, v));
        ctx!.fillStyle = `rgb(
            ${Math.floor(color.x * 256)},
            ${Math.floor(color.y * 256)},
            ${Math.floor(color.z * 256)}
            )`;
        ctx!.fillRect(u, v, u + 1, v + 1);
    }
}

console.log("It works! (Sort of)");
