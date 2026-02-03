"use client";
import React from "react";
import States from "./states";
import LiveListings from "./live-listings";
import Calendar from "./calendar";
import UpcomingOrder from "./upcoming-order";
import { useQuery } from "@tanstack/react-query";

const Overview = ({ token }: { token: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data?.data;
    },
  });

  const liveListings = data?.liveListings || [];
  const upcomingOrders = data?.upcomingOrders || [];

  return (
    <div>

      <div>
        <States data={data} isLoading={isLoading} />
      </div>

      {/* Live Listings Section */}
      <div>
        <LiveListings liveListings={liveListings} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <Calendar token={token} />

        {/* Upcoming Orders Section */}
        <UpcomingOrder upcomingOrders={upcomingOrders} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Overview;
