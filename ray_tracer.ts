
let canv = document.createElement("canvas");
canv.width = 640;
canv.height = 480;

document.body.appendChild(canv);
let ctx = canv.getContext("2d");
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canv.width, canv.height);