"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import AboutDisputes from "../_components/about-dispute";
import EscalateForm from "./_components/escalate-form";

const page = () => {
  const { id } = useParams();
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const { data: disputesDetails = {}, isLoading } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-medium uppercase tracking-widest">
        Escalate Dispute
      </h1>

      <div className="space-y-8 mt-8">
        <AboutDisputes
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />

        <EscalateForm />
      </div>
    </div>
  );
};

export default page;
