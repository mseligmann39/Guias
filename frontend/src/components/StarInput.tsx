import { useState, useEffect } from 'react';
import { postRating } from '../context/api';

type Size = 'sm' | 'md' | 'lg';

interface StarInputProps {
  guideId: string | number;
  initialValue?: number;
  disabled?: boolean;
  size?: Size;
  onRatingSubmitted?: () => void;
}

const StarInput: React.FC<StarInputProps> = ({
  guideId,
  initialValue = 0,
  disabled = false,
  size = 'md',
  onRatingSubmitted,
}) => {
  const [value, setValue] = useState(initialValue);
  const [hoverValue, setHoverValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(initialValue > 0);

  // Update internal state when initialValue changes
  useEffect(() => {
    setValue(initialValue);
    setHasRated(initialValue > 0);
  }, [initialValue]);

  const sizeClasses: Record<Size, string> = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const handleRatingClick = async (rating: number) => {
    if (disabled || isSubmitting) return;
    
    // Optimistic UI update
    const previousValue = value;
    setValue(rating);
    setHasRated(true);
    setIsSubmitting(true);
    
    try {
      await postRating(guideId, rating);
      // Call the callback to refresh the parent component
      onRatingSubmitted?.();
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      // Revert the value if there's an error
      setValue(previousValue);
      setHasRated(previousValue > 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (!disabled && !isSubmitting) {
      setHoverValue(star);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !isSubmitting) {
      setHoverValue(0);
    }
  };

  const getStarAriaLabel = (star: number): string => {
    if (hasRated && value === star) {
      return `Has calificado con ${star} ${star === 1 ? 'estrella' : 'estrellas'}. Haz clic para cambiar`;
    }
    return `Calificar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <div 
          className="flex" 
          role="radiogroup" 
          aria-label="Valoración de la guía"
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverValue || value);
            const isCurrentRating = value === star && !hoverValue;
            
            return (
              <button
                key={star}
                type="button"
                disabled={disabled || isSubmitting}
                className={`${sizeClasses[size]} ${
                  isFilled 
                    ? isCurrentRating 
                      ? 'text-yellow-400 scale-110' 
                      : 'text-yellow-400/80'
                    : 'text-gray-400'
                } ${
                  !disabled && !isSubmitting 
                    ? 'hover:text-yellow-300 transform hover:scale-110' 
                    : ''
                } transition-all duration-150 p-1`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleMouseEnter(star)}
                onBlur={handleMouseLeave}
                aria-label={getStarAriaLabel(star)}
                aria-checked={isCurrentRating}
                role="radio"
                tabIndex={disabled ? -1 : 0}
              >
                {isFilled ? '★' : '☆'}
              </button>
            );
          })}
        </div>
        
        {(hasRated || isSubmitting) && (
          <span className="ml-3 text-sm text-gray-400 flex items-center min-h-5">
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-1"></span>
                <span>Guardando...</span>
              </span>
            ) : (
              <span>
                {value} {value === 1 ? 'estrella' : 'estrellas'}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default StarInput;
