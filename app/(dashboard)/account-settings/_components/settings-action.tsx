import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const SettingsAction = () => {
  return (
    <div>
      <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Actions</h1>

        <div className="flex items-center gap-5">
          <Link href={`/account-settings/deactivate-account`}>
            <Button>Deactivate Account</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SettingsAction;
