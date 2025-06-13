import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../admin/AdminSidebar';

export default function AdminLayout() {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-background-DEFAULT bg-apple-dark">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}