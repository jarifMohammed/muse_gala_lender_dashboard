"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Download } from "lucide-react";
import PaymentsCard from "./payments-card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { StripSetupModal } from "./stripe-setup-modal";

const PaymentHeader = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
          Payments
        </h1>

        <div className="space-x-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Setup stripe</Button>
            </DialogTrigger>

            <StripSetupModal />
          </Dialog>

          <Button>
            Download Report <Download />
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <PaymentsCard />
      </div>
    </div>
  );
};

export default PaymentHeader;
