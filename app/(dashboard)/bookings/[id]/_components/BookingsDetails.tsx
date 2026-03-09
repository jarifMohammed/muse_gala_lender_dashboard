"use client";

import { BookingsResponse } from "@/types/bookings/bookingTypes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AboutBooking from "./about-booking";
import AboutPayment from "./about-payment";
import AboutReturn from "./about-return";
import DisputeForm from "./dispute-form";
import DeliveryStatus from "./delivery-status";
import PayoutButton from "../../_components/payout-button";
import AcceptRejectButton from "../../_components/accept-reject-button";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

const BookingsDetails = ({ token }: Props) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const { data: bookingDetails, isLoading } = useQuery<any>({
    queryKey: ["all-bookings", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
  });

  return (
    <div>
      <div className="mb-4">
        <Button
          className="p-0 h-auto hover:bg-transparent"
          effect="expandIcon"
          icon={MoveLeft}
          iconPlacement="left"
          variant="link"
          onClick={() => router.back()}
        >
          Back Now
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="uppercase text-2xl">Booking Details</h1>
        <div className="flex items-center gap-2">
          {!isLoading && bookingDetails && (
            <>
              <PayoutButton
                paymentStatus={bookingDetails?.paymentStatus}
                payoutStatus={bookingDetails?.payoutStatus}
                id={bookingDetails?._id}
                token={token}
              />
            </>
          )}
        </div>
      </div>

      <div className="mb-10">
        <DeliveryStatus
          bookingDetails={bookingDetails}
          token={token}
          isLoading={isLoading}
          lenderId={bookingDetails?.allocatedLender?.lenderId}
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <AboutBooking bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutPayment bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutReturn bookingDetails={bookingDetails} isLoading={isLoading} />
      </div>

      <div>
        <DisputeForm />
      </div>
    </div>
  );
};

export default BookingsDetails;
