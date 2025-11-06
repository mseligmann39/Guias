import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import Header from '../components/layout/Header';
import api from '../context/api';

// Array de iconos disponibles (25 diferentes)
const AVAILABLE_ICONS = [
  '👤','👨','👩','🧑','👶','👦','👧','🧒','👱','👨‍🦰','👩‍🦰',
  '👨‍🦱','👩‍🦱','👨‍🦳','👩‍🦳','👨‍🦲','👩‍🦲','🧔','👴',
  '👵','🧓','👼','🎅','🤶','🧑‍🎄'
];

function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    profileIcon: user?.profileIcon || '👤'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({
      ...prev,
      profileIcon: icon
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Primero obtenemos el token CSRF
      await api.get('/sanctum/csrf-cookie');
      
      const dataToSend = {
        ...formData,
        // Solo incluir password si se ha introducido uno nuevo
        ...(formData.password ? {
          password: formData.password,
          password_confirmation: formData.password_confirmation
        } : {})
      };

      await api.put('/api/users/profile', dataToSend);
      await refreshUser(); // Actualizar la información del usuario en el contexto
      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="max-w-[800px] my-8 mx-auto p-8 bg-[var(--color-background)] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">Editar Perfil</h1>
        {error && <div className="p-4 bg-red-900/30 border border-red-700 text-red-200 rounded mb-4">{error}</div>}
        {success && <div className="p-4 bg-green-900/30 border border-green-700 text-green-200 rounded mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-bold text-[var(--color-text-primary)] text-lg">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border border-[var(--color-accent)] rounded text-base bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold text-[var(--color-text-primary)]">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border border-[var(--color-accent)] rounded text-base bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-[var(--color-text-primary)]">Icono de perfil:</label>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] gap-2 p-4 border border-[var(--color-accent)] rounded">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-[50px] h-[50px] border-2 rounded bg-[var(--color-background)] cursor-pointer text-2xl flex items-center justify-center transition-all duration-200 hover:bg-[var(--color-accent)] ${
                    formData.profileIcon === icon 
                      ? 'border-[var(--color-primary)] bg-[var(--color-accent)]' 
                      : 'border-transparent'
                  }`}
                  onClick={() => handleIconSelect(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold text-[var(--color-text-primary)]">Nueva Contraseña (opcional):</label>
            <div className="text-sm text-[var(--color-text-secondary)]">
              Deja en blanco si no quieres cambiar la contraseña.
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border border-[var(--color-accent)] rounded text-base bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password_confirmation" className="font-bold text-[var(--color-text-primary)]">Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="p-3 border border-[var(--color-accent)] rounded text-base bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <button type="submit" className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold rounded hover:bg-opacity-90 transition-all hover:shadow-[0_0_15px_rgba(231,0,0,0.3)]">Guardar Cambios</button>
        </form>
      </main>
    </>
  );
}

export default EditProfilePage;