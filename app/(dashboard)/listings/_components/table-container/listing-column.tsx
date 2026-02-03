"use client";

import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types/listings/index";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ListingViewAction from "./listing-view-action";
import StatusController from "./status-controller";

export const listingColumn: ColumnDef<Listing>[] = [
  {
    accessorKey: "dressId",
    header: "Dress ID",
  },
  {
    header: "Thumbnail",
    cell: ({ row }) => {
      const media = row.original.media;

      return (
        <div className="relative w-[56px] h-[66px]">
          <Image src={media[0]} alt={row.original.dressName} fill />
        </div>
      );
    },
  },
  {
    header: "Dress Name",
    accessorKey: "dressName",
  },
  {
    header: "Price (4 day)",
    cell: ({ row }) => {
      return <p>${row.original.rentalPrice.fourDays}</p>;
    },
  },
  {
    header: "Price (8 day)",
    cell: ({ row }) => {
      return <p>${row.original.rentalPrice.eightDays}</p>;
    },
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "pickupOption",
    header: "Pickup",
  },
  {
    header: "Approval",
    cell: ({ row }) => {
      const status = row.original.approvalStatus;

      const statusColor: Record<string, string> = {
        approved:
          "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200",
        rejected:
          "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200",
        pending:
          "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200",
      };

      return (
        <Badge
          className={
            statusColor[status] ||
            "bg-gray-100 text-gray-700 border border-gray-300"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    cell: ({ row }) => <StatusController data={row.original} />,
  },
  {
    header: "Action",
    cell: ({ row }) => <ListingViewAction data={row.original} />,
  },
];
