"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
    token: string;
    userID: string;
    userInfo: any;
}

const PaymentMethods = ({ token, userID, userInfo }: Props) => {
    const router = useRouter();

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
            if (data?.data?.url) {
                router.push(data.data.url);
            } else {
                toast.error("Failed to get Stripe session URL");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to initiate payment method setup");
        },
    });

    const handleAddPaymentMethod = async () => {
        try {
            await mutateAsync();
        } catch (error) {
            console.error(`Error adding payment method: ${error}`);
        }
    };

    const hasPaymentMethod = userInfo?.stripeCustomerId && userInfo?.defaultPaymentMethodId;

    return (
        <div className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_0px_#0000000D] border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                        {hasPaymentMethod && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 max-w-md">
                        Manage your payment methods for manual bookings and platform fees. We use Stripe for secure payment processing.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {hasPaymentMethod ? (
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">Default Card Linked</p>
                                <p className="text-xs text-gray-1000">Securely stored via Stripe</p>
                            </div>
                        </div>
                    ) : null}

                    <Button
                        onClick={handleAddPaymentMethod}
                        disabled={isPending || hasPaymentMethod}
                        className={`min-w-[200px] h-11 transition-all duration-300 ${hasPaymentMethod
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-none"
                            : "bg-[#891d33] hover:bg-[#a0243d] text-white shadow-lg shadow-red-900/10"
                            }`}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting to Stripe...
                            </>
                        ) : hasPaymentMethod ? (
                            "Payment Method Added"
                        ) : (
                            "Add Payment Method"
                        )}
                    </Button>
                </div>
            </div>

            {!hasPaymentMethod && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
                    <div className="mt-0.5 bg-amber-100 p-1 rounded-full">
                        <CreditCard className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-900">Action Required</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            You haven't added a payment method yet. Please add one to enable manual bookings.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
