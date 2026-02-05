import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    if (!user) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Etudiant" />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">👤 Mon Profil</h1>

                <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Nom</label>
                            <p className="text-lg text-gray-800">{user.nom}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                            <p className="text-lg text-gray-800">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Rôle</label>
                            <p className="text-lg text-gray-800">{user.role}</p>
                        </div>

                        {user.filiere && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Filière</label>
                                <p className="text-lg text-gray-800">{user.filiere}</p>
                            </div>
                        )}

                        {user.site && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Site</label>
                                <p className="text-lg text-gray-800">{user.site}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
