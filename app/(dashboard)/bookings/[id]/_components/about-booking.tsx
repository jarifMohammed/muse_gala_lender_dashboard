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
  customer?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  dressName?: string;
  brand?: string;
  size?: string;
  color?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  totalAmount?: number;
  createdAt?: string;
  shippingAddress?: string | {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    address?: string;
  };
  pickupLocation?: string;
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

  const formatStatus = (status?: string) => {
    if (!status) return "Pending";
    return status.replace(/([A-Z])/g, " $1").trim();
  };

  const formatAddress = (address: any) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    const { street, city, state, postcode, address: addr } = address;
    if (addr) return addr;
    return [street, city, state, postcode].filter(Boolean).join(", ") || "N/A";
  };

  const displayAddress = formatAddress(bookingDetails?.shippingAddress || bookingDetails?.pickupLocation);

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium break-all">
          Customer Name: {bookingDetails?.customer?.firstName} {bookingDetails?.customer?.lastName}
        </h1>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          Delivery Status:{" "}
          <span className="font-semibold">
            {formatStatus(bookingDetails?.deliveryStatus)}
          </span>
        </div>
        <h1 className="break-all">Booking ID: {bookingDetails?.id}</h1>
        <h1 className="break-all">Customer ID: {bookingDetails?.customer?._id ?? "N/A"}</h1>
        <h1>Dress: {bookingDetails?.dressName ?? "N/A"}</h1>
        <h1>Brand: {bookingDetails?.brand ?? "N/A"}</h1>
        <h1>Size: {bookingDetails?.size ?? "N/A"}</h1>
        <h1>Color: {bookingDetails?.color ?? "N/A"}</h1>
        <h1 className="break-all">Address: {displayAddress}</h1>
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
