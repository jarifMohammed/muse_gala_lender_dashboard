"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LucideIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  deliveryStatus: string;
  statusValue: string;
  IconName: LucideIcon;
  btnName: string;
  title: string;
  token: string;
  bookingId: string;
}

const UpdateStatus = ({
  deliveryStatus,
  statusValue,
  IconName,
  btnName,
  title,
  token,
  bookingId,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["status"],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({ deliveryStatus: statusValue }),
        }
      );
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const handleConfirm = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.log(`error ${error}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center  gap-8">
        <div
          className={`p-5 rounded-full  flex flex-col justify-center items-center ${
            deliveryStatus === statusValue
              ? "bg-primary text-white"
              : "bg-white"
          }`}
        >
          <IconName
            className={`h-8 w-8 font-bold ${
              deliveryStatus === statusValue ? "text-white" : "text-primary"
            }`}
          />
        </div>

        <div
          className={`h-2 w-full rounded-3xl ${
            deliveryStatus === statusValue ? "bg-primary" : "bg-[#d9d9d9]"
          } ${statusValue === "Dress Returned" ? "hidden" : "block"}`}
        ></div>
      </div>

      <h3 className="font-medium my-3">{title}</h3>

      <Button
        onClick={handleConfirm}
        variant={deliveryStatus === statusValue ? "default" : "outline"}
        className={`border border-primary disabled:border-gray-500 disabled:cursor-not-allowed`}
      >
        {isPending ? `${btnName}...` : `${btnName}`}
      </Button>
    </div>
  );
};

export default UpdateStatus;
