import Link from "next/link";
import React from "react";

interface Profile {
  hasActiveSubscription: boolean;
  stripeOnboardingCompleted: boolean;
  totalReveneue: string
}

interface Props {
  profile: Profile;
}

const PaymentsCard = ({ profile }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-10">
      <div className="bg-white p-6 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
        <h1 className="text-sm mb-5">Total Revenue</h1>
        <h1 className="font-medium text-2xl">{profile?.totalReveneue}</h1>
      </div>

      <div
        className={`p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]  transition-all duration-300 cursor-pointer ${
          profile?.hasActiveSubscription
            ? "bg-primary text-white"
            : "bg-white hover:bg-primary hover:text-white"
        }`}
      >
        <h1 className="text-sm mb-5">Subscription</h1>
        <h1 className="font-medium text-2xl">Subscription Plan</h1>
      </div>

      <div
        className={`p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]  transition-all duration-300 cursor-pointer ${
          profile?.stripeOnboardingCompleted
            ? "bg-primary text-white"
            : "bg-white hover:bg-primary hover:text-white"
        }`}
      >
        <h1 className="text-sm mb-5">Next Payout</h1>
        <h1>
          {profile?.stripeOnboardingCompleted ? (
            <h1 className="font-medium text-2xl">Stripe Onboarded</h1>
          ) : (
            <p>
              Please set up{" "}
              <Link href={"/payments"} className="font-medium underline">
                stripe
              </Link>
            </p>
          )}
        </h1>
      </div>
    </div>
  );
};

export default PaymentsCard;
