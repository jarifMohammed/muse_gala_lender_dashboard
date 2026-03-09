"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "./sidebar-content";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  name: string;
}

const Topbar = ({ name }: Props) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6 w-full max-w-full">
      <div className="grid grid-cols-3 items-center w-full max-w-full overflow-hidden">
        {/* Left: Hamburger (Mobile) / User Name (Desktop) */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] max-w-[80vw]">
              <SidebarContent onClose={() => { }} />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold truncate max-w-[200px]">{name}</h1>
            <p className="text-sm text-muted-foreground">Lender Dashboard</p>
          </div>
        </div>

        {/* Middle: Logo & Text (Mobile Only) */}
        <div className="lg:hidden flex items-center justify-center gap-2">
          <div className="relative h-7 w-9 flex-shrink-0">
            <Image src="/images/auth-logo.png" alt="logo" fill className="object-contain" />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap uppercase tracking-wider hidden sm:block">Dashboard</span>
        </div>

        {/* Right: Profile Initials */}
        <div className="flex items-center justify-end gap-4">
          <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-gray-200">
            <AvatarFallback className="bg-[#54051d] text-white text-xs md:text-sm font-medium">
              {firstLetter}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
