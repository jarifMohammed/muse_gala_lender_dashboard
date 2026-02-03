"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DisputeForm() {
  const { id } = useParams();

  return (
    <div>
      <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Actions</h1>

        <div className="flex items-center gap-5">
          <Link href={`/disputes/${id}/escalate-dispute`}>
            <Button>Escalate Dispute</Button>
          </Link>
          <Button variant="outline">Download Report</Button>
          <Button variant="outline">Close</Button>
        </div>
      </Card>
    </div>
  );
}
