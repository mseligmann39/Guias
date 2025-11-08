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
    <form onSubmit={handleSubmit} className="flex flex-col mt-4">
      <textarea
        className="border border-gray-300 rounded-lg p-2 mb-2 resize-none"
        placeholder="Escribe tu comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex flex-col">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button 
          className={`bg-yellow-400 text-white rounded-lg px-4 py-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

export default CommentInput;
