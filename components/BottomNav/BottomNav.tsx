'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dog, ClipboardList, User } from 'lucide-react';

type NavKey = 'home' | 'pet' | 'sitters' | 'profile';

interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  icon: typeof Home;
}

interface BottomNavProps {
  petId?: string;
}

export function BottomNav({ petId }: BottomNavProps) {
  const pathname = usePathname();

  const petHref = petId ? `/dog/${petId}` : '/dog';
  const profileHref = petId ? `/dog/${petId}/profile` : '/dog/profile';

  const NAV_ITEMS: NavItem[] = [
    { key: 'home', href: '/', label: 'Home', icon: Home },
    { key: 'pet', href: petHref, label: 'Pet', icon: Dog },
    {
      key: 'sitters',
      href: '/dashboard',
      label: 'Sitters',
      icon: ClipboardList,
    },
    { key: 'profile', href: profileHref, label: 'Profile', icon: User },
  ];

  function isActive(item: NavItem): boolean {
    switch (item.key) {
      case 'home':
        return pathname === '/';
      case 'pet':
        return pathname.startsWith('/dog/') && !pathname.endsWith('/profile');
      case 'sitters':
        return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
      case 'profile':
        return pathname.startsWith('/dog/') && pathname.endsWith('/profile');
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-warm-white/80 backdrop-blur-md border-t border-black/5 z-30">
      <div className="flex justify-around items-center max-w-md mx-auto py-2 px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                active
                  ? 'text-chewy-blue'
                  : 'text-text-muted hover:text-text-mid'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span
                className={`font-nunito text-[10px] ${
                  active ? 'font-bold' : 'font-semibold'
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
