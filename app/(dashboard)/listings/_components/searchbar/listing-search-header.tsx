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
import { Filter } from "lucide-react";
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
      <div className="flex flex-wrap gap-4 justify-between">
        {/* Search Input */}
        <div className="w-[500px] relative">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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

        {/* Status Filter */}
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
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

        {/* Size Filter */}
        <div className="w-[200px]">
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select Size" />
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

        {/* Condition Filter */}
        <div className="w-[200px]">
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select Condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionOptions.map((option) => (
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
            <SelectTrigger>
              <SelectValue placeholder="Pickup Option" />
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
            variant="outline"
            onClick={() => {
              resetFilters();
              router.refresh();
            }}
            className="p-2.5 border rounded-full hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 text-red-800" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingSearchHeader;
