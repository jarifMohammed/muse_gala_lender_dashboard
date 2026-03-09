import Link from "next/link";
import React from "react";

interface Profile {
  hasActiveSubscription: boolean;
  stripeOnboardingCompleted: boolean;
  totalReveneue: string;
  subscriptionStartDate?: string;
  subscriptionExpireDate?: string;
  subscription?: {
    planId?: {
      _id: string;
      name: string;
    };
  };
}

interface Props {
  profile: Profile;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PaymentsCard = ({ profile }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className={`p-4 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] transition-all duration-300 cursor-pointer ${profile?.hasActiveSubscription
          ? "bg-primary text-white"
          : "bg-white hover:bg-primary hover:text-white"
          }`}
      >
        <h1 className="text-sm mb-2">Subscription</h1>
        <h1 className="font-medium text-2xl">
          {profile?.subscription?.planId?.name || "Current plan"}
        </h1>
        {profile?.hasActiveSubscription && (
          <p className="mt-2 text-xs opacity-80 italic">Status: Active</p>
        )}
      </div>

      <div
        className={`p-4 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] transition-all duration-300 cursor-pointer ${profile?.hasActiveSubscription
          ? "bg-primary text-white"
          : "bg-white hover:bg-primary hover:text-white"
          }`}
      >
        <h1 className="text-sm mb-2">Subscription Period</h1>
        {profile?.hasActiveSubscription ? (
          <div className="space-y-1">
            <p className="text-sm">
              <span className="opacity-70">Start Date:</span> {formatDate(profile.subscriptionStartDate)}
            </p>
            <p className="text-sm">
              <span className="opacity-70">Expire Date:</span> {formatDate(profile.subscriptionExpireDate)}
            </p>
          </div>
        ) : (
          <h1 className="font-medium text-2xl opacity-50 italic">No Active Subscription</h1>
        )}
      </div>
    </div>
  );
};

export default PaymentsCard;
