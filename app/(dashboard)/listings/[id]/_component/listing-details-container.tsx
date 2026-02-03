"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Listing } from "@/types/listings/index";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AvailabilityCalendar from "./availability-calendar";
const AlertModal = dynamic(() => import("@/components/ui/custom/alert-modal"), {
  ssr: false,
});

interface Props {
  listingId: string;
  token: string;
}

interface ApiProps {
  status: true;
  message: string;
  data: Listing;
}

const ListingDetailsContainer = ({ listingId, token }: Props) => {
  const [isRouteChanging, setIsRouteChangin] = useState(false);
  const [editAlertDialog, setEditAlertDialog] = useState(false);

  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ApiProps>({
      queryKey: ["listing", listingId],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${listingId}`,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json()),
    });

  useEffect(() => {
    return () => {
      setIsRouteChangin(false);
    };
  }, []);

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Something went wrong!
          </h2>
          <p className="text-red-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isApproved = data?.data.approvalStatus === "approved";
  const isRejected = data?.data.approvalStatus === "rejected";

  return (
    <div className="p-8 bg-[#fefaf6] space-y-8">
      <h2 className="text-[20px] font-normal uppercase  ">LISTINGS DETAILS</h2>

      {data?.data.approvalStatus === "rejected" && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-red-500 font-medium">
            {data?.data.reasonsForRejection}
          </AlertDescription>
        </Alert>
      )}

      <SkeletonWrapper isLoading={isLoading || isRefetching}>
        <Card className="grid grid-cols-1 lg:grid-cols-12 ">
          <div className="lg:col-span-2">
            <div className="relative w-full h-[400px] ">
              <Image
                src={
                  data?.data.media[0] ??
                  "https://files.edgestore.dev/vkpagg64z2y0yvdx/publicFiles/_public/4420c9d1-dd2e-4afa-9b54-8a85d396ecbc.jpeg"
                }
                alt={data?.data.dressName ?? ""}
                fill
                className="object-cover rounded-l-[15px]"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </div>

          <div className="lg:col-span-10 bg-white p-6 rounded-r-[15px] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {data?.data.brand} - {data?.data.dressName}
                </h3>
                <p className="text-sm text-gray-500">
                  Product ID: {data?.data.dressId}
                </p>
              </div>
              <div className="flex space-x-3">
                {/* <Link href={`/listings/${data?.data._id}/edit`}> */}
                {!isApproved && !isRejected ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button disabled={!isApproved || !isRejected}>
                        Edit Details
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px]">
                        Your listing is under review and cannot be updated until
                        approval / Rejection
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    effect="ringHover"
                    onClick={() => setEditAlertDialog((p) => !p)}
                  >
                    Edit Details
                  </Button>
                )}

                {/* </Link> */}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-base mb-3">
                <span className="font-medium">Size: </span>
                {data?.data.size}
              </p>
              <div className="text-base mb-3 flex items-center">
                <span className="font-medium">Color: </span>
                <div
                  style={{ backgroundColor: data?.data.colour }}
                  className="h-5 w-5 rounded-full ml-3"
                />
              </div>
              <p className="text-base mb-3">
                <span className="font-medium">Condition:</span>{" "}
                {data?.data.condition}
              </p>
              <p className="text-base mb-3">
                <span className="font-medium mr-2">Rental Price:</span>$
                {data?.data.rentalPrice.fourDays}/ 4 days
              </p>
              <p className="text-base mb-3">
                <span className="font-medium">Last Updated:</span>{" "}
                {moment(data?.data.updatedAt).format(
                  "DD MMM, YYYY [at] hh:mm A"
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`inline-flex items-center gap-1 px-4 py-1 rounded-2xl text-sm font-medium ${
                    isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isApproved ? "Active" : "Inactive"}
                  {isApproved ? (
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading || isRefetching}>
        <Card className="bg-white p-6 rounded-[15px] ">
          <h3 className="text-2xl font-normal mb-4">Description & Details</h3>

          <div className="space-y-4">
            <p className="text-base font-normal">
              <span className="font-normal">Description:</span>{" "}
              {data?.data.description}
            </p>
            <p className="text-base">
              <span className="font-normal">Materials:</span>{" "}
              {data?.data.material}
            </p>
            <p className="text-base">
              <span className="font-normal">Care Instructions:</span>{" "}
              {data?.data.careInstructions}
            </p>
          </div>
        </Card>
      </SkeletonWrapper>

      <div className="grid grid-cols-2 gap-5">
        <SkeletonWrapper isLoading={isLoading}>
          <Card className=" w-full">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Availability Calendar
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar
                year={2025}
                month={7} // August (0-based index)
                greenDates={[2, 12, 24, 16]}
                redDates={[4, 10]}
                yellowDates={[14, 15]}
              />
            </CardContent>
          </Card>
        </SkeletonWrapper>
      </div>

      <AlertModal
        loading={isRouteChanging}
        onConfirm={() => {
          setIsRouteChangin(true);
          router.push(`/listings/${data?.data._id}/edit`);
        }}
        onClose={() => setEditAlertDialog(false)}
        title="Edit Listing Confirmation"
        message="Editing this listing will require admin re-approval. Your changes may temporarily affect its visibility and impact your business performance. Do you want to continue?"
        isOpen={editAlertDialog}
      />
    </div>
  );
};

export default ListingDetailsContainer;
