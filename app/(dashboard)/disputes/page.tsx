import React from "react";
import { auth } from "@/auth";
import DisputeHeader from "./_components/disputes-header";
import DisputesTable from "./_components/disputes-table";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-8">
      <DisputeHeader token={token as string} />
      <DisputesTable token={token as string} />
    </div>
  );
};

export default page;
