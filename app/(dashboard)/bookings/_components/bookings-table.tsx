"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingsResponse } from "@/types/bookings/bookingTypes";
import { useBookingsFilter } from "./states/useBookingsFilter";
import Link from "next/link";
import PayoutButton from "./payout-button";
import AcceptRejectButton from "./accept-reject-button";

interface Props {
  token: string;
}

const BookingsTable = ({ token }: Props) => {
  const [page, setPage] = React.useState(1);

  const { search, date, deliveryType, status } = useBookingsFilter();

  const { data, isLoading, isFetching } = useQuery<BookingsResponse>({
    queryKey: ["all-bookings", page, search, date, deliveryType, status],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/allocated?page=${page}&search=${search}&date=${date}&status=${status}`,
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
  });

  const bookings = data?.data ?? [];
  const paginationInfo = data?.pagination;

  // Helper function to get current status from statusHistory
  const getCurrentStatus = (
    statusHistory: Array<{ status: string; timestamp: string; _id: string }>
  ) => {
    if (!statusHistory || statusHistory.length === 0) return "Unknown";
    // Sort by timestamp descending and get the latest status
    const sorted = [...statusHistory].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sorted[0].status;
  };

  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-200";
      case "ShippedToCustomer":
        return "text-blue-600 bg-blue-200";
      case "Paid":
        return "text-green-600 bg-green-200";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[100px] text-center">Order ID</TableHead>
              <TableHead className="w-[100px] text-center">
                Dress Name
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Customer Email
              </TableHead>
              <TableHead className="w-[100px] text-center">Price</TableHead>
              <TableHead className="w-[100px] text-center">
                Rental Period
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Delivery Type
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Payment Status
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Delivery Status
              </TableHead>
              <TableHead className="w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center font-medium">
                    {item?._id?.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.dressName}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.customer?.email}
                  </TableCell>
                  <TableCell className="text-center">
                    ${item?.totalAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span>
                        {new Date(item?.rentalStartDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500">to</span>
                      <span>
                        {new Date(item?.rentalEndDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({item?.rentalDurationDays} days)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item?.deliveryMethod === "Shipping"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item?.deliveryMethod}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item?.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item?.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                        item?.deliveryStatus
                      )}`}
                    >
                      {item?.deliveryStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link href={`/bookings/${item?._id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                       <PayoutButton
                          paymentStatus={item?.paymentStatus}
                          id={item?._id}
                          token={token}
                        />
                      {item?.deliveryStatus === "Pending" && (
                        <AcceptRejectButton
                          bookingId={item?._id}
                          lenderId={item?.allocatedLender?.lenderId}
                          token={token}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-6 text-gray-500"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationInfo && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Page {paginationInfo?.currentPage} of {paginationInfo?.totalPages} •{" "}
            {paginationInfo?.totalItems} records
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= paginationInfo?.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
