import React from "react";
import BookingsHeader from "./_components/bookings-header";
import BookingsTable from "./_components/bookings-table";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;
  const id = cu?.user?.id;

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8">
      <BookingsHeader token={token as string} id={id as string} />
      <BookingsTable token={token as string} />
    </div>
  );
};

export default page;
