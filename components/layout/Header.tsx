'use client';

import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.name || 'User'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gray-600 hover:text-kanyini-primary hover:bg-gray-100 rounded-full transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-gray-300 mx-2" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

