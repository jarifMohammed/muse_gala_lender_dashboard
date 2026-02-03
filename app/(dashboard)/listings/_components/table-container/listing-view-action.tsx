import { Button } from "@/components/ui/button";
import { Listing } from "@/types/listings/index";
import Link from "next/link";

interface Props {
  data: Listing;
}
const ListingViewAction = ({ data }: Props) => {
  return (
    <div>
      <Button size="sm" effect="shine" asChild>
        <Link href={`/listings/${data._id}`} prefetch={false}>
          View
        </Link>
      </Button>
    </div>
  );
};

export default ListingViewAction;
