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
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useListingFilterStrate } from "./listing-searchbar-state";

const ListingSearchHeader: FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    conditionFilter,
    pickupFilter,
    setConditionFilter,
    setPickupOption,
    setSizeFilter,
    sizeFilter,
    resetFilters,
  } = useListingFilterStrate();

  const statusOptions = ["All", "available", "booked", "not-available"];
  const sizeOptions = [
    "All",
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "4XL",
    "5XL",
    "Custom",
  ];
  const conditionOptions = [
    "All",
    "Brand New",
    "Like New",
    "Gently Used",
    "Used",
    "Worn",
    "Damaged",
    "Altered",
    "Vintage",
  ];
  const deliveryOptions = ["All", "Local-Pickup", "Australia-wide", "Both"];

  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg mb-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[300px] relative">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Size Filter */}
        <div className="w-[180px]">
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="h-10">
              <SelectValue>
                {sizeFilter === "All" ? "Sizes" : sizeFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Filter */}
        <div className="w-[200px]">
          <Select value={pickupFilter} onValueChange={setPickupOption}>
            <SelectTrigger className="h-10">
              <SelectValue>
                {pickupFilter === "All" ? "Delivery Method" : pickupFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => {
              resetFilters();
              router.refresh();
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-[#891d33] hover:bg-red-50 transition-all duration-300 px-4 h-10 rounded-lg group"
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-[-180deg] duration-500" />
            <span className="text-sm font-medium">Reset Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingSearchHeader;
