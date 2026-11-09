import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContextBaru';

// <ProtectedRoute /> atau <ProtectedRoute roles={['superadmin']} />
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Memuat...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
