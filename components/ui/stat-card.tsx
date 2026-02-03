import { cn } from "@/lib/utils";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface StatCardProps {
  title: string;
  value: string;
  className?: string;
}

// Memoize the StatCard component to prevent re-renders if props don't change
export const StatCard = memo(function StatCard({
  title,
  value,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-[18px] font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
});
