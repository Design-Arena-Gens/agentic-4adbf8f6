"use client";

import type { Violation } from "../page";

interface StatisticsProps {
  violations: Violation[];
}

export default function Statistics({ violations }: StatisticsProps) {
  const totalViolations = violations.length;
  const pendingViolations = violations.filter(
    (v) => v.status === "pending"
  ).length;
  const totalFines = violations.reduce((sum, v) => sum + v.fineAmount, 0);
  const collectedFines = violations
    .filter((v) => v.status === "paid")
    .reduce((sum, v) => sum + v.fineAmount, 0);

  const stats = [
    {
      label: "Total Violations",
      value: totalViolations,
      icon: "🚨",
      color: "bg-red-500",
    },
    {
      label: "Pending Cases",
      value: pendingViolations,
      icon: "⏳",
      color: "bg-yellow-500",
    },
    {
      label: "Total Fines",
      value: `$${totalFines}`,
      icon: "💰",
      color: "bg-blue-500",
    },
    {
      label: "Collected",
      value: `$${collectedFines}`,
      icon: "✓",
      color: "bg-green-500",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-xl p-6 flex items-center gap-4"
        >
          <div className={`${stat.color} text-white p-4 rounded-lg text-3xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </>
  );
}
