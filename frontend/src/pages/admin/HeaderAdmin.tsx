import { Link } from 'react-router-dom';

const HeaderAdmin: React.FC = () => {
  return (
    <header className="bg-[var(--color-bg)] border-b border-[var(--color-accent)] px-8 py-4">
      <div className="flex items-center gap-4">
        <Link 
          to="/admin" 
          className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-bg)] rounded font-medium transition-all hover:bg-[var(--color-accent-hover)]"
        >
          ← Volver al Panel
        </Link>
        <Link 
          to="/" 
          className="px-4 py-2 border border-[var(--color-accent)] text-[var(--color-text-primary)] rounded font-medium transition-all hover:bg-[var(--color-bg-secondary)]"
        >
          🏠 Home
        </Link>
      </div>
    </header>
  );
};

export default HeaderAdmin;
