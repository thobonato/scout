"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dog, ClipboardList, User } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  matchPaths: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    matchPaths: ["/"],
  },
  {
    href: "/dog/temp",
    label: "Pet",
    icon: Dog,
    matchPaths: ["/dog/"],
  },
  {
    href: "/dashboard",
    label: "Sitters",
    icon: ClipboardList,
    matchPaths: ["/dashboard"],
  },
  {
    href: "/dog/temp/profile",
    label: "Profile",
    icon: User,
    matchPaths: ["/profile"],
  },
];

export function BottomNav() {
  const pathname = usePathname();

  function isActive(item: NavItem): boolean {
    if (item.href === "/" && pathname === "/") {
      return true;
    }

    if (item.href === "/") {
      return false;
    }

    return item.matchPaths.some((path) => pathname.startsWith(path));
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-warm-white/80 backdrop-blur-md border-t border-black/5 z-30">
      <div className="flex justify-around items-center max-w-md mx-auto py-2 px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                active
                  ? "text-chewy-blue"
                  : "text-text-muted hover:text-text-mid"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span
                className={`font-nunito text-[10px] ${
                  active ? "font-bold" : "font-semibold"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
