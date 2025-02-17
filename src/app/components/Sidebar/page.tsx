"use client";

import {
  Layers2,
  LayoutDashboard,
  LogOut,
  PackageOpen,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MenuItem {
  name: string;
  link: string;
  icon: React.ReactNode;
  isLogout?: boolean;
}

export default function Sidebar() {
  const router = useRouter();

  const menuList: MenuItem[] = [
    { name: "Dashboard", link: "/Admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Products", link: "/Admin/Products", icon: <PackageOpen className="h-5 w-5" /> },
    { name: "Categories", link: "/Admin/Categories", icon: <Layers2 className="h-5 w-5" /> },
    { name: "Orders", link: "/Admin/Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Customers", link: "/Admin/Customers", icon: <User className="h-5 w-5" /> },
    { name: "Logout", link: "", icon: <LogOut className="h-5 w-5" />, isLogout: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    router.replace("/Login");
    window.location.reload();
  };

  return (
    <section className="sticky top-0 flex flex-col gap-10 bg-white border-r px-5 py-3 h-screen overflow-hidden w-[260px] z-50">
      <div className="flex justify-center py-4">
        <Link href={`/`}>
          <h1 className="font-bold text-5xl text-red-500">Avion</h1>
        </Link>
      </div>
      <ul className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
        {menuList?.map((item, key) => {
          if (item.isLogout) {
            return (
              <div className="flex justify-center" key={key}>
                <button
                  onClick={handleLogout}
                  className="flex gap-2 items-center px-8 py-11 w-full justify-center ease-soft-spring duration-400 transition-all text-[#2A254B]"
                >
                  {item.icon} {item.name}
                </button>
              </div>
            );
          }
          return <Tab item={item} key={key} />;
        })}
      </ul>
    </section>
  );
}

function Tab({ item }: { item: MenuItem }) {
  const pathname = usePathname();
  const isSelected = pathname === item?.link;
  return (
    <Link href={item?.link}>
      <li
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ease-soft-spring transition-all duration-300
        ${isSelected ? "bg-[#2A254B] text-white" : "bg-white text-[#2A254B]"} 
        `}
      >
        {item?.icon} {item?.name}
      </li>
    </Link>
  );
}

