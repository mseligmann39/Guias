// frontend/src/components/admin/AdminProtectedRoute.tsx
import React from 'react';
import { useAuth } from '@/context/auth';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Muestra un 'Cargando...' mientras se verifica el usuario
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  // Si terminó de cargar y el usuario existe Y es admin
  if (user && user.is_admin) {
    // 'Outlet' renderizará el componente de la ruta hija (ej: AdminDashboard)
    return <Outlet />;
  }

  // Si no está logueado o no es admin, redirige al inicio
  return <Navigate to="/" replace />;
};

export default AdminProtectedRoute;