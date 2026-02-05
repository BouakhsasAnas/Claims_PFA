import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ReclamationService from '../../services/reclamation.service';

const MyClaims = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReclamations();
    }, []);

    const loadReclamations = async () => {
        try {
            const response = await ReclamationService.getMyReclamations();
            setReclamations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement réclamations", error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'EN_ATTENTE': 'bg-yellow-500',
            'EN_COURS': 'bg-blue-500',
            'TRAITEE': 'bg-green-500',
            'REJETEE': 'bg-red-500'
        };

        const labels = {
            'EN_ATTENTE': '⏳ En Attente',
            'EN_COURS': '🔄 En Cours',
            'TRAITEE': '✅ Traitée',
            'REJETEE': '❌ Rejetée'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${styles[status] || 'bg-gray-500'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getTypeIcon = (type) => {
        return type === 'NOTE' ? '📚' : '📅';
    };

    const getTypeLabel = (type) => {
        return type === 'NOTE' ? 'Note' : 'Absence';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Etudiant" />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">📋 Mes Réclamations</h1>
                    <button
                        onClick={() => window.location.href = '/user/new-claim'}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        ➕ Nouvelle Réclamation
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-600">Chargement...</div>
                    </div>
                ) : reclamations.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-md text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Aucune réclamation
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Vous n'avez pas encore soumis de réclamation.
                        </p>
                        <button
                            onClick={() => window.location.href = '/user/new-claim'}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Créer ma première réclamation
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Titre
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reclamations.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-2">{getTypeIcon(rec.type_reclamation)}</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getTypeLabel(rec.type_reclamation)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{rec.titre}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-md truncate">
                                                {rec.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(rec.date_creation).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(rec.date_creation).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(rec.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyClaims;
