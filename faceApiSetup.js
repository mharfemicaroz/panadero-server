// server/faceApiSetup.js

// require("@tensorflow/tfjs-node"); // speeds up TF on Node
const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

module.exports = { faceapi };
