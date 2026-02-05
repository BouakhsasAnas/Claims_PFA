import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth';

import logo from '../../assets/logo_emsi.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Attempting login with:', email);
            const response = await AuthService.login(email, password);
            console.log('Login response:', response);

            const role = response.user.role;
            console.log('User role:', role);

            if (role === 'Administrateur') {
                console.log('Redirecting to /admin');
                navigate('/admin');
            } else if (role === 'Responsable Filiere') {
                console.log('Redirecting to /responsable-filiere');
                navigate('/responsable-filiere');
            } else if (role === 'Responsable Site') {
                console.log('Redirecting to /responsable-site');
                navigate('/responsable-site');
            } else if (role === 'Etudiant') {
                console.log('Redirecting to /user/my-claims');
                navigate('/user/my-claims');
            } else {
                console.log('Unknown role, redirecting to /user');
                navigate('/user');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError('Échec de la connexion. Vérifiez vos identifiants.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="EMSI Logo" className="h-24 object-contain" />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
