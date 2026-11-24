import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#f4f6f8]">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 lg:ml-72 lg:p-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}
