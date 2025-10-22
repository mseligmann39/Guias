// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/auth.js';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validación simple de contraseña
        if (password !== passwordConfirmation) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            await register(name, email, password, passwordConfirmation);
            navigate('/'); // Redirige a la página principal después del registro exitoso
        } catch (err) {
            // Aquí podrías manejar errores específicos de la API, como email ya existente
            setError("Error al registrar. Verifica tus datos.");
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
                <input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} placeholder="Confirmar Contraseña" required />

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
    );
}
export default RegisterPage;