"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

interface Customer {
  _id?: string;
  firstName?: string;
}

interface Booking {
  _id?: string;
  customer?: Customer;
}

interface DisputeDetails {
  _id?: string;
  status?: "Pending" | "Resolved" | "Rejected" | "Escalated" | string;
  booking?: Booking;
  createdAt?: string;
  escalationPriority?: string;
  escalatedAt?: string;
}

interface AboutDisputesProps {
  disputesDetails?: DisputeDetails | null;
  isLoading: boolean;
}

const AboutDisputes: React.FC<AboutDisputesProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Dispute Summary</h1>
        <div>
          <span
            className={`px-2 rounded-3xl font-semibold text-xs py-1 ${disputesDetails?.status === "Pending"
              ? "text-orange-600 bg-orange-200"
              : disputesDetails?.status === "Resolved"
                ? "text-green-600 bg-green-200"
                : disputesDetails?.status === "Rejected"
                  ? "text-red-600 bg-red-200"
                  : disputesDetails?.status === "Escalated"
                    ? "text-white bg-[#54051d]"
                    : "text-gray-600 bg-gray-200"
              }`}
          >
            {disputesDetails?.status ?? "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between border-b pb-1 gap-4">
          <span className="text-gray-500 whitespace-nowrap">Dispute ID</span>
          <span className="font-medium text-right break-all">{disputesDetails?._id ?? "N/A"}</span>
        </div>
        <div className="flex justify-between border-b pb-1 gap-4">
          <span className="text-gray-500 whitespace-nowrap">Booking ID</span>
          <span className="font-medium text-right break-all">{disputesDetails?.booking?._id ?? "N/A"}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Customer</span>
          <span className="font-medium">{disputesDetails?.booking?.customer?.firstName ?? "N/A"}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Reported At</span>
          <span className="font-medium">
            {disputesDetails?.createdAt
              ? new Date(disputesDetails.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        {disputesDetails?.escalationPriority && (
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-500">Escalation Priority</span>
            <span className={`font-semibold ${disputesDetails.escalationPriority === "High" ? "text-red-600" :
              disputesDetails.escalationPriority === "Medium" ? "text-orange-600" : "text-blue-600"
              }`}>
              {disputesDetails.escalationPriority}
            </span>
          </div>
        )}
        {disputesDetails?.escalatedAt && (
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-500">Escalated At</span>
            <span className="font-medium">
              {new Date(disputesDetails.escalatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutDisputes;
