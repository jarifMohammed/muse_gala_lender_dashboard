"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const PayoutButton = ({
  id,
  token,
  paymentStatus,
}: {
  id: string;
  token: string;
  paymentStatus: string;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-payout"],
    mutationFn: async (bookingId) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create payout request");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handlePayout = async (bookingId: any) => {
    try {
      await mutateAsync(bookingId);
    } catch (error) {
      console.log(`error from handle payout : ${error}`);
    }
  };

  return (
    <Button
      disabled={
        paymentStatus === "Pending" ||
        paymentStatus === "NotCharged" ||
        isPending
      }
      onClick={() => handlePayout(id)}
      className="bg-black hover:bg-[#000000ce] disabled:bg-[#000000ce] disabled:cursor-not-allowed"
    >
      {isPending ? (
        <h1 className="flex items-center gap-2">
          <LoaderCircle className="animate-spin h-4 w-4" />
          <span>Payout</span>
        </h1>
      ) : (
        "Payout"
      )}
    </Button>
  );
};

export default PayoutButton;
