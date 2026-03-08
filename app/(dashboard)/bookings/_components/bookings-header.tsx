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

  useEffect(() => {
    setIsDisabled(
      !profile?.stripeCustomerId || !profile?.defaultPaymentMethodId
    );
  }, [profile]);

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
                  disabled={isDisabled}
                  onClick={() => setIsOpen(true)}
                  className="disabled:cursor-not-allowed"
                >
                  Manual Booking
                </Button>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Please add payment method in Account Settings first</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end gap-6 bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-8 w-full">
        <div className="relative w-full">
          <Input
            className="pl-7 w-full h-10"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />

          <Search className="h-4 w-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-2" />
        </div>

        <div className="w-full">
          <Select>
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Delivery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Shipping</SelectItem>
              <SelectItem value="dark">Local Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select>
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Pending</SelectItem>
              <SelectItem value="dark">Disputed</SelectItem>
              <SelectItem value="system">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-full">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] text-gray-500 uppercase ml-1">Start Date</span>
            <input
              type="date"
              className="w-full focus-visible:ring-0 border border-input h-10 rounded-md text-sm shadow-sm px-3 py-1 outline-none"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] text-gray-500 uppercase ml-1">End Date</span>
            <input
              type="date"
              className="w-full focus-visible:ring-0 border border-input h-10 rounded-md text-sm shadow-sm px-3 py-1 outline-none"
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
