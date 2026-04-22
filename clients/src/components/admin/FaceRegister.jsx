import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceRegister({ onCapture }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef();
  const intervalRef = useRef(null);
  const [blinked, setBlinked] = useState(false);
  const [movement, setMovement] = useState({

  center: false,
  left: false,
  right: false
});
const [status, setStatus] = useState("Idle");
  useEffect(() => {
  startCamera();
  loadModels();

 return () => {
  if (videoRef.current?.srcObject) {
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
};
}, []);

  const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = () => {
  videoRef.current.play();
};
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

const detectHeadMovement = () => {
  if (!modelsLoaded) {
    alert("Models are still loading");
    return;
  }
  if (intervalRef.current) {
  clearInterval(intervalRef.current);
}
setStatus("Look straight");
  let steps = {
    center: false,
    left: false,
    right: false
  };

  intervalRef.current = setInterval(async () => {
    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks();

    if (!detection) return;

    const nose = detection.landmarks.getNose();
    const noseX = nose[3].x;
    const faceWidth = videoRef.current.videoWidth;

    const ratio = noseX / faceWidth;

    console.log("Face Position:", ratio);

    if (ratio > 0.4 && ratio < 0.6) {
  steps.center = true;
  setStatus("Now move LEFT");
}

   if (ratio < 0.35 && steps.center) {
  steps.left = true;
  setStatus("Now move RIGHT");
  console.log("Left detected");
}

    // RIGHT
    if (ratio > 0.65 && steps.left) {
      steps.right = true;
      console.log("Right detected");
    }

    // DONE
    if (steps.center && steps.left && steps.right) {
      setStatus("Verified ✅");
      clearInterval(intervalRef.current);
      setMovement(steps);
      setBlinked(true); // reuse same flag
      alert("Liveness verified ✅");
    }
  }, 300);
};

const capture = async () => {
  if (!modelsLoaded) {
    alert("Models are still loading");
    return;
  }

  if (!blinked) {
  alert("Please verify face movement first");
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
      <div>
  Step 1: Look straight <br />
  Step 2: Move head LEFT <br />
  Step 3: Move head RIGHT
</div>
<div>Status: {status}</div>
      <button type="button" onClick={detectHeadMovement}>
  Verify Face Movement
</button>

<button type="button" onClick={capture}>
  Capture
</button>
    </div>
  );
}

export default FaceRegister;