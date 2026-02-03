"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type TimeLine = {
  timestamp: string;
};

type DisputesDetails = {
  timeline?: TimeLine[];
};

type AboutBookingProps = {
  disputesDetails?: DisputesDetails;
  isLoading?: boolean;
};

const DisputeTimeline: React.FC<AboutBookingProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  const timeline = disputesDetails?.timeline ?? [];

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Time Line</h1>
      </div>

      <div className="mt-4 text-sm">
        {timeline.length > 0 ? (
          timeline.map((i, index) => (
            <p key={index}>
              {new Date(i.timestamp).toLocaleDateString()}
            </p>
          ))
        ) : (
          <p>No timeline events found.</p>
        )}
      </div>
    </div>
  );
};

export default DisputeTimeline;
