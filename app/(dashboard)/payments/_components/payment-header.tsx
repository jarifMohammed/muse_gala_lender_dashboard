"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import PaymentsCard from "./payments-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
    if (profile?.email) {
      setupStripe.mutate(profile.email);
    } else {
      toast.error("User email not found");
    }
  };

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
            <Button
              onClick={handleSetupStripe}
              disabled={setupStripe.isPending}
            >
              {setupStripe.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add payment method"
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <PaymentsCard profile={profile} />
      </div>
    </div>
  );
};

export default PaymentHeader;
