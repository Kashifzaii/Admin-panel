"use client";

import React from "react";
import { Menu } from "lucide-react";

// Header component with better structure and clear type annotations
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center gap-3 bg-white border-b px-4 py-4 w-full">
      {/* Button to toggle sidebar, visible only on small screens */}
      <button 
        className="block md:hidden" 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu />
      </button>

      {/* Dashboard Title (Optional, can be dynamic) */}
      <h1 className="text-xl font-semibold ml-4">Dashboard</h1>
    </header>
  );
}

export default Header;

