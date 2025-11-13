"use client";

import { SidebarContainer } from "@/containers/SidebarContainer";
import { ToastContainer } from "@/components/ui/ToastContainer";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarContainer />
      <main className="flex-1 overflow-hidden">{children}</main>
      <ToastContainer />
    </div>
  );
}
