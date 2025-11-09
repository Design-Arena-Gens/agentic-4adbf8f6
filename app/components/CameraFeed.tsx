"use client";

import { useEffect, useRef, useState } from "react";
import { detectVehicles } from "../utils/vehicleDetection";
import { recognizeLicensePlate } from "../utils/licensePlateRecognition";
import type { Violation } from "../page";

interface CameraFeedProps {
  isMonitoring: boolean;
  onViolationDetected: (violation: Omit<Violation, "id" | "timestamp">) => void;
}

export default function CameraFeed({
  isMonitoring,
  onViolationDetected,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<string>("Idle");
  const [lastDetection, setLastDetection] = useState<number>(0);

  useEffect(() => {
    if (isMonitoring) {
      startCamera();
      const interval = setInterval(() => {
        if (Date.now() - lastDetection > 3000) {
          processFrame();
        }
      }, 2000);
      return () => clearInterval(interval);
    } else {
      stopCamera();
    }
  }, [isMonitoring, lastDetection]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setDetectionStatus("Monitoring active");
    } catch (error) {
      setDetectionStatus("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setDetectionStatus("Idle");
  };

  const processFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setDetectionStatus("Analyzing frame...");

    // Simulate vehicle detection in non-parking zone
    const vehicleDetected = detectVehicles(canvas);

    if (vehicleDetected) {
      setDetectionStatus("Vehicle detected in non-parking zone!");

      // Capture and process license plate
      const imageUrl = canvas.toDataURL("image/jpeg");
      const licensePlate = await recognizeLicensePlate(canvas);

      if (licensePlate) {
        setDetectionStatus(`Violation detected: ${licensePlate}`);
        setLastDetection(Date.now());

        onViolationDetected({
          licensePlate,
          location: "Zone A - No Parking Area",
          imageUrl,
          fineAmount: 100,
          status: "pending",
        });

        // Draw detection box
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        ctx.fillStyle = "#FF0000";
        ctx.font = "24px Arial";
        ctx.fillText(
          `VIOLATION: ${licensePlate}`,
          60,
          40
        );
      }
    } else {
      setDetectionStatus("Monitoring - No violations detected");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isMonitoring && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📹</div>
              <p className="text-xl">Camera monitoring is paused</p>
            </div>
          </div>
        )}

        {isMonitoring && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-semibold">LIVE</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
        <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm font-medium text-gray-700">
          Status: {detectionStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-gray-600">Detection Algorithm</div>
          <div className="font-semibold text-gray-800">AI Vision + OCR</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-gray-600">Processing Speed</div>
          <div className="font-semibold text-gray-800">2 sec intervals</div>
        </div>
      </div>
    </div>
  );
}
