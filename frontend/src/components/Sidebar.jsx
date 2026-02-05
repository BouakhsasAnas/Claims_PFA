import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold">Gestion Réclamations</div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {role === 'Etudiant' && (
                        <>
                            <li>
                                <Link to="/user/new-claim" className="block p-2 hover:bg-gray-700 rounded">
                                    ➕ Nouvelle Réclamation
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/my-claims" className="block p-2 hover:bg-gray-700 rounded">
                                    📋 Mes Réclamations
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/profile" className="block p-2 hover:bg-gray-700 rounded">
                                    👤 Mon Profil
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/stats" className="block p-2 hover:bg-gray-700 rounded">
                                    📊 Dashboard
                                </Link>
                            </li>
                        </>
                    )}
                    {role === 'Administrateur' && (
                        <>
                            <li>
                                <Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">
                                    📊 Réclamations
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">
                                    👥 Gestion Utilisateurs
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/stats" className="block p-2 hover:bg-gray-700 rounded">
                                    📊 Dashboard
                                </Link>
                            </li>
                        </>
                    )}
                    {role === 'Responsable Filiere' && (
                        <>
                            <li>
                                <Link to="/responsable-filiere" className="block p-2 hover:bg-gray-700 rounded">📚 Réclamations NOTE</Link>
                            </li>
                            <li>
                                <Link to="/responsable-filiere/profile" className="block p-2 hover:bg-gray-700 rounded">👤 Mon Profil</Link>
                            </li>
                            <li>
                                <Link to="/admin/stats" className="block p-2 hover:bg-gray-700 rounded">
                                    📊 Dashboard
                                </Link>
                            </li>
                        </>
                    )}
                    {role === 'Responsable Site' && (
                        <>
                            <li>
                                <Link to="/responsable-site" className="block p-2 hover:bg-gray-700 rounded">📅 Réclamations ABSENCE</Link>
                            </li>
                            <li>
                                <Link to="/responsable-site/profile" className="block p-2 hover:bg-gray-700 rounded">👤 Mon Profil</Link>
                            </li>
                            <li>
                                <Link to="/admin/stats" className="block p-2 hover:bg-gray-700 rounded">
                                    📊 Dashboard
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className="p-4">
                <button onClick={handleLogout} className="w-full bg-red-600 p-2 rounded hover:bg-red-700">
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
