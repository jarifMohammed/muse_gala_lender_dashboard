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
  status?: "Pending" | "Resolved" | "Rejected" | string;
  booking?: Booking;
  createdAt?: string;
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
        <button>
          <span
            className={`px-2 rounded-3xl font-semibold text-xs py-1 ${
              disputesDetails?.status === "Pending"
                ? "text-orange-600 bg-orange-200"
                : disputesDetails?.status === "Resolved"
                ? "text-green-600 bg-green-200"
                : disputesDetails?.status === "Rejected"
                ? "text-red-600 bg-red-200"
                : "text-gray-600 bg-gray-200"
            }`}
          >
            {disputesDetails?.status ?? "N/A"}
          </span>
        </button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <h1>Dispute ID: {disputesDetails?._id ?? "N/A"}</h1>
        <h1>Booking ID: {disputesDetails?.booking?._id ?? "N/A"}</h1>
        <h1>Customer ID: {disputesDetails?.booking?.customer?._id ?? "N/A"}</h1>
        <h1>
          Customer Name: {disputesDetails?.booking?.customer?.firstName ?? "N/A"}
        </h1>
        <h1>
          Order Date:{" "}
          {disputesDetails?.createdAt
            ? new Date(disputesDetails.createdAt).toLocaleDateString()
            : "N/A"}
        </h1>
      </div>
    </div>
  );
};

export default AboutDisputes;
