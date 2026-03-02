"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type StatusHistory = {
  _id: string;
  status: string;
};

export type BookingDetails = {
  id?: string;
  statusHistory?: StatusHistory[];
  deliveryStatus?: string;
  customer?: { _id?: string };
  dressName?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  totalAmount?: number;
  createdAt?: string;
};

type AboutBookingProps = {
  bookingDetails?: BookingDetails;
  isLoading?: boolean;
};

const AboutBooking: React.FC<AboutBookingProps> = ({
  bookingDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">
          Booking ID: {bookingDetails?.id}
        </h1>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          Delivery Status:{" "}
          <span className="font-semibold">
            {bookingDetails?.deliveryStatus ?? "Pending"}
          </span>
        </div>
        <h1>Customer ID: {bookingDetails?.customer?._id ?? "N/A"}</h1>
        <h1>Dress: {bookingDetails?.dressName ?? "N/A"}</h1>
        <h1>
          Rental Period:{" "}
          {bookingDetails?.rentalStartDate
            ? new Date(bookingDetails.rentalStartDate).toLocaleDateString()
            : "N/A"}{" "}
          -{" "}
          {bookingDetails?.rentalEndDate
            ? new Date(bookingDetails.rentalEndDate).toLocaleDateString()
            : "N/A"}
        </h1>
        <h1>Total Price: ${bookingDetails?.totalAmount ?? 0}</h1>
        <h1>
          Order Date:{" "}
          {bookingDetails?.createdAt
            ? new Date(bookingDetails.createdAt).toLocaleDateString()
            : "N/A"}
        </h1>
      </div>
    </div>
  );
};

export default AboutBooking;
