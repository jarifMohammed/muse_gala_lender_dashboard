"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import DisputeCard from "./dispute-card";
import { useDisputesFilter } from "./states/useDisputesFilter";
import { SubmitDisputeModal } from "./submit-dispute-modal";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const DisputeHeader = ({ token }: { token: string }) => {
  const { setSearch, status, setStatus } = useDisputesFilter();
  const [open, setOpen] = useState(false);

  const statusOptions = [
    "All",
    "Pending",
    "In Progress",
    "In Review",
    "Escalated",
    "Resolved",
    "Closed",
  ];

  const { data, isLoading } = useQuery<any>({
    queryKey: ["states-disputes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/my-disputes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data?.stats;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
          Disputes
        </h1>

        <div className="flex items-center gap-5">
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <span>Submit New Dispute</span>
            <Plus />
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-5 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg cursor-pointer"
            >
              <Skeleton className="h-5 w-1/2" />
              <div className="mt-8">
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))
        ) : (
          <>
            <DisputeCard title="Total Disputes" value={data?.totalDisputes} />
            <DisputeCard
              title="Pending Disputes"
              value={data?.pendingDisputes}
            />
            <DisputeCard
              title="Resolved Disputes"
              value={data?.resolvedDisputes}
            />
          </>
        )}
      </div>

      <div className="flex items-center gap-10 bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-8">
        <div className="relative flex-1">
          <Input
            className="pl-7 w-full"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="h-4 w-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-2" />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[220px]">
            <SelectValue>
              {status === "All" ? "Status" : status}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {open && (
        <SubmitDisputeModal open={open} onOpenChange={() => setOpen(false)} />
      )}
    </div>
  );
};

export default DisputeHeader;
