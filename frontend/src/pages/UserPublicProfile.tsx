// frontend/src/pages/UserPublicProfile.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGuidesByUserId } from '../context/api';
import Header from '../components/layout/Header';
import GuideList from '../components/GuideList'; // Reutilizamos el componente

// (Asumo que tu tipo Guide está en un archivo de tipos, si no, impórtalo o redefínelo)
interface Guide {
  id: number;
  title: string;
  // ... (otros campos que necesite GuideList)
}

function UserPublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(''); // Para mostrar el nombre

  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await getGuidesByUserId(userId);
        setGuides(response.data);
        
        // Asumimos que todas las guías tienen el mismo autor
        // y lo usamos para sacar el nombre de usuario
        if (response.data.length > 0) {
          setUserName(response.data[0].user.name); 
        }
      } catch (err) {
        console.error("Error al cargar el perfil público:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <>
        <Header />
        <p className="text-center p-8">Cargando perfil...</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        {/* Usamos el nombre del autor de la primera guía */}
        <h1 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-8">
          Perfil de {userName || 'Usuario'}
        </h1>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-6 pb-2 border-b border-[var(--color-accent)]">
            Guías creadas por {userName || 'este usuario'}
          </h2>
          
          <GuideList guides={guides} />

          {guides.length === 0 && (
            <p className="text-[var(--color-text-secondary)] italic">
              Este usuario aún no ha creado ninguna guía.
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export default UserPublicProfile;