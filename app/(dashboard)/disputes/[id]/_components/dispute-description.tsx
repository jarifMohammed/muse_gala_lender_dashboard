"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type BookingDetails = {
  description?: string;
};

type AboutBookingProps = {
  disputesDetails?: BookingDetails;
  isLoading?: boolean;
};

const DisputeDescription: React.FC<AboutBookingProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Dispute Reason</h1>
      </div>

      <div className="mt-4 text-sm">
        <p>{disputesDetails?.description}</p>
      </div>
    </div>
  );
};

export default DisputeDescription;
