"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";
import Image from "next/image";

type Media = {
  url: string;
};

type disputesDetails = {
  evidence?: Media[];
};

type AboutBookingProps = {
  disputesDetails?: disputesDetails;
  isLoading?: boolean;
};

const MediaEvidence: React.FC<AboutBookingProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Media & Evidence</h1>
      </div>

      <div className="mt-4 text-sm">
        <div className="flex items-center gap-5">
          {disputesDetails?.evidence?.map((i, index) => (
            <Image
              key={index}
              src={i.url}
              alt="img.png"
              width={1000}
              height={1000}
              className="h-20 w-20 rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaEvidence;
