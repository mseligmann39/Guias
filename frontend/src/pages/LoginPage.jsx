// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/auth.js';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [loginId, setloginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(loginId, password);
            navigate('/'); // Redirige a la página principal después del login
        } catch (err) {
            setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                {/* Input para el loginId */}
                <input type="loginId" value={loginId} onChange={e => setloginId(e.target.value)} placeholder="Usuario" required />
                {/* Input para la contraseña */}
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit">Login</button>
            </form>
            <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
    );
}
export default LoginPage;