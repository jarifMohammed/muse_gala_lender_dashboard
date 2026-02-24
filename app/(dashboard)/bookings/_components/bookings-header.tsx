"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useBookingsFilter } from "./states/useBookingsFilter";
import ManualBookings from "./manual-bookings";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BookingsHeader = ({ token, id }: { token: string; id: string }) => {
  const { setSearch, setStartDate, setEndDate } = useBookingsFilter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>();
  const router = useRouter();

  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data?.data;
    },
    enabled: !!token && !!id,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-card"],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/savePaymentInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );
      return await res.json();
    },
    onSuccess: (data) => {
      router.push(data?.data?.url);
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });

  const handleCard = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };

  useEffect(() => {
    setIsDisabled(
      !profile?.stripeCustomerId || !profile?.defaultPaymentMethodId
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
          Bookings
        </h1>

        <div className="flex items-center gap-4">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={
                    isPending ||
                    (profile?.stripeCustomerId &&
                      profile?.defaultPaymentMethodId)
                  }
                  onClick={handleCard}
                  className="bg-black hover:bg-black disabled:cursor-not-allowed"
                >
                  {isPending ? "Add Payment Method..." : "Add Payment Method"}
                </Button>
              </TooltipTrigger>
              {profile?.stripeCustomerId && profile?.defaultPaymentMethodId && (
                <TooltipContent>
                  <p>Payment method already added.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isDisabled}
                  onClick={() => setIsOpen(true)}
                  className="disabled:cursor-not-allowed"
                >
                  Manual Booking
                </Button>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Please add payment method first</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10 bg-white p-5  rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-8">
        <div className="relative">
          <Input
            className="pl-7 w-[220px]"
            placeholder="Search...."
            onChange={(e) => setSearch(e.target.value)}
          />

          <Search className="h-4 w-4 text-gray-500 absolute top-1/3 left-2" />
        </div>

        <div>
          <Select>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Delivery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Shipping</SelectItem>
              <SelectItem value="dark">Local Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Pending</SelectItem>
              <SelectItem value="dark">Disputed</SelectItem>
              <SelectItem value="system">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase ml-1">Start Date</span>
            <input
              type="date"
              className="w-[160px] focus-visible:ring-0 border border-input h-9 rounded-md text-sm shadow-sm px-3 py-1"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase ml-1">End Date</span>
            <input
              type="date"
              className="w-[160px] focus-visible:ring-0 border border-input h-9 rounded-md text-sm shadow-sm px-3 py-1"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <ManualBookings isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default BookingsHeader;
