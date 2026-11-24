import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContextBaru';
import Icon from '../ui/Icon';

const menus = [
  { name: 'Dashboard', icon: 'home', href: '/admin' },
  { name: 'Layanan', icon: 'cross', href: '/admin/layanan' },
  { name: 'Berita', icon: 'newspaper', href: '/admin/berita' },
  { name: 'Katalog Layanan Klinik', icon: 'hospital', href: '/admin/klinik' },
  { name: 'FAQ', icon: 'circle-help', href: '/admin/faq' },
  { name: 'Kontak', icon: 'phone', href: '/admin/kontak' },
  { name: 'Hero Landing', icon: 'image', href: '/admin/hero' },
  { name: 'Galeri PSC', icon: 'image', href: '/admin/galeri-psc' },
  { name: 'Log Aktivitas', icon: 'clock', href: '/admin/log-aktivitas', superadminOnly: true },
];

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-150 ${
    isActive
      ? 'border-l-4 border-red-700 bg-red-50/60 font-semibold text-red-700'
      : 'font-medium text-gray-600 hover:bg-gray-50'
  }`;

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout, isSuperadmin } = useAuth();

  const visibleMenus = menus.filter((menu) => !menu.superadminOnly || isSuperadmin);

  const [isOpen, setIsOpen] = useState(false);
  // grup menu terbuka otomatis jika halaman aktif berada di dalamnya
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(
      menus.filter((m) => m.children).map((m) => [
        m.name,
        m.children.some((child) =>
          child.end ? pathname === child.href : pathname.startsWith(child.href)
        ),
      ])
    )
  );

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
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white p-5 transition-transform duration-200 ease-out lg:fixed lg:z-40 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3 rounded-2xl bg-[#182433] p-3 text-white shadow-lg shadow-slate-900/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-xs font-bold text-white shadow-md">
              119
            </div>

            <h1 className="text-lg font-bold leading-tight text-white">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-red-200">CMS Klinik</span>
              <span className="block text-sm">PSC Dinkes Depok</span>
            </h1>
          </div>

          {/* Menu */}
          <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-4">
            {visibleMenus.map((menu) => {
              if (menu.children) {
                const open = openGroups[menu.name];
                const groupActive = menu.children.some((child) =>
                  child.end ? pathname === child.href : pathname.startsWith(child.href)
                );
                return (
                  <div key={menu.name}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGroups((c) => ({ ...c, [menu.name]: !c[menu.name] }))
                      }
                      aria-expanded={open}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-150 ${
                        groupActive
                          ? 'font-semibold text-red-700'
                          : 'font-medium text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        name={menu.icon}
                        size={20}
                        className={groupActive ? 'text-red-700' : 'text-gray-700'}
                      />
                      <span className="flex-1 text-sm">{menu.name}</span>
                      <span
                        aria-hidden="true"
                        className={`text-xs transition-transform duration-150 ${
                          open ? 'rotate-90' : ''
                        }`}
                      >
                        ▶
                      </span>
                    </button>

                    {open && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-gray-100 pl-3">
                        {menu.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            onClick={() => setIsOpen(false)}
                            end={child.end}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                                isActive
                                  ? 'bg-red-50/60 font-semibold text-red-700'
                                  : 'font-medium text-gray-600 hover:bg-gray-50'
                              }`
                            }
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={menu.name}
                  to={menu.href}
                  end={menu.href === '/admin' || menu.href === '/admin/klinik'}
                  onClick={() => setIsOpen(false)}
                  className={linkCls}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        name={menu.icon}
                        size={20}
                        className={isActive ? 'text-red-700' : 'text-gray-700'}
                      />
                      <span className="text-sm">{menu.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile */}
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/image/logo.png"
              alt="Logo Profil Admin"
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className=" truncate text-sm font-bold leading-none capitalize text-gray-900 mb-1">
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
