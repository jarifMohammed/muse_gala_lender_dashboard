import React from "react";

const PaymentsCard = () => {
  return (
    <div className="grid grid-cols-3 gap-10">
      <div className="bg-white p-6 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
        <h1 className="text-sm mb-5">Total Revenue</h1>
        <h1 className="font-medium text-2xl">$#,###</h1>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
        <h1 className="text-sm mb-5">Subscription</h1>
        <h1 className="font-medium text-2xl">Subscription Plan</h1>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
        <h1 className="text-sm mb-5">Stripe Onboard</h1>
        <h1>
          <span className="font-medium text-2xl">$### </span>on May 28, 2025
        </h1>
      </div>
    </div>
  );
};

export default PaymentsCard;
