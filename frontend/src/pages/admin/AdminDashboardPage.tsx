// frontend/src/pages/admin/AdminDashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import HeaderAdmin from './HeaderAdmin';

// (Puedes importar iconos de lucide-react si los tienes)
// import { Shield, Users, Gamepad2, FileText } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (<>
    <HeaderAdmin />
    <div className="max-w-7xl mx-auto p-6 text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-lg text-[var(--color-text-secondary)] mb-8">
        Bienvenido, <span className="font-bold text-[var(--color-primary)]">{user?.name}</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Enlace a Gestión de Juegos */}
        <Link to="/admin/games" className="block p-6 bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg hover:bg-[#3a3a3a] transition-colors">
          {/* <Gamepad2 size={24} className="mb-2 text-[var(--color-primary)]" /> */}
          <h2 className="text-xl font-semibold mb-2">Gestionar Juegos</h2>
          <p className="text-[var(--color-text-secondary)]">
            Editar descripciones, añadir o eliminar juegos de la base de datos.
          </p>
        </Link>

        {/* Enlace a Gestión de Usuarios */}
        <Link to="/admin/users" className="block p-6 bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg hover:bg-[#3a3a3a] transition-colors">
          {/* <Users size={24} className="mb-2 text-[var(--color-primary)]" /> */}
          <h2 className="text-xl font-semibold mb-2">Gestionar Usuarios</h2>
          <p className="text-[var(--color-text-secondary)]">
            Ver la lista de usuarios, eliminar cuentas spam o problemáticas.
          </p>
        </Link>

        {/* Enlace a Gestión de Guías */}
        <Link to="/admin/guides" className="block p-6 bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg hover:bg-[#3a3a3a] transition-colors">
          {/* <FileText size={24} className="mb-2 text-[var(--color-primary)]" /> */}
          <h2 className="text-xl font-semibold mb-2">Gestionar Guías</h2>
          <p className="text-[var(--color-text-secondary)]">
            Moderar y eliminar guías que violen las normas de la comunidad.
          </p>
        </Link>

        {/* Enlace a Reportes de Guías */}
        <Link to="/admin/reportes" className="block p-6 bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg hover:bg-[#3a3a3a] transition-colors">
          <h2 className="text-xl font-semibold mb-2">Ver Reportes</h2>
          <p className="text-[var(--color-text-secondary)]">Revisar los reportes enviados por usuarios y tomar acciones.</p>
        </Link>

      </div>
    </div>
    </>
  );
};

export default AdminDashboardPage;