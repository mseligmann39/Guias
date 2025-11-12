import React from 'react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  // El objeto 'links' que viene directamente de la API de Laravel
  links: PaginationLink[]; 
  
  // Función para manejar el clic en un enlace de paginación
  onPageChange: (url: string) => void; 
}

// '&laquo; Previous' -> 'Anterior'
// 'Next &raquo;' -> 'Siguiente'
const labelMap: Record<string, string> = {
  '&laquo; Previous': 'Anterior',
  'Next &raquo;': 'Siguiente',
};

function Pagination({ links, onPageChange }: PaginationProps) {
  if (!links || links.length <= 3) {
    // No renderizar si solo hay 'prev', '1', 'next' (es una sola página)
    return null;
  }

  return (
    <nav className="flex justify-center my-8">
      <ul className="flex items-center gap-2">
        {links.map((link) => {
          // No renderizar si no hay URL (ej. '...' en paginación larga)
          if (!link.url) {
            return (
              <li key={link.label} className="px-4 py-2 rounded text-gray-500">
                <span dangerouslySetInnerHTML={{ __html: labelMap[link.label] || link.label }} />
              </li>
            );
          }

          // Renderizar el botón
          return (
            <li key={link.label}>
              <button
                onClick={() => link.url && onPageChange(link.url)}
                // Estilos condicionales
                className={`
                  px-4 py-2 rounded transition-colors
                  ${link.active ? 'bg-[var(--color-primary)] text-white font-bold' : 'bg-[#2a2a2a] text-white hover:bg-gray-700'}
                  ${(link.label.includes('Previous') || link.label.includes('Next')) ? 'font-medium' : ''}
                `}
                aria-current={link.active ? 'page' : undefined}
                // Deshabilitar botones de 'Anterior'/'Siguiente' si no tienen URL
                disabled={!link.url}
              >
                {/* 'dangerouslySetInnerHTML' es seguro aquí porque 'link.label' viene de nuestra API */}
                <span dangerouslySetInnerHTML={{ __html: labelMap[link.label] || link.label }} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Pagination;