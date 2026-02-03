"use client";
import React from "react";
import UpdateStatus from "./update-status";
import { Box, Check, MapPinCheck, MapPinned, Truck, Undo2 } from "lucide-react";
import { useParams } from "next/navigation";

interface Props {
  deliveryStatus?: string;
  token: string;
}

const PickupStatus = ({ deliveryStatus, token }: Props) => {
  const params = useParams();
  const bookingId = params.id;

  return (
    <div className="flex w-full gap-8">
      {/* confirm order */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Confirmed"
        IconName={Check}
        bookingId={bookingId as string}
        btnName="Fulfil Order"
        title="Order Confirmed"
        token={token}
      />

      {/* fulfil order */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="PreparingShipment"
        IconName={MapPinned}
        bookingId={bookingId as string}
        btnName="Confirm Pick Up time"
        title="Pickup Scheduled"
        token={token}
      />

      {/* mark as shipped */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="ShippedToCustomer"
        IconName={MapPinCheck}
        bookingId={bookingId as string}
        btnName="Item Successfully Picked Up"
        title="Dress Collected"
        token={token}
      />

      {/* return due */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Return Due"
        IconName={Undo2}
        bookingId={bookingId as string}
        btnName="Mark as Returned"
        title="Return Due"
        token={token}
      />

      {/* dress returned */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Dress Returned"
        IconName={Box}
        bookingId={bookingId as string}
        btnName="Escalate Dispute"
        title="Dress Returned"
        token={token}
      />
    </div>
  );
};

export default PickupStatus;
