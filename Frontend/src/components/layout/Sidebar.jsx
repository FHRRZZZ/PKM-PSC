import React from 'react';
import { 
  LayoutDashboard, 
  Asterisk, 
  Newspaper, 
  HelpCircle, 
  PhoneCall 
} from 'lucide-react';

const Sidebar = ({ activeMenu = 'Dashboard' }) => {
  // Daftar menu navigasi utama
  const menus = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Layanan', icon: Asterisk, href: '#' },
    { name: 'Berita', icon: Newspaper, href: '#' },
    { name: 'FAQ', icon: HelpCircle, href: '#' },
    { name: 'Kontak', icon: PhoneCall, href: '#' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 min-h-screen">
      <div>
        {/* Logo / Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
            119
          </div>
          <h1 className="font-bold text-lg text-gray-900 leading-tight">
            PSC Dinkes Depok
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = activeMenu.toLowerCase() === menu.name.toLowerCase();

            return (
              <a
                key={menu.name}
                href={menu.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'text-red-700 bg-red-50/60 font-semibold border-l-4 border-red-700'
                    : 'text-gray-600 font-medium hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-700' : 'text-gray-700'}`} />
                <span className="text-sm">{menu.name}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* User Profile / Logout */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-900 text-white flex items-center justify-center font-bold text-sm">
            <span className="text-xs">👤</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Siti Rahma</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded">
              Admin Medis
            </span>
          </div>
        </div>
        <button className="bg-red-800 hover:bg-red-900 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer">
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;