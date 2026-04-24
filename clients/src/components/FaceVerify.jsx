import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceVerify({ onVerify }) {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState("Idle");
const [processing, setProcessing] = useState(false);
useEffect(() => {
  const init = async () => {
    await loadModels();
    await startCamera();
  };
  init();

  return () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };
}, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    setModelsLoaded(true);
  };

  const capture = async () => {
    if (processing) return;
setProcessing(true);
    if (!modelsLoaded) return alert("Models loading");

    setStatus("Capturing...");

    let embeddings = [];

    for (let i = 0; i < 5; i++) {
      if (!videoRef.current || videoRef.current.videoWidth === 0) continue;

      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

if (!detections.length) {
  setStatus(`No face ❌ (try ${i + 1}/5)`);
  await new Promise(r => setTimeout(r, 400));
  continue;
}

      // 🔥 pick largest face (anti group attack)
      detections.sort(
        (a, b) =>
          b.detection.box.width * b.detection.box.height -
          a.detection.box.width * a.detection.box.height
      );

      const d = detections[0];
      if (!d || !d.detection) continue;

      // 🔥 confidence check
      if (d.detection.score < 0.8) {
        setStatus("Low confidence ❌");
        continue;
      }

      const box = d.detection.box;

      const faceArea = box.width * box.height;
      const videoArea =
        videoRef.current.videoWidth * videoRef.current.videoHeight;

      const ratio = faceArea / videoArea;

      // 🔥 distance check
      if (ratio < 0.1) {
        setStatus("Come closer ❌");
        continue;
      }

      // 🔥 center check
      const centerX = box.x + box.width / 2;
      const videoCenter = videoRef.current.videoWidth / 2;

      if (
        Math.abs(centerX - videoCenter) >
        videoRef.current.videoWidth * 0.2
      ) {
        setStatus("Center your face ❌");
        continue;
      }

      if (d.descriptor) {
        embeddings.push(Array.from(d.descriptor));
      }

      await new Promise(r => setTimeout(r, 400));
    }

    if (embeddings.length < 3) {
      return alert("Face not clear");
    }

    // ✅ average
    const avg = new Array(128).fill(0);
    embeddings.forEach(e => {
      e.forEach((v, i) => (avg[i] += v));
    });
    for (let i = 0; i < 128; i++) avg[i] /= embeddings.length;

    // ✅ normalize
    const norm = Math.sqrt(avg.reduce((s, v) => s + v * v, 0));
    const finalEmbedding = avg.map(v => v / norm);

    setStatus("Face captured ✅");
setProcessing(false);
    onVerify(finalEmbedding);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="300" />
      <p>{status}</p>
        <button onClick={capture} disabled={processing}>
  {processing ? "Processing..." : "Verify Face"}
</button>
    </div>
  );
}

export default FaceVerify;