'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: '📊',
    },
    {
      name: 'Danh sách khách hàng',
      href: '/credits',
      icon: '👥',
    },
    {
      name: 'Tạo khách hàng',
      href: '/credits/new',
      icon: '➕',
    },
  ];

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Credit System</h1>
        <p className="text-gray-600 text-sm mt-1">Quản lý tín dụng</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 