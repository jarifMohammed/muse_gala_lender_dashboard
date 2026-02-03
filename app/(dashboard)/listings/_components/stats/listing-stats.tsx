"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { useQuery } from "@tanstack/react-query";

interface Props {
  token: string;
}

interface ApiProps {
  status: boolean;
  message: string;
  data: {
    totalListings: number;
    activeListings: number;
    popularListings: [];
  };
}

const ListingStats = ({ token }: Props) => {
  const { isLoading, data, isError, error } = useQuery<ApiProps>({
    queryKey: ["listing-stats"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
  });

  if (isError) {
    return (
      <div className="p-6 bg-red-100 text-red-600 rounded-lg">
        <p>Error loading listing stats.</p>
        <p className="text-sm opacity-75">{(error as Error)?.message}</p>
      </div>
    );
  }
  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <SkeletonWrapper isLoading={isLoading}>
        <Card className="bg-[#891d33] ">
          <CardHeader>
            <CardTitle className="text-white/80 text-sm">
              Most Popular Listing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[20px] text-white   font-medium text-left">
              {"No listings"}
            </p>
          </CardContent>
        </Card>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading}>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-600 text-sm">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[25px] text-black  font-medium text-left">
              {stats?.totalListings ?? 0}
            </p>
          </CardContent>
        </Card>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-600 text-sm">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[25px] text-black  font-medium text-left">
              {stats?.activeListings ?? 0}
            </p>
          </CardContent>
        </Card>
      </SkeletonWrapper>
    </div>
  );
};

export default ListingStats;
