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
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models"); // 🔥 add this
    setModelsLoaded(true);
  } catch (err) {
    console.error("Model load failed", err);
    alert("Face models failed to load");
  }
};

const detectBlink = () => {
  if (!modelsLoaded) {
    alert("Models are still loading");
    return;
  }

  let blinkCount = 0;
  let lastEyeOpen = true;

  const interval = setInterval(async () => {
    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks();

    if (!detection) return;

    const leftEye = detection.landmarks.getLeftEye();
    const rightEye = detection.landmarks.getRightEye();

    // ✅ NEW LOGIC (paste here)
const getEyeRatio = (eye) => {
  const vertical = Math.abs(eye[1].y - eye[5].y);
  const horizontal = Math.abs(eye[0].x - eye[3].x);
  return vertical / horizontal;
};

const leftRatio = getEyeRatio(leftEye);
const rightRatio = getEyeRatio(rightEye);

console.log("Eye Ratios:", leftRatio, rightRatio); // debug

const isClosed = leftRatio < 0.2 && rightRatio < 0.2;

    // detect transition (open -> closed)
    if (lastEyeOpen && isClosed) {
      blinkCount++;
      console.log("Blink detected");
    }

    lastEyeOpen = !isClosed;

    if (blinkCount >= 1) {
      clearInterval(interval);
      setBlinked(true);
      alert("Blink detected ✅");
    }
  }, 200); // हर 200ms check
};

const capture = async () => {
  if (!modelsLoaded) {
    alert("Models are still loading");
    return;
  }

  if (!blinked) {
    alert("Blink first");
    return;
  }

  const detection = await faceapi
    .detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );

  if (!detection) {
    alert("No face detected");
    return;
  }

  // 🎯 IMAGE CAPTURE
  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);

  const base64Image = canvas.toDataURL("image/jpeg");

  onCapture(base64Image); // ✅ correct

  setBlinked(false);
};

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline width="300" />
      <br />
      <button type="button" onClick={detectBlink}>
  Check Blink
</button>

<button type="button" onClick={capture}>
  Capture
</button>
    </div>
  );
}

export default FaceRegister;