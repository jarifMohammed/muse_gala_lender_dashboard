import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
  _id: string;
  name?: string;
  email?: string;
}

interface MasterDress {
  _id: string;
  thumbnail?: string;
  name?: string;
}

interface UpcomingOrder {
  _id: string;
  masterdressId: MasterDress;
  rentalStartDate: string;
  rentalEndDate: string;
  customer: Customer;
}

interface UpcomingOrderProps {
  upcomingOrders: UpcomingOrder[];
  isLoading: boolean;
}

const UpcomingOrder = ({ upcomingOrders, isLoading }: UpcomingOrderProps) => {
  const OrderSkeleton = () => (
    <div className="flex bg-[#FEFAF6] rounded-[8px] overflow-hidden">
      <Skeleton className="w-24 h-28 rounded-l-[8px]" />

      <div className="flex-1 pt-2 px-4 space-y-3 h-28">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Upcoming Orders</h3>
        <Link
          href="/bookings"
          className="text-xs text-gray-500 hover:underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <OrderSkeleton key={index} />
          ))
        ) : upcomingOrders?.length > 0 ? (
          upcomingOrders.map((order, index) => (
            <div
              key={order._id || index}
              className="flex bg-[#FEFAF6] rounded-[8px] overflow-hidden"
            >
              <div className="w-24 h-28 relative">
                <Image
                  src={order?.masterdressId?.thumbnail || "/placeholder.svg"}
                  alt={`Dress for booking ${order._id}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 pt-2 px-4 space-y-1 h-28 min-w-0 overflow-hidden">
                <p className="text-sm font-medium truncate break-all">BOOKING ID: {order?._id}</p>
                <p className="text-sm text-gray-500 truncate break-all">
                  Dress Id: {order?.masterdressId?._id}
                </p>
                <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-1">
                  <span className="whitespace-nowrap">Rental Period : </span>
                  <span className="whitespace-nowrap">
                    {new Date(order?.rentalStartDate).toLocaleDateString()}
                  </span>
                  <span>-</span>
                  <span className="whitespace-nowrap">
                    {new Date(order?.rentalEndDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate break-all">
                  Customer ID: {order?.customer?._id}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingOrder;
