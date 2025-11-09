"use client";

import { useState } from "react";
import CameraFeed from "./components/CameraFeed";
import ViolationsList from "./components/ViolationsList";
import Statistics from "./components/Statistics";

export interface Violation {
  id: string;
  timestamp: string;
  licensePlate: string;
  location: string;
  imageUrl: string;
  fineAmount: number;
  status: "pending" | "paid" | "disputed";
}

export default function Home() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const addViolation = (violation: Omit<Violation, "id" | "timestamp">) => {
    const newViolation: Violation = {
      ...violation,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setViolations((prev) => [newViolation, ...prev]);
  };

  const updateViolationStatus = (id: string, status: Violation["status"]) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">🚗</span>
            Parking Violation Detection System
          </h1>
          <p className="text-blue-200">
            AI-powered automatic license plate recognition and fine management
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Statistics violations={violations} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Camera Monitoring
              </h2>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  isMonitoring
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
              </button>
            </div>
            <CameraFeed
              isMonitoring={isMonitoring}
              onViolationDetected={addViolation}
            />
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recent Violations
            </h2>
            <ViolationsList
              violations={violations}
              onUpdateStatus={updateViolationStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
