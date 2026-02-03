import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ListingSearchHeader from "./_components/searchbar/listing-search-header";
import ListingStats from "./_components/stats/listing-stats";
import ListingTableContainer from "./_components/table-container/listing-table-container";

export default async function ListingsPage() {
  const cu = await auth();

  if (!cu || !cu?.user.accessToken) redirect("/login");
  return (
    <>
      <div className="p-8 bg-[#fefaf6]">
        <div className="flex justify-end items-center mb-8">
          <div className="flex space-x-4">
            {/* <div className="relative">
              <button className="px-4 py-2 bg-[#891d33] text-white rounded-md flex items-center">
                This Month
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div> */}
            <Button asChild effect="shineHover">
              <Link href="/listings/new">
                <span className="mr-2">Add New Listing</span>{" "}
                <Plus className="mr-2 h-4 w-4 text-white" />
              </Link>
            </Button>
          </div>
        </div>

        <ListingStats token={cu.user.accessToken} />

        <ListingSearchHeader />

        <ListingTableContainer token={cu.user.accessToken} />
      </div>
    </>
  );
}
