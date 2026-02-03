import { auth } from "@/auth";
import Overview from "./_components/overview";

export default async function OverviewPage() {
  const cu = await auth();
  const token = cu?.user?.accessToken;

  return (
    <div className="p-8">
      <Overview token={token as string} />
    </div>
  );
}
