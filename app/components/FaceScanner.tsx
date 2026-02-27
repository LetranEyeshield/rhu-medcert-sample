"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

interface FaceScannerProps {
  onCapture: (descriptor: number[]) => void;
}

export default function FaceScanner({ onCapture }: FaceScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      setIsModelLoaded(true);
      console.log("Face API models loaded");
    };

    loadModels();
  }, []);

  // Capture and detect face
  const handleCapture = async () => {
    if (!webcamRef.current || !isModelLoaded) return;

    setIsDetecting(true);

    const video = webcamRef.current.video as HTMLVideoElement;

    const detection = await faceapi
      .detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected. Please try again.");
      setIsDetecting(false);
      return;
    }

    const descriptorArray = Array.from(detection.descriptor);
    onCapture(descriptorArray);

    setIsDetecting(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-lg border shadow-md"
        width={400}
      />

      <button
        onClick={handleCapture}
        disabled={!isModelLoaded || isDetecting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isDetecting ? "Scanning..." : "Capture Face"}
      </button>
    </div>
  );
}
