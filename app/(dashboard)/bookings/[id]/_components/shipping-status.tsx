"use client";
import React, { useState } from "react";
import { Box, Check, FileText, Truck, Undo2 } from "lucide-react";
import { useParams } from "next/navigation";
import UpdateStatus from "./update-status";
import AcceptStatus from "./accept-status";

interface Props {
  deliveryStatus?: string;
  token: string;
  lenderId: string;
}

const ShippingStatus = ({ deliveryStatus, token, lenderId }: Props) => {
  const params = useParams();
  const bookingId = params.id;

  const statusOrder = [
    "Pending",
    "Confirmed",
    "ShippedToCustomer",
    "Return Due",
    "Dress Returned",
  ];

  const getCurrentIndex = (status: string) => {
    if (status === "ReturnLinkSent") return statusOrder.indexOf("Return Due");
    const index = statusOrder.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getCurrentIndex(deliveryStatus as string);

  return (
    <div className="flex w-full gap-12 items-start py-6">
      {/* accept/reject */}
      <AcceptStatus
        deliveryStatus={deliveryStatus as string}
        token={token}
        bookingId={bookingId as string}
        lenderId={lenderId}
      />



      {/* mark as shipped */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="ShippedToCustomer"
        negativeStatusValue="Cannot Fullfill"
        negativeBtnName="Cannot Fulfill"
        completedBtnName="Shipped"
        IconName={Truck}
        bookingId={bookingId as string}
        btnName="Dress Shipped"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("ShippedToCustomer")}
        isDisabled={currentIndex !== statusOrder.indexOf("Confirmed")}
      />

      {/* return due */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Return Due"
        completedBtnName="Handed Over"
        IconName={Undo2}
        bookingId={bookingId as string}
        btnName="Return Due"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("Return Due")}
        isDisabled={currentIndex !== statusOrder.indexOf("ShippedToCustomer")}
      />

      {/* dress returned */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Dress Returned"
        completedBtnName="Returned"
        IconName={Box}
        bookingId={bookingId as string}
        btnName="Returned"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("Dress Returned")}
        isDisabled={currentIndex !== statusOrder.indexOf("Return Due")}
      />
    </div>
  );
};

export default ShippingStatus;
