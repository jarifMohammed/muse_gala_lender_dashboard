"use client"

import React, { useEffect, useState } from "react"
import { AustraliaLocationSelector, PreciseLocationData } from "@/components/shared/australia-location-selector"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function LocationSettings({
    token,
    userID,
    userInfo
}: {
    token: string
    userID: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userInfo: any
}) {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    const [location, setLocation] = useState<PreciseLocationData>({
        address: userInfo?.location?.address || userInfo?.address || "",
        placeName: userInfo?.location?.placeName || userInfo?.placeName || userInfo?.address || "",
        city: userInfo?.location?.city || userInfo?.city || "",
        state: userInfo?.location?.state || userInfo?.state || "",
        suburb: userInfo?.location?.suburb || userInfo?.suburb || "",
        postcode: userInfo?.location?.postcode || userInfo?.postcode || "",
        country: userInfo?.location?.country || userInfo?.country || "Australia",
        latitude: userInfo?.location?.latitude || userInfo?.latitude || 0,
        longitude: userInfo?.location?.longitude || userInfo?.longitude || 0,
        precision: userInfo?.location?.precision || userInfo?.precision || "approximate",
    })

    useEffect(() => {
        // Handle both nested location and top-level fields from API
        const source = userInfo?.location || userInfo;
        if (source?.address) {
            setLocation({
                address: source.address || "",
                placeName: source.placeName || source.address || "",
                city: source.city || "",
                state: source.state || "",
                suburb: source.suburb || "",
                postcode: source.postcode || "",
                country: source.country || "Australia",
                latitude: source.latitude || 0,
                longitude: source.longitude || 0,
                precision: source.precision || "approximate",
            })
        }
    }, [userInfo])

    const { mutate, isPending } = useMutation({
        mutationKey: ["update-location", userID],
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/${userID}/location`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(location),
                }
            )

            if (!res.ok) {
                throw new Error("Failed to update business location")
            }

            return res.json()
        },
        onSuccess: (data) => {
            toast.success(data.message || "Location updated successfully!")
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.message || "An error occurred while saving the location.")
        },
    })

    const handleSubmit = () => {
        if (!location.address) {
            toast.error("Please search and select a valid location first.")
            return
        }
        mutate()
    }

    // Check if location has actually changed from what's in userInfo
    const source = userInfo?.location || userInfo;
    const isChanged =
        location.address !== (source?.address || "") ||
        location.latitude !== (source?.latitude || 0) ||
        location.longitude !== (source?.longitude || 0);

    return (
        <div className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-6 w-6 text-[#891D33]" />
                <h1 className="text-xl font-medium">Business Location</h1>
            </div>

            <div className="space-y-6">
                {/* Search Input using Mapbox */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Address
                    </label>
                    <AustraliaLocationSelector
                        accessToken={mapboxToken}
                        onLocationSelect={(data) => setLocation(data)}
                        defaultValue={location.address}
                        placeholder="Start typing your business address..."
                    />
                </div>

                {/* Read-only Information Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f7f2ee]/50 p-5 rounded-[8px] border border-[#999999]/20">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Selected Address
                        </label>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.placeName || "Not selected"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            City / Suburb
                        </label>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.city || location.suburb || "Not selected"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            State
                        </label>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.state || "Not selected"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Postcode & Country
                        </label>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.postcode ? `${location.postcode}, ` : ""}{location.country || "Not selected"}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !location.address || !isChanged}
                        className="disabled:cursor-not-allowed bg-[#891D33] hover:bg-[#a0243d] text-white shadow-md transition-all duration-300"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <LoaderCircle className="animate-spin h-5 w-5" />
                                Saving Changes...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
