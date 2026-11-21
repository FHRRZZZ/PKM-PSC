import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContextBaru';

const menus = [
  { name: 'Dashboard', icon: '⌂', href: '/admin' },
  { name: 'Layanan', icon: '✚', href: '/admin/layanan' },
  { name: 'Berita', icon: '▤', href: '/admin/berita' },
  { name: 'FAQ', icon: '?', href: '/admin/faq' },
  { name: 'Kontak', icon: '☎', href: '/admin/kontak' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  return (
    <>
      {/* Tombol hamburger mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl shadow-sm lg:hidden"
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-64 flex-col justify-between overflow-y-auto border-r border-gray-100 bg-white p-6 transition-transform duration-200 ease-out lg:sticky lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white shadow-md">
              119
            </div>

            <h1 className="text-lg font-bold leading-tight text-gray-900">
              PSC Dinkes Depok
            </h1>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            {menus.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.href}
                end={menu.href === '/admin'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-150 ${
                    isActive
                      ? 'border-l-4 border-red-700 bg-red-50/60 font-semibold text-red-700'
                      : 'font-medium text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-5 w-5 items-center justify-center ${
                        isActive ? 'text-red-700' : 'text-gray-700'
                      }`}
                      aria-hidden="true"
                    >
                      {menu.icon}
                    </span>

                    <span className="text-sm">{menu.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile */}
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-900 text-sm font-bold text-white">
              <span aria-hidden="true">&#128100;</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-none capitalize text-gray-900">
                {user?.username || user?.email || 'Admin'}
              </p>

              <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-blue-800">
                {user?.role || 'admin'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg bg-red-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-900"
          >
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}