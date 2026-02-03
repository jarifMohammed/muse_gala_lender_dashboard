"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Download } from "lucide-react";
import PaymentsCard from "./payments-card";
import { useQuery } from "@tanstack/react-query";

const SubscriptionHeader = ({ token, id }: { token: string; id: string }) => {
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

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
          Subscription Plans
        </h1>
      </div>

      <div className="mt-8">
        <PaymentsCard profile={profile} />
      </div>
    </div>
  );
};

export default SubscriptionHeader;
