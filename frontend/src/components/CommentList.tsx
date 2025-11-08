import React, { useState, useEffect } from 'react';
import { deleteComment } from '../context/api';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';


interface User {
  id: number;
  name: string;
  email: string;
}

interface CommentType {
  id: number | string;
  user: User;
  created_at: string;
  body: string;
}

interface CommentProps {
  comment: CommentType;
  currentUserId?: number;
  showDeleteButton?: boolean;
  onDeleteClick?: (commentId: number | string) => Promise<void>;
}

const Comment: React.FC<CommentProps> = ({ comment, onDeleteClick, currentUserId, showDeleteButton }) => {
  const isCurrentUserComment = currentUserId === comment.user.id;
  
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 relative group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <strong className="text-white">{comment.user.name}</strong>
          {isCurrentUserComment && (
            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">Tú</span>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 text-sm mr-2">
            {new Date(comment.created_at).toLocaleString()}
          </span>
          {isCurrentUserComment && (
            <button
              onClick={() => onDeleteClick?.(comment.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Eliminar comentario"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-200 whitespace-pre-wrap">{comment.body}</p>
    </div>
  );
};

interface CommentListProps {
  comments?: CommentType[];
}

const CommentList: React.FC<CommentListProps> = ({ comments = [] }) => {
  const { user } = useAuth();
  const [localComments, setLocalComments] = useState<CommentType[]>(comments);

  const handleDeleteComment = async (commentId: number | string) => {
    try {
      await deleteComment(commentId);
      // Remove the deleted comment from local state
      setLocalComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      alert('No se pudo eliminar el comentario. Inténtalo de nuevo.');
    }
  };

  // Update local comments when the prop changes
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Comentarios</h3>
      {localComments.length > 0 ? (
        <div className="space-y-4">
          {localComments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              currentUserId={user?.id}
              showDeleteButton={true}
              onDeleteClick={handleDeleteComment}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">Aún no hay comentarios. ¡Sé el primero!</p>
      )}
    </div>
  );
};

export default CommentList;