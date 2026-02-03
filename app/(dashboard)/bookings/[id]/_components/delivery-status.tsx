import React from "react";
import ShippingStatus from "./shipping-status";
import PickupStatus from "./pickup-status";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  bookingDetails: {
    deliveryMethod?: string;
    deliveryStatus?: string;
  };
  token: string;
  isLoading: boolean;
}

const DeliveryStatus = ({ bookingDetails, token, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex w-full gap-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-full">
            <div className="flex items-center gap-8">
              <Skeleton className="p-10 rounded-full" />

              <Skeleton
                className={`h-2 w-full rounded-3xl ${
                  index === 4 ? "hidden" : "block"
                }`}
              />
            </div>

            <Skeleton className="h-4 w-3/4 my-3" />

            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {bookingDetails?.deliveryMethod === "Shipping" ? (
        <ShippingStatus
          deliveryStatus={bookingDetails?.deliveryStatus}
          token={token}
        />
      ) : (
        <PickupStatus
          deliveryStatus={bookingDetails?.deliveryStatus}
          token={token}
        />
      )}
    </div>
  );
};

export default DeliveryStatus;
