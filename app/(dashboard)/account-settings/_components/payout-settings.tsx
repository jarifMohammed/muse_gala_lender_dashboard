"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Landmark, CheckCircle2, Loader2, ExternalLink } from "lucide-react";

interface Props {
    token: string;
    userID: string;
    userInfo: any;
}

const PayoutSettings = ({ token, userID, userInfo }: Props) => {
    const setupStripe = useMutation({
        mutationKey: ["setup-stripe"],
        mutationFn: async (email: string) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/onboard`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to onboard Stripe");
            }

            const json = await res.json();
            return json;
        },
        onSuccess: (res) => {
            toast.success("Redirecting to Stripe...");
            window.location.href = res.data.url;
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        },
    });

    const handleSetupStripe = () => {
        if (userInfo?.email) {
            setupStripe.mutate(userInfo.email);
        } else {
            toast.error("User email not found");
        }
    };

    const isOnboarded = userInfo?.stripeOnboardingCompleted;

    return (
        <div className="p-8 bg-white shadow-[0px_4px_20px_0px_#0000000D] rounded-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Landmark className="h-6 w-6 text-[#891d33]" />
                        <h2 className="text-xl font-semibold text-gray-900">Payout Onboarding</h2>
                        {isOnboarded && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                <CheckCircle2 className="h-3 w-3" />
                                Connected
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 max-w-md">
                        Connect your Stripe account to receive payouts for your listed items. This is required to get paid on the platform.
                    </p>
                </div>

                <div>
                    {isOnboarded ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-lg border border-green-100 mb-4">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Stripe Account Linked</span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3 min-w-[280px]">
                                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                                    <span>Stripe Status</span>
                                </div>
                                <div className="flex items-center text-sm gap-4">
                                    <span className="text-gray-500 w-32">Account ID</span>
                                    <span className="font-mono font-medium text-gray-700">{userInfo?.stripeAccountId || "—"}</span>
                                </div>
                                <div className="flex items-center text-sm gap-4">
                                    <span className="text-gray-500 w-32">Charges Enabled</span>
                                    <span className={userInfo?.chargesEnabled ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                        {userInfo?.chargesEnabled ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm gap-4">
                                    <span className="text-gray-500 w-32">Payouts Enabled</span>
                                    <span className={userInfo?.payoutsEnabled ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                        {userInfo?.payoutsEnabled ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={handleSetupStripe}
                            disabled={setupStripe.isPending}
                            className="bg-[#891d33] hover:bg-[#a0243d] text-white min-w-[200px] h-12 shadow-lg shadow-red-900/10 transition-all duration-300 flex items-center gap-2"
                        >
                            {setupStripe.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Connect Stripe for Payouts
                                    <ExternalLink className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {!isOnboarded && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                    <div className="mt-0.5 bg-blue-100 p-1 rounded-full">
                        <Landmark className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-blue-900">Why connect Stripe?</p>
                        <p className="text-xs text-blue-700 mt-0.5">
                            Stripe handles all the financial transactions securely. Once connected, you can request payouts directly to your bank account.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayoutSettings;
