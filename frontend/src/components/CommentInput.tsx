import { useState } from "react";
import { postComment } from "../context/api";

interface CommentInputProps {
  guideId: string | number;
  onCommentPosted?: () => void; // Optional callback after successful comment
}

const CommentInput: React.FC<CommentInputProps> = ({ guideId, onCommentPosted }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await postComment(guideId, comment);
      setComment('');
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch (err) {
      console.error('Error al publicar el comentario:', err);
      setError('Error al publicar el comentario. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Deja un comentario</h3>
        <textarea
          className="w-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-colors min-h-[100px] resize-none"
          placeholder="Escribe tu comentario..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (error) setError(null);
          }}
        />
      </div>
      <div className="flex flex-col space-y-2">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button 
          className={`bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-bg)] font-medium py-2 px-4 rounded-lg transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`} 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Publicar comentario'}
        </button>
      </div>
    </form>
  );
};

export default CommentInput;
