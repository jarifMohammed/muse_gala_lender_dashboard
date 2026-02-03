import React from "react";
import { auth } from "@/auth";
import PaymentFilter from "./_components/payment-filter";
import PaymentHeader from "./_components/subscription-header";
import PaymentsTable from "./_components/subscription-table";
import SubscriptionTable from "./_components/subscription-table";
import SubscriptionHeader from "./_components/subscription-header";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;
  const id = cu?.user?.id;

  return (
    <div className="p-10 space-y-8">
      <SubscriptionHeader token={token as string} id={id as string} />
      <PaymentFilter />
      <SubscriptionTable token={token as string} />
    </div>
  );
};

export default page;
