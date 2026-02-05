import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ReclamationService from '../../services/reclamation.service';

const UserDashboard = () => {
    const [reclamations, setReclamations] = useState([]);
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadReclamations();
    }, []);

    const loadReclamations = async () => {
        try {
            const response = await ReclamationService.getMyReclamations();
            setReclamations(response.data);
        } catch (error) {
            console.error("Erreur chargement réclamations", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ReclamationService.createReclamation(titre, description, []);
            setMessage('Réclamation créée avec succès !');
            setTitre('');
            setDescription('');
            loadReclamations();
        } catch (error) {
            setMessage('Erreur lors de la création.');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Utilisateur" />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Espace Utilisateur</h1>

                {/* Formulaire de création */}
                <div className="bg-white p-6 rounded shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Nouvelle Réclamation</h2>
                    {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Titre</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Envoyer
                        </button>
                    </form>
                </div>

                {/* Liste des réclamations */}
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Mes Réclamations</h2>
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Titre
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Statut
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reclamations.map((rec) => (
                                <tr key={rec.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{rec.titre}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(rec.date_creation).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold text-white leading-tight rounded-full 
                      ${rec.status === 'EN_ATTENTE' ? 'bg-yellow-500' :
                                                rec.status === 'TRAITEE' ? 'bg-green-500' :
                                                    rec.status === 'REJETEE' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                            <span className="relative">{rec.status}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
