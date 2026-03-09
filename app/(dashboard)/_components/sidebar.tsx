"use client";

import SidebarContent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-[#54051d] hidden lg:block">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
