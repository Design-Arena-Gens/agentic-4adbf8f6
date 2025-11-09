"use client";

import type { Violation } from "../page";

interface ViolationsListProps {
  violations: Violation[];
  onUpdateStatus: (id: string, status: Violation["status"]) => void;
}

export default function ViolationsList({
  violations,
  onUpdateStatus,
}: ViolationsListProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Violation["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "disputed":
        return "bg-red-100 text-red-800";
    }
  };

  if (violations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">✓</div>
        <p className="text-lg">No violations detected yet</p>
        <p className="text-sm mt-2">Start monitoring to detect parking violations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {violations.map((violation) => (
        <div
          key={violation.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        >
          <div className="flex gap-4">
            <img
              src={violation.imageUrl}
              alt="Violation"
              className="w-32 h-24 object-cover rounded border-2 border-red-500"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {violation.licensePlate}
                  </h3>
                  <p className="text-sm text-gray-600">{violation.location}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    violation.status
                  )}`}
                >
                  {violation.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>🕒 {formatDate(violation.timestamp)}</span>
                <span className="font-semibold text-red-600">
                  Fine: ${violation.fineAmount}
                </span>
              </div>

              <div className="flex gap-2">
                {violation.status === "pending" && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(violation.id, "paid")}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => onUpdateStatus(violation.id, "disputed")}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
                    >
                      Dispute
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
