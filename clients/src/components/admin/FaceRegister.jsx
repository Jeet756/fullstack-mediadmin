import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceRegister({ onCapture }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef();
  const [blinked, setBlinked] = useState(false);

  useEffect(() => {
  startCamera();
  loadModels();

  return () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
}, []);

  const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    videoRef.current.srcObject = stream;
  } catch (err) {
    alert("Camera permission denied");
    console.error(err);
  }
};
const loadModels = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    setModelsLoaded(true);
  } catch (err) {
    console.error("Model load failed", err);
    alert("Face models failed to load");
  }
};

const detectBlink = async () => {
  if (!modelsLoaded) {
    alert("Models are still loading");
    return;
  }

  const detections = await faceapi
    .detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    )
    .withFaceLandmarks();

  if (!detections) {
    alert("Face not detected");
    return;
  }

  const leftEye = detections.landmarks.getLeftEye();
  const rightEye = detections.landmarks.getRightEye();

  const leftEyeOpen = Math.abs(leftEye[1].y - leftEye[5].y);
  const rightEyeOpen = Math.abs(rightEye[1].y - rightEye[5].y);

  if (leftEyeOpen < 3 && rightEyeOpen < 3) {
    setBlinked(true);
    alert("Blink detected ✅");
  } else {
    alert("Please blink properly");
  }
};

 const capture = async () => {
  if (!modelsLoaded) {
  alert("Models are still loading");
  return;
}
const detections = await faceapi.detectAllFaces(
  videoRef.current,
  new faceapi.TinyFaceDetectorOptions()
);

if (detections.length === 0) {
  alert("No face detected");
  return;
}

if (detections.length > 1) {
  alert("Only one face allowed");
  return;
}

  if (!blinked) {
    alert("Blink first");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);

const base64 = canvas.toDataURL("image/jpeg", 0.9);
  onCapture(base64);

  setBlinked(false);
};

  return (
    <div>
      <video ref={videoRef} autoPlay width="300" />
      <br />
      <button onClick={detectBlink}>Check Blink</button>
      <button onClick={capture}>Capture</button>
    </div>
  );
}

export default FaceRegister;