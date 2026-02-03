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
import Link from "next/link";
import { usePaymentsFilter } from "./states/usePaymentsFilter";

interface Props {
  token: string;
}

type Payout = {
  _id: string;
  lenderId: string;
  bookingId: string;
  bookingAmount: number;
  requestedAmount: number;
  commission: number;
  status: string;
  requestedAt: string;
};

type PayoutsResponse = {
  payouts: Payout[];
  total: number;
  page: number;
  limit: number;
};

const PaymentsTable = ({ token }: Props) => {
  const [page, setPage] = React.useState(1);

  const { search } = usePaymentsFilter();

  const { data, isLoading, isFetching } = useQuery<PayoutsResponse>({
    queryKey: ["payouts", page, search],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/my?page=${page}&limit=10?search=${search}`,
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

  const payouts = data?.payouts ?? [];

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[100px] text-center">Payout ID</TableHead>
              <TableHead className="w-[100px] text-center">
                Booking ID
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Booking Amount
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Requested Amount
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Commission
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Requested At
              </TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : payouts.length > 0 ? (
              payouts.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center">{item._id}</TableCell>
                  <TableCell className="text-center">
                    {item.bookingId}
                  </TableCell>
                  <TableCell className="text-center">
                    ${item.bookingAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    ${item.requestedAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.commission}%
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(item.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 rounded-3xl font-semibold text-xs py-1 ${
                        item.status === "pending" &&
                        "text-orange-600 bg-orange-200"
                      } ${
                        item.status === "paid" && "text-green-600 bg-green-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-5">
                    <Link href={`/payouts/${item._id}`}>
                      <Button>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No payouts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Page {data.page} of {Math.ceil(data.total / data.limit)} •{" "}
            {data.total} records
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(data.total / data.limit)}
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

export default PaymentsTable;
