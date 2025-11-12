import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import StarRating from "@/components/StarRating";
import CommentList from "@/components/CommentList";
import GuideListActions from "../components/GuideListActions";
import { useAuth } from "../context/AuthContext";
import StarInput from "@/components/StarInput";
import CommentInput from "@/components/CommentInput";
import { postComment, postRating, default as api } from '../context/api';
// Definición de tipos para la estructura de la guía
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Game {
  id: number;
  title: string;
  slug: string;
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: User;
}

interface ListStatus {
  is_favorite: boolean;
  progress_status: "todo" | "completed" | null;
}

export interface Guide {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
  game: Game;
  comments: Comment[];
  average_rating?: number;
  rating_count?: number;
  list_status?: ListStatus;
}

function GuideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  // Inicializamos el estado con "Guide | null" para obtener tipado correcto
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // comentarios
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRating, setIsRating] = useState(false);
  const isAuthor = user && guide?.user && user.id === guide.user.id;
  const fetchGuide = useCallback(() => {
    const guideURL = `${import.meta.env.VITE_API_BASE_URL}guides/${id}`;
    return api
      .get<Guide>(guideURL)
      .then((response) => {
        setGuide(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar la guía:", error);
        setGuide(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchGuide();
  }, [fetchGuide, refreshKey]);

  const handleCommentPosted = () => {
    // Increment refreshKey to trigger a refetch of the guide data
    setRefreshKey((prev) => prev + 1);
  };

  const handleRatingSubmitted = async () => {
    // Refresh the guide data to show the updated rating
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <p className="text-center p-8 text-xl text-[var(--color-text-secondary)]">
          Cargando guía...
        </p>
      </>
    );
  }

  if (!guide) {
    
    return (
      <>
        <Header />
        <p className="text-center p-8 text-xl text-[var(--color-text-secondary)]">
          Guía no encontrada.
        </p>
      </>
    );
  }   

      
  return (
    <>
      <Header />
      <main className="max-w-[800px] my-8 mx-auto p-8">
        <article className="bg-[#2a2a2a] rounded-lg py-8 px-12 border border-[var(--color-accent)]">
          <div className="flex justify-between items-start">
            <h1 className="font-[var(--font-heading)] text-[2.8rem] mb-2 leading-tight text-[var(--color-text-primary)]">
              {guide.title}
            </h1>
            {guide.list_status && (
              <GuideListActions
                guideId={guide.id}
                initialStatus={guide.list_status}
              />
            )}
          </div>

          <div className="mb-8 text-lg text-[var(--color-text-secondary)]">
            <div className="mb-2">
              <span>Guía para: </span>
              <Link
                to={`/games/${guide.game.id}`}
                className="text-[var(--color-primary)] no-underline font-bold hover:underline"
              >
                {guide.game.title}
              </Link>
            </div>
            <div>
              <span>Autor: </span>
              <Link
                to={`/profile/${guide.user.id}`}
                className="text-[var(--color-primary)] no-underline hover:underline"
              >
                {guide.user.name}
              </Link>
            </div>
          </div>
          {/* 
            ATENCIÓN: Esta línea utiliza "dangerouslySetInnerHTML" 
            para renderizar HTML desde la guía.
            No lo uses si no confías en el contenido. 
          */}
          <div
            className="text-lg leading-[1.7] text-[var(--color-text-secondary)] [&_h2]:font-[var(--font-heading)] [&_h2]:text-[var(--color-text-primary)] [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-[var(--color-accent)] [&_h2]:pb-2 [&_h3]:font-[var(--font-heading)] [&_h3]:text-[var(--color-text-primary)] [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:border-b [&_h3]:border-[var(--color-accent)] [&_h3]:pb-2 [&_h4]:font-[var(--font-heading)] [&_h4]:text-[var(--color-text-primary)] [&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:border-b [&_h4]:border-[var(--color-accent)] [&_h4]:pb-2 [&_p]:mb-4 [&_ul]:pl-8 [&_ul]:mb-4 [&_ol]:pl-8 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-[var(--color-primary)] [&_strong]:text-[var(--color-text-primary)]"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
          {isAuthor && (
              <Link
                to={`/guides/edit/${guide.id}`}
                className="mt-4 sm:mt-0 px-5 py-2 bg-gray-800 text-white font-medium rounded hover:bg-gray-700 transition-colors mr-2 mb-4"
              >
                Editar Guía
              </Link>
            )}
        </article>
        

        <div className="my-4">
          <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">
            Valora esta guía
          </h3>
          <StarInput
            guideId={guide.id}
            initialValue={userRating || 0}
            onRatingSubmitted={handleRatingSubmitted}
            disabled={isRating}
          />
          {(guide.rating_count ?? 0) > 0 && (
            <div className="mt-2">
              <StarRating
                rating={guide.average_rating || 0}
                count={guide.rating_count || 0}
              />
            </div>
          )}
        </div>
        <CommentList comments={guide.comments} />
        <div className="mt-4">
          {isAuthenticated ? (
            <CommentInput
              guideId={guide.id}
              onCommentPosted={handleCommentPosted}
            />
          ) : (
            <p className="text-gray-400 text-center mt-4">
              <Link to="/login" className="text-blue-400 hover:underline">
                Inicia sesión
              </Link>{" "}
              para dejar un comentario
            </p>
          )}
        </div>
      </main>
    </>
  );
}

export default GuideDetailPage;
