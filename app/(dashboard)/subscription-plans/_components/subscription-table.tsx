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
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePaymentsFilter } from "./states/usePaymentsFilter";
import { toast } from "sonner";

interface Props {
  token: string;
  id: string;
}

type Subscription = {
  _id: string;
  name: string;
  commission: number;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
  durationDays: number;
};

type SubscriptionsResponse = {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
};

const SubscriptionTable = ({ token, id }: Props) => {
  const [page, setPage] = React.useState(1);

  const { search } = usePaymentsFilter();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data?.data;
    },
    enabled: !!token && !!id,
  });

  const { data, isLoading, isFetching } = useQuery<SubscriptionsResponse>({
    queryKey: ["subscriptions", page, search],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subscription/get-all?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return {
        data: json.data,
        total: json.data.length, // backend doesn’t return total/page/limit
        page,
        limit: 10,
      };
    },
  });

  const subscriptions = (data?.data ?? []).filter(
    (item) => item.price === 0
  );

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Commission</TableHead>
              <TableHead className="text-center">Billing Cycle</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
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
            ) : subscriptions.length > 0 ? (
              subscriptions.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center">{item._id}</TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{item.description}</TableCell>
                  <TableCell className="text-center">
                    {item.currency} {item.price}
                  </TableCell>
                  <TableCell className="text-center">{item.commission}%</TableCell>
                  <TableCell className="text-center">{item.billingCycle}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 rounded-3xl font-semibold text-xs py-1 ${item.isActive
                        ? "text-green-600 bg-green-200"
                        : "text-red-600 bg-red-200"
                        }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center flex justify-center gap-2">
                    <Link href={`/subscription-plans/${item._id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                    <SubscribeButton
                      planId={item._id}
                      token={token}
                      isActive={item.isActive}
                      isSubscribed={profile?.subscription?.planId?._id === item._id}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No subscriptions found
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

const SubscribeButton = ({
  planId,
  token,
  isActive,
  isSubscribed
}: {
  planId: string;
  token: string;
  isActive: boolean;
  isSubscribed: boolean;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-checkout-session", planId],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/subscription/create-checkout-session/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Checkout Session Error Response:", errorData);
        throw new Error(errorData.message || "Failed to create checkout session");
      }

      const responseData = await res.json();
      console.log("Checkout Session Success Response:", responseData);
      return responseData;
    },
    onSuccess: (data) => {
      console.log("Checkout Session Success Response:", data);

      if (data.type === "FREE") {
        toast.success(data.message || "Free subscription activated");
        // Reload to update the UI with new subscription status
        window.location.reload();
        return;
      }

      // Check for checkoutUrl in the data object for PAID plans
      const url = data.data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Checkout URL not found");
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubscribe = async () => {
    try {
      await mutateAsync(planId);
    } catch (error) {
      console.error("Subscription Action Error:", error);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-primary hover:bg-primary/90 text-white min-w-[100px]"
      disabled={!isActive || isPending || isSubscribed}
      onClick={handleSubscribe}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : isSubscribed ? (
        "Subscribed"
      ) : (
        "Subscribe"
      )}
    </Button>
  );
};

export default SubscriptionTable;
