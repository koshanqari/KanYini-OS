'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  FolderKanban,
  Calendar,
  MessageSquare,
  FolderOpen,
  Share2,
  ChevronDown,
  ChevronRight,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Beneficiaries', href: '/beneficiaries', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Governance', href: '/governance', icon: Database, badge: 'soon' },
  { name: 'Community Welfare', href: '/community-welfare', icon: Users, badge: 'soon' },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'KCC Users', href: '/kc-users', icon: Users },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
];

const damItems = [
  { name: 'Content', href: '/dam/content', icon: FileText },
  { name: 'Vaults', href: '/dam/vaults', icon: FolderOpen },
  { name: 'Publishing', href: '/dam/publishing', icon: Share2 },
  { name: 'CMS', href: '/dam/cms', icon: FileText, badge: 'soon' },
  { name: 'Community Posts', href: '/posts', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isDamOpen, setIsDamOpen] = useState(
    pathname.startsWith('/dam') || pathname.startsWith('/posts')
  );

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
            
            // If item has a badge, render as non-clickable
            if (item.badge) {
              return (
                <div
                  key={item.name}
                  className="group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed opacity-60"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                    {item.badge}
                  </span>
                </div>
              );
            }
            
            // Regular clickable item
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
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}

          {/* DAM Dropdown */}
          <div>
            <button
              onClick={() => setIsDamOpen(!isDamOpen)}
              className={cn(
                'w-full group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition',
                pathname.startsWith('/dam') || pathname.startsWith('/posts')
                  ? 'bg-kanyini-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-kanyini-primary'
              )}
            >
              <Database className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">DAM</span>
              {isDamOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* DAM Sub-items */}
            {isDamOpen && (
              <div className="mt-1 space-y-1">
                {damItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  
                  // If item has a badge, render as non-clickable
                  if (item.badge) {
                    return (
                      <div
                        key={item.name}
                        className="group flex items-center gap-3 pl-11 pr-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed opacity-60"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                          {item.badge}
                        </span>
                      </div>
                    );
                  }
                  
                  // Regular clickable item
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 pl-11 pr-3 py-2 text-sm font-medium rounded-md transition',
                        isActive
                          ? 'bg-green-100 text-kanyini-primary'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-kanyini-primary'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

