import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceRegister({ onCapture }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef();
  const intervalRef = useRef(null);
const [verified, setVerified] = useState(false);
const [status, setStatus] = useState("Idle");
const stepsRef = useRef({
  center: false,
  left: false,
  right: false,
});
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
  if (!videoRef.current?.srcObject) {
  startCamera();
}
  // reset steps
stepsRef.current = {
  center: false,
  left: false,
  right: false,
};

// clear old interval
if (intervalRef.current) {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
}
  if (!modelsLoaded) {
    alert("Models are still loading");
    return;
  }

const steps = stepsRef.current;

  setStatus("Look straight");

  intervalRef.current = setInterval(async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
  return;
}
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

if (detections.length === 0) {
  setStatus("No face detected ❌");
  return;
}

if (detections.length > 1) {
  // filter closest (largest face)
  detections.sort(
    (a, b) =>
      b.detection.box.width * b.detection.box.height -
      a.detection.box.width * a.detection.box.height
  );
}

    const detection = detections[0];
    if (!detection) return;

    const nose = detection.landmarks.getNose();
    const noseX = nose[3].x;
    const faceWidth = videoRef.current.videoWidth;

    const ratio = noseX / faceWidth;

// CENTER
if (!steps.center && ratio > 0.45 && ratio < 0.55) {
  steps.center = true;
  setStatus("Now move LEFT");
}

// LEFT
else if (!steps.left && steps.center && ratio < 0.35) {
  steps.left = true;
  setStatus("Now move RIGHT");
}

// RIGHT
else if (!steps.right && steps.left && ratio > 0.65) {
  steps.right = true;
}

    // DONE
    if (steps.center && steps.left && steps.right) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setVerified(true);
      setStatus("Liveness verified ✅");
    }

  }, 300);
};

const capture = async () => {
  if (!modelsLoaded) {
    alert("Models loading...");
    return;
  }

  if (!verified) {
    alert("Verify face movement first");
    return;
  }

  setStatus("Capturing multiple samples...");

  let tempEmbeddings = [];

  for (let i = 0; i < 5; i++) {
      if (!videoRef.current || videoRef.current.readyState !== 4) continue;
    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

  if (detections.length === 0) {
  setStatus("No face detected ❌");
  continue;
}

// pick largest face
detections.sort(
  (a, b) =>
    b.detection.box.width * b.detection.box.height -
    a.detection.box.width * a.detection.box.height
);

const detection = detections[0];

    // ❌ null safety (crash fix)
    if (!detection) {
      setStatus("No face detected ❌");
      continue;
    }
if (!detection.detection) {
  setStatus("Detection failed ❌");
  continue;
}
    // 📦 FACE BOX
    const box = detection.detection.box;

    const faceArea = box.width * box.height;
    const videoArea =
      videoRef.current.videoWidth * videoRef.current.videoHeight;

    const ratio = faceArea / videoArea;

    // ❌ too far
    if (ratio < 0.1) {
      setStatus("Face too far ❌");
      continue;
    }

    // ❌ not centered
    const centerX = box.x + box.width / 2;
    const videoCenter = videoRef.current.videoWidth / 2;

    if (
      Math.abs(centerX - videoCenter) >
      videoRef.current.videoWidth * 0.2
    ) {
      setStatus("Center your face ❌");
      continue;
    }

if (detection.descriptor && detection.detection.score > 0.85) {
  tempEmbeddings.push(Array.from(detection.descriptor));
}

    await new Promise((res) => setTimeout(res, 400));
  }

  if (tempEmbeddings.length < 3) {
    alert("Face not clear. Try again.");
    return;
  }

  // ✅ AVERAGE
  const avg = new Array(128).fill(0);
  tempEmbeddings.forEach((emb) => {
    emb.forEach((val, i) => {
      avg[i] += val;
    });
  });

  for (let i = 0; i < 128; i++) {
    avg[i] /= tempEmbeddings.length;
  }

  // ✅ NORMALIZE
  const norm = Math.sqrt(avg.reduce((sum, v) => sum + v * v, 0));
  const finalEmbedding = avg.map((v) => v / norm);

  onCapture({
    embedding: finalEmbedding,
  });

  setVerified(false);
  clearInterval(intervalRef.current);
intervalRef.current = null;
setStatus("Face captured successfully ✅");
stepsRef.current = {
  center: false,
  left: false,
  right: false,
};
if (videoRef.current?.srcObject) {
  const tracks = videoRef.current.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
}
};

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline width="300" />
      <br />
      <div>
  Follow the instruction shown below 👇
</div>
<div>Status: {status}</div>
      <button type="button" onClick={detectHeadMovement}>
  Verify Face Movement
</button>

<button type="button" onClick={capture} disabled={!verified}>
  Capture
</button>
    </div>
  );
}

export default FaceRegister;