"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import SideBar from "@/app/components/Sidebar/page";
import Header from "../Header";

const ConditionalSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Close sidebar on outside click
  const handleClickOutsideEvent = useCallback((event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideEvent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEvent);
    };
  }, [handleClickOutsideEvent]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Avoid rendering sidebar on specific routes
  if (pathname === "/Login" || pathname === "/") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* Sidebar for smaller screens */}
      <div
        ref={sidebarRef}
        className={`fixed block md:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-[260px]"
        }`}
        aria-hidden={!isOpen}
      >
        <SideBar />
      </div>

      {/* Header and content */}
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>
    </div>
  );
};

export default ConditionalSideBar;
