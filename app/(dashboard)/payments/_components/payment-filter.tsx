"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import React from "react";
import { usePaymentsFilter } from "./states/usePaymentsFilter";

const PaymentFilter = () => {
  const { setSearch, setDate } = usePaymentsFilter();

  return (
    <div>
      <div className="flex items-center gap-6 bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-8 w-full">
        <div className="relative flex-1">
          <Input
            className="pl-9 w-full"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="h-4 w-4 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
        </div>



        <div className="w-[200px]">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Pending</SelectItem>
              <SelectItem value="dark">Disputed</SelectItem>
              <SelectItem value="system">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <input
            type="date"
            className="w-[180px] focus-visible:ring-0 border border-input h-10 rounded-md text-sm shadow-sm px-3 py-1 cursor-pointer hover:border-gray-300 transition-colors"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentFilter;
