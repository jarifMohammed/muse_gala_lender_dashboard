"use client";
import React, { useState } from "react";
import { Box, Check, FileText, Truck, Undo2 } from "lucide-react";
import { useParams } from "next/navigation";
import UpdateStatus from "./update-status";

interface Props {
  deliveryStatus?: string;
  token: string;
}

const ShippingStatus = ({ deliveryStatus, token }: Props) => {

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
        IconName={FileText}
        bookingId={bookingId as string}
        btnName="Print Shipping Label"
        title="Label Ready"
        token={token}
      />

      {/* mark as shipped */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="ShippedToCustomer"
        IconName={Truck}
        bookingId={bookingId as string}
        btnName="Mark as Shipped"
        title="Dress Shipped"
        token={token}
      />

      {/* return due */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Return Due"
        IconName={Undo2}
        bookingId={bookingId as string}
        btnName="Return Due"
        title="Return Due"
        token={token}
      />

      {/* dress returned */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Dress Returned"
        IconName={Box}
        bookingId={bookingId as string}
        btnName="Dress Returned"
        title="Dress Returned"
        token={token}
      />
    </div>
  );
};

export default ShippingStatus;
