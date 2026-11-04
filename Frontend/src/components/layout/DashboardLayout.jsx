import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
}
