"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const PaymentHeader = ({ token, id }: { token: string; id: string }) => {
  const { data: profile = {} } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`,
        {
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

  const { data: goToDashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["go-to-dashboard", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/stripe/account/dashboard`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json;
    },
    enabled: !!token && !!profile?.stripeOnboardingCompleted,
  });

  const isOnboarded = profile?.stripeOnboardingCompleted;
  const dashboardUrl = goToDashboard?.data?.url;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
          Payments
        </h1>

        <div className="space-x-5">
          {isOnboarded ? (
            <Button
              variant="outline"
              asChild
              disabled={dashboardLoading}
            >
              <a href={dashboardUrl || "#"} target="_blank" rel="noopener noreferrer">
                {dashboardLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Dashboard...
                  </>
                ) : (
                  "Go to Stripe Dashboard"
                )}
              </a>
            </Button>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              Complete Payout Onboarding in Account Settings to access your dashboard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHeader;
