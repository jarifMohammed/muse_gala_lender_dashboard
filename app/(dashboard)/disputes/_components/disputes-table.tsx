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
import { useDisputesFilter } from "./states/useDisputesFilter";
import { DisputesResponse } from "@/types/disputes/DisputesResponse";

interface Props {
  token: string;
}

const DisputesTable = ({ token }: Props) => {
  const [page, setPage] = React.useState(1);
  const { search } = useDisputesFilter();

  const { data, isLoading, isFetching } = useQuery<DisputesResponse>({
    queryKey: ["all-disputes", page, search],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/my-disputes?page=${page}&search=${search}`,
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

  const disputes = data?.disputes ?? [];
  const paginationInfo = {
    currentPage: data?.page ?? 1,
    totalPages: data?.pages ?? 1,
    totalData: data?.total ?? 0,
    hasPrevPage: (data?.page ?? 1) > 1,
    hasNextPage: (data?.page ?? 1) < (data?.pages ?? 1),
  };

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[100px] text-center">
                Date Submitted
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Booking ID
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Customer ID
              </TableHead>
              <TableHead className="w-[100px] text-center">
                Dispute Reason
              </TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : disputes.length > 0 ? (
              disputes.map((dispute) => (
                <TableRow key={dispute?._id}>
                  <TableCell className="text-center">
                    {new Date(dispute?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {dispute?.booking?._id}
                  </TableCell>
                  <TableCell className="text-center">
                    {dispute?.booking?.customer?._id}
                  </TableCell>
                  <TableCell className="text-center">
                    {dispute?.issueType}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 rounded-3xl font-semibold text-xs py-1 ${dispute?.status === "Pending"
                          ? "text-orange-600 bg-orange-200"
                          : dispute.status === "Resolved"
                            ? "text-green-600 bg-green-200"
                            : "text-blue-600 bg-blue-200"
                        }`}
                    >
                      {dispute?.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/disputes/${dispute?._id}`}>
                      <Button>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No disputes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationInfo && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages} •{" "}
            {paginationInfo.totalData} records
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paginationInfo.hasPrevPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginationInfo.hasNextPage}
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

export default DisputesTable;
