"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Handshake, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
    token: string;
    bookingId: string;
    lenderId: string;
    deliveryStatus: string;
}

const AcceptStatus = ({ token, bookingId, lenderId, deliveryStatus }: Props) => {
    const queryClient = useQueryClient();
    const isCompleted = deliveryStatus !== "Pending";
    const isRejected = deliveryStatus === "Rejected";
    const isAccepted = isCompleted && !isRejected;

    const { mutateAsync: handleAction, isPending } = useMutation({
        mutationKey: ["accept-reject"],
        mutationFn: async (action: "accept" | "reject") => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/accept-reject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${token}`,
                    },
                    body: JSON.stringify({ bookingId, lenderId, action }),
                }
            );
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
            toast.success(data?.message);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        },
    });

    const IconName = isRejected ? X : isAccepted ? Check : Handshake;

    return (
        <div className="flex flex-col items-center group">
            {/* Icon row with connecting line */}
            <div className="relative flex justify-center items-center w-full mb-3">
                {/* Progress Line extending right from center of icon */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 h-[2px] transition-colors duration-500 ${isCompleted ? "bg-primary" : "bg-neutral-200"
                        }`}
                    style={{ left: "50%", right: "-3rem", zIndex: 0 }}
                />

                {/* Icon Circle - always centered */}
                <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-2 shadow-sm flex-shrink-0 ${isCompleted
                        ? isRejected
                            ? "bg-red-500 border-red-500 text-white scale-110 shadow-red-200"
                            : "bg-primary border-primary text-white scale-110 shadow-primary/20"
                        : "bg-white border-neutral-200 text-neutral-400"
                        }`}
                >
                    <IconName
                        className={`h-6 w-6 transition-transform duration-300 ${isCompleted ? "scale-110" : ""}`}
                    />
                </div>
            </div>

            <div className="flex gap-2">
                {!isCompleted ? (
                    <>
                        <Button
                            onClick={() => handleAction("accept")}
                            disabled={isPending}
                            className="w-20 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-primary/20 hover:-translate-y-0.5"
                        >
                            {isPending ? "..." : "Accept"}
                        </Button>
                        <Button
                            onClick={() => handleAction("reject")}
                            disabled={isPending}
                            variant="outline"
                            className="w-20 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg transition-all duration-300 border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-red-500 hover:border-red-100"
                        >
                            Reject
                        </Button>
                    </>
                ) : (
                    <Button
                        disabled
                        className={`w-24 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg bg-neutral-50 border-neutral-100 opacity-60 cursor-default ${isRejected ? "text-red-500" : "text-neutral-400"
                            }`}
                    >
                        {isRejected ? "Rejected" : "Approved"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AcceptStatus;
