"use client";

import React from "react";
import PayoutButton from "../../_components/payout-button";

interface BookingActionsProps {
    bookingDetails: any;
    token: string;
    userID: string;
    isLoading: boolean;
}

const BookingActions = ({ bookingDetails, token, userID, isLoading }: BookingActionsProps) => {
    if (isLoading || !bookingDetails) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
                <PayoutButton
                    paymentStatus={bookingDetails.paymentStatus}
                    payoutStatus={bookingDetails.payoutStatus}
                    id={bookingDetails._id || bookingDetails.id}
                    token={token}
                    userID={userID}
                />
            </div>
        </div>
    );
};

export default BookingActions;
