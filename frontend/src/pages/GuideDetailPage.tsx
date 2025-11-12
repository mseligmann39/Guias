import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/context/api";
import { useAuth } from "@/context/auth";
import type { Guide, Comment as CommentType, GuideSection } from "@/types";
import ReactMarkdown from "react-markdown";
import Header from "../components/layout/Header";
import CommentList from "../components/CommentList";
import CommentInput from "../components/CommentInput";
import StarRating from "../components/StarRating";
import StarInput from "@/components/StarInput";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const getYoutubeEmbedUrl = (url: string): string | null => {
  // ... (tu helper de YouTube está perfecto)
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      videoId = urlObj.searchParams.get("v");
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.substring(1);
    }
  } catch (e) {
    console.error("URL de video no válida:", url);
    return null;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const GuideDetailPage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const { user: currentUser, loading: userLoading } = useAuth();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- INICIO: Paso 1 - Mover la función de carga ---
  // Sacamos la lógica de 'useEffect' para poder llamarla cuando queramos
  const fetchGuideData = async () => {
    // No ponemos setLoading(true) aquí para que sea una recarga "silenciosa"
    setError(null);
    try {
      const guideRes = await api.get<Guide>(`/api/guides/${guideId}`);
      setGuide(guideRes.data);
      setComments(guideRes.data.comments || []);
    } catch (err: any) {
      console.error("Error fetching guide data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "No se pudo cargar la guía."
      );
    } finally {
      // Nos aseguramos de quitar el 'loading' la primera vez
      setLoading(false);
    }
  };

  // useEffect ahora solo llama a la función
  useEffect(() => {
    setLoading(true); // Ponemos el loading inicial aquí
    fetchGuideData();
  }, [guideId]);
  // --- FIN: Paso 1 ---

  // --- INICIO: Paso 2 - Crear los Handlers ---
  // Este handler se activará cuando 'CommentInput' envíe la señal
  const handleNewComment = () => {
    // Simplemente volvemos a cargar los datos de la guía.
    // Esto traerá la nueva lista de comentarios.
    fetchGuideData();
  };

  // Este handler se activará cuando 'StarInput' envíe la señal
  const handleNewRating = () => {
    // Volvemos a cargar los datos de la guía.
    // Esto traerá la nueva 'average_rating', 'rating_count' y 'user_rating'.
    fetchGuideData();
  };
  // --- FIN: Paso 2 ---

  // (Función renderSection - sin cambios)
  const renderSection = (section: GuideSection) => {
    switch (section.type) {
      case "text":
        return (
          <div
            key={section.id}
            className="prose prose-invert max-w-none text-[var(--color-text-primary)] mb-4"
          >
            <ReactMarkdown>{section.content || ""}</ReactMarkdown>
          </div>
        );
      case "image":
        return (
          <div key={section.id} className="my-4 flex justify-center">
            <img
              src={`${backendUrl}/storage/${section.image_path}`}
              alt="Sección de la guía"
              className="max-w-full h-auto rounded-lg border border-[var(--color-accent)] md:max-w-xl lg:max-w-2xl"
            />
          </div>
        );
      case "video":
        const embedUrl = section.content
          ? getYoutubeEmbedUrl(section.content)
          : null;
        return embedUrl ? (
          <div key={section.id} className="my-4 aspect-video">
            <iframe
              className="w-full h-full rounded-lg border border-[var(--color-accent)]"
              src={embedUrl}
              title="Video de la guía"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p key={section.id} className="text-red-400">
            Video no válido: {section.content}
          </p>
        );
      default:
        return <p key={section.id}>Tipo de sección desconocido</p>;
    }
  };

  // (Estados de carga y error - sin cambios)
  if (loading || userLoading) {
    return (
      <>
        <Header />
        <main className="text-center p-12 text-[var(--color-text-secondary)]">
          Cargando guía...
        </main>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Header />
        <main className="text-center p-12 text-red-400">Error: {error}</main>
      </>
    );
  }
  if (!guide) {
    return (
      <>
        <Header />
        <main className="text-center p-12 text-[var(--color-text-secondary)]">
          Guía no encontrada.
        </main>
      </>
    );
  }

  const isAuthor =
    currentUser && guide.user && currentUser.id === guide.user.id;

  return (
    <>
      <Header />
      <main className="max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto p-6">
        <article className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-8 shadow-lg">
          {/* (Sección de Título - sin cambios) */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-[var(--color-accent)]">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {guide.title}
              </h1>
              {guide.game && (
                <p className="text-lg text-[var(--color-text-secondary)] mt-2">
                  Para:
                  <Link
                    to={`/games/${guide.game.id}`}
                    className="text-[var(--color-primary)] hover:underline ml-1"
                  >
                    {guide.game.title}
                  </Link>
                </p>
              )}
            </div>
            {isAuthor && (
              <Link
                to={`/guides/edit/${guide.id}`}
                className="mt-4 sm:mt-0 px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Editar Guía
              </Link>
            )}
          </div>

          {/* (Sección de Autor - sin cambios) */}
          {guide.user && (
            <div className="mb-6 flex items-center space-x-3">
              <img
                src={guide.user.profileIcon || "/favicon.png"}
                alt={guide.user.name}
                className="w-10 h-10 rounded-full bg-gray-700"
              />
              <div>
                <p className="text-[var(--color-text-primary)] font-semibold">
                  Por:
                  <Link
                    to={`/profile/${guide.user.id}`}
                    className="text-[var(--color-primary)] hover:underline ml-1"
                  >
                    {guide.user.name}
                  </Link>
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Publicado el:{" "}
                  {new Date(guide.created_at || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* --- INICIO: Paso 3 - Mover y arreglar StarInput --- */}
          {/* (Sección de Rating - MODIFICADA) */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Valoración</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {/* Este es el componente que MUESTRA la media */}
              <StarRating
                rating={guide.average_rating || 0}
                count={guide.rating_count || 0}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">
                ({guide.rating_count || 0} valoraciones)
              </span>
            </div>
            
            {/* Este es el componente para QUE EL USUARIO VOTE */}
            {currentUser && (
              <div className="mt-4">
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Tu valoración:</p>
                <StarInput
                  guideId={guide.id}
                  // Pasamos la valoración del usuario (viene de la API)
                  initialValue={guide.user_rating || 0}
                  // ¡Pasamos el handler!
                  onRatingSubmitted={handleNewRating}
                />
              </div>
            )}
          </div>
          {/* --- FIN: Paso 3 --- */}


          {/* (Sección de Contenido - sin cambios) */}
          <div className="guide-content-sections space-y-4">
            {guide.sections && guide.sections.length > 0 ? (
              guide.sections.map(renderSection)
            ) : (
              <p className="text-[var(--color-text-secondary)]">
                Esta guía aún no tiene contenido.
              </p>
            )}
          </div>
        </article>

        {/* --- INICIO: Paso 4 - Arreglar CommentInput --- */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
            Comentarios
          </h2>
          
          {/* 1. Mostramos la lista PRIMERO */}
          <CommentList comments={comments} />

          {/* 2. Mostramos el input para comentar DESPUÉS (y solo si está logueado) */}
          {currentUser && (
            <CommentInput
              guideId={guide.id}
              // ¡Pasamos el handler!
              onCommentPosted={handleNewComment}
            />
          )}
        </section>
        {/* --- FIN: Paso 4 --- */}
      </main>
    </>
  );
};

export default GuideDetailPage;