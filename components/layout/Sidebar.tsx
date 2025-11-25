'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Settings,
  DollarSign,
  FolderKanban,
  FileCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Financial', href: '/dashboard/financial', icon: DollarSign },
  { name: 'Impact', href: '/dashboard/impact', icon: Briefcase },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Beneficiaries', href: '/beneficiaries', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Posts', href: '/posts', icon: MessageSquare },
  { name: 'Field Reports', href: '/field-reports', icon: FileText },
  { name: 'Compliance', href: '/compliance', icon: FileCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 gap-2">
          <Image 
            src="https://keaprojects.com.au/wp-content/uploads/2025/06/KEaP-Logo-v5-1024x846.webp"
            alt="Kanyini Earth Project"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-lg font-semibold text-kanyini-primary">Kanyini OS</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition',
                  isActive
                    ? 'bg-kanyini-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-kanyini-primary'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

