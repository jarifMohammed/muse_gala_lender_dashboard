"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart3,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Users,
  Video,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const routes = [
  {
    id: 1,
    label: "Overview",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    id: 2,
    label: "Bookings",
    icon: Users,
    href: "/bookings",
  },
  {
    id: 3,
    label: "Listings",
    icon: FileText,
    href: "/listings",
  },
  {
    id: 4,
    label: "Payments",
    icon: ShoppingBag,
    href: "/payments",
  },
  {
    id: 5,
    label: "Subscription Plans",
    icon: ShoppingBag,
    href: "/subscription-plans",
  },
  {
    id: 6,
    label: "Disputes",
    icon: Video,
    href: "/disputes",
  },
  {
    id: 7,
    label: "Chats",
    icon: DollarSign,
    href: "/chats",
  },
  {
    id: 8,
    label: "Help Center",
    icon: BarChart3,
    href: "/help-center",
  },
  {
    id: 9,
    label: "Account Settings",
    icon: Settings,
    href: "/account-settings",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-primary">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-none p-6 flex justify-center items-center">
          <div className="relative h-[80px] w-[80px]">
            <Image src="/Logo.svg" alt="logo" fill />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-auto p-3">
          <ul className="space-y-2">
            {routes.map((route) => {
              const isActive =
                route.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(route.href);

              return (
                <li key={route.id}>
                  <Link
                    href={route.href}
                    className={`flex text-white/80 items-center gap-3 rounded-md px-3 py-2
          ${
            isActive
              ? "bg-white/20 text-primary-foreground"
              : " hover:bg-white/30 hover:text-white/70"
          }
        `}
                  >
                    {/* <Icon className="h-5 w-5" /> */}
                    <span>{route.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className=" p-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full justify-start gap-3">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to sign out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out of your account and redirected to the
                  homepage. You can sign back in at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await signOut({ redirectTo: "/", redirect: true });
                  }}
                >
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
