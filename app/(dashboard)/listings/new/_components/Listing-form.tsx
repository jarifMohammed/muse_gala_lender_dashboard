"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Listing,
  ListingFormValues,
  listingSchema,
} from "@/types/listings/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BasicDetailsForm from "./basic-details";
import DescriptionAndDetailsForm from "./description-and-details-form";
import MediaForm from "./media-form";
import PricingAndFeesForm from "./pricing-and-fees-form";

interface Props {
  token: string;
  initialId?: string;
}

interface ApiProps {
  status: boolean;
  message: string;
  data: Listing;
}

async function getListing(initialId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${initialId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // avoid caching if data is dynamic
    }
  );

  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export default function ListingForm({ token, initialId }: Props) {
  const router = useRouter();

  const { data, isLoading } = useQuery<ApiProps>({
    queryKey: ["listing", initialId],
    queryFn: () => getListing(initialId!, token),
    enabled: !!initialId,
  });

  const { mutate: createListing, isPending } = useMutation({
    mutationKey: ["listing-create"],
    mutationFn: (reqBody: ListingFormValues) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      }).then((res) => res.json()),
    onSuccess: (data: ApiProps) => {
      if (!data.status) {
        toast.error(data.message);
        return;
      }

      // ✅ Success toast with dressName
      const dressName = data?.data?.dressName || "your dress";
      toast.success("Successfully listed", {
        description: `Your dress "${dressName}" has been added to your listings.`,
      });
      form.reset(
        {
          dressName: "",
          brand: "",
          size: "S", // default size
          colour: "",
          condition: "Like New", // default condition
          category: "Formal", // default category
          description: "",
          material: "",
          careInstructions: undefined, // optional
          rentalPrice: {
            fourDays: 0,
            eightDays: 0,
          },
          media: [],
          pickupOption: "Local", // default pickup option
        },
        { keepValues: false } // ensures all values are replaced with these defaults
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: editListing, isPending: isUpdating } = useMutation({
    mutationKey: ["listing-create"],
    mutationFn: (
      reqBody: ListingFormValues & {
        approvalStatus: "pending" | "approved" | "rejected";
        isActive: boolean;
      }
    ) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${initialId}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reqBody),
        }
      ).then((res) => res.json()),
    onSuccess: (data: ApiProps) => {
      if (!data.status) {
        toast.error(data.message);
        return;
      }

      // ✅ Success toast for update
      const dressName = data?.data?.dressName || "your dress";
      toast.success("Listing updated", {
        description: `Your dress "${dressName}" has been updated successfully.`,
      });
      form.reset(
        {
          dressName: "",
          brand: "",
          size: "S", // default size
          colour: "",
          condition: "Like New", // default condition
          category: "Formal", // default category
          description: "",
          material: "",
          careInstructions: undefined, // optional
          rentalPrice: {
            fourDays: 0,
            eightDays: 0,
          },
          media: [],
          pickupOption: "Local", // default pickup option
        },
        { keepValues: false } // ensures all values are replaced with these defaults
      );
      router.back();
    },

    onError: (error) => {
      toast.error(
        error.message || "An error occurred while updating the listing."
      );
    },
  });

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      dressName: data?.data.dressName ?? "",
      brand: data?.data.brand ?? "",
      size: data?.data.size ?? undefined, // you can pick a reasonable default size
      colour: data?.data.colour ?? undefined,
      condition: data?.data.condition ?? undefined, // default condition
      category: data?.data.category ?? undefined, // default category
      description: data?.data.description ?? "",
      material: data?.data.material ?? undefined,
      careInstructions: data?.data.careInstructions ?? undefined, // optional
      rentalPrice: {
        fourDays: data?.data.rentalPrice.fourDays ?? 0,
        eightDays: data?.data.rentalPrice.eightDays ?? 0,
      },
      media: data?.data.media ?? [],
      pickupOption: data?.data.pickupOption ?? undefined, // default pickup option
    },
  });

  function onSubmit(values: ListingFormValues) {
    if (initialId) {
      editListing({
        ...values,
        approvalStatus: "pending",
        isActive: false,
      });
    } else {
      createListing(values);
    }
  }

  const loading = isPending || isLoading || isUpdating;

  return (
    <Card className="p-5  border-0 space-y-5">
      <CardHeader className="p-0">
        <Button
          className="w-fit"
          effect="expandIcon"
          icon={MoveLeft}
          iconPlacement="left"
          variant="link"
          onClick={() => router.back()}
        >
          Back Now
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className=" space-y-6"
          >
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Basic Details</CardTitle>
              </CardHeader>
              <CardContent>
                <BasicDetailsForm form={form} />
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaForm form={form} />
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Price & Fees</CardTitle>
                <CardDescription>
                  Note: This listing price is inclusive of dry-cleaning fees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PricingAndFeesForm form={form} />
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Description & Details</CardTitle>
              </CardHeader>
              <CardContent>
                <DescriptionAndDetailsForm form={form} />
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" effect="shineHover" disabled={loading}>
                {initialId ? "Save Listing" : "Create Listing"}
                {loading && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
