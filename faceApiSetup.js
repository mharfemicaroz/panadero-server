// server/faceApiSetup.js

<<<<<<< HEAD
require("@tensorflow/tfjs-node"); // speeds up TF on Node
=======
// require("@tensorflow/tfjs-node"); // speeds up TF on Node
>>>>>>> 5d599e5abe490abc467f68f0fef3998953d5e14b
const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

module.exports = { faceapi };
