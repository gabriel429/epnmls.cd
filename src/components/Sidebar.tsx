'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: '📊 Dashboard', icon: '📊' },
    { href: '/dashboard/agents', label: '👥 Agents', icon: '👥' },
    { href: '/dashboard/requests', label: '📋 Demandes', icon: '📋' },
    { href: '/dashboard/documents', label: '📄 Documents', icon: '📄' },
    { href: '/dashboard/pointages', label: '⏰ Pointages', icon: '⏰' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">E-PNMLS</h1>
        <p className="text-xs text-gray-500">Portal RH Moderne</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`px-6 py-3 text-sm font-medium cursor-pointer transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <button className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}
