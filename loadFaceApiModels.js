// server/loadFaceApiModels.js

const { faceapi } = require("./faceApiSetup");
const path = require("path");

async function loadFaceApiModels() {
  // Base path to the "face-api.js-models-master" folder
  const basePath = path.join(__dirname, "models", "face-api.js-models-master");

  // Load the Tiny Face Detector model
  await faceapi.nets.tinyFaceDetector.loadFromDisk(
    path.join(basePath, "tiny_face_detector")
  );

  // Load the Face Landmark 68 model
  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    path.join(basePath, "face_landmark_68")
  );

  // Load the Face Recognition model
  await faceapi.nets.faceRecognitionNet.loadFromDisk(
    path.join(basePath, "face_recognition")
  );

  console.log("face-api.js models loaded from:", basePath);
}

module.exports = { loadFaceApiModels };
