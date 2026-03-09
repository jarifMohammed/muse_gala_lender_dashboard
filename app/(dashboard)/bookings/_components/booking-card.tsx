"use client";

import React from "react";
import { Booking } from "@/types/bookings/bookingTypes";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import AcceptRejectButton from "./accept-reject-button";
import { cn } from "@/lib/utils";

interface BookingCardProps {
    item: Booking;
    token: string;
}

const BookingCard = ({ item, token }: BookingCardProps) => {
    const formatStatus = (status?: string) => {
        if (!status) return "Pending";
        return status.replace(/([A-Z])/g, " $1").trim();
    };

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case "Pending":
                return "text-orange-600 bg-orange-100";
            case "ShippedToCustomer":
                return "text-blue-600 bg-blue-100";
            case "Paid":
                return "text-green-600 bg-green-100";
            default:
                if (status.includes("Rejected")) {
                    return "text-red-600 bg-red-100";
                }
                return "text-gray-600 bg-gray-100";
        }
    };

    const isPending = item.deliveryStatus === "Pending";

    return (
        <div className="bg-white p-5 rounded-xl shadow-[0px_4px_10px_0px_#0000001A] space-y-4 border border-gray-50">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Order ID</p>
                    <p className="font-semibold text-sm break-all">{item._id.toUpperCase()}</p>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-neutral-500 hover:text-primary hover:bg-primary/5"
                    asChild
                >
                    <Link href={`/bookings/${item._id}`}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Dress Name</p>
                <p className="text-sm font-medium line-clamp-1 break-all">{item.dressName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Payment</p>
                    <span
                        className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-medium w-fit",
                            item.paymentStatus === "Paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                        )}
                    >
                        {item.paymentStatus}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Delivery</p>
                    <span
                        className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-medium w-fit",
                            getStatusBadgeStyle(item.deliveryStatus)
                        )}
                    >
                        {formatStatus(item.deliveryStatus)}
                    </span>
                </div>
            </div>

            {isPending && (
                <div className="pt-2 w-full">
                    <AcceptRejectButton
                        token={token}
                        bookingId={item._id}
                        lenderId={item.allocatedLender?.lenderId}
                    />
                </div>
            )}
        </div>
    );
};

export default BookingCard;
