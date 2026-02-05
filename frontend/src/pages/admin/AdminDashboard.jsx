import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ReclamationService from '../../services/reclamation.service';

const AdminDashboard = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReclamations();
    }, []);

    const loadReclamations = async () => {
        try {
            const response = await ReclamationService.getAllReclamations();
            setReclamations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement", error);
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

        return (
            <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${styles[status] || 'bg-gray-500'}`}>
                {status}
            </span>
        );
    };

    const getTypeIcon = (type) => {
        return type === 'NOTE' ? '📚' : '📅';
    };

    const getAssignmentInfo = (rec) => {
        if (rec.type_reclamation === 'NOTE' && rec.filiere_id) {
            return (
                <div className="text-sm">
                    <div className="font-semibold text-blue-700">📚 Filière</div>
                    <div className="text-gray-600">{rec.filiere || 'N/A'} (ID: {rec.filiere_id})</div>
                </div>
            );
        } else if (rec.type_reclamation === 'ABSENCE' && rec.site_id) {
            return (
                <div className="text-sm">
                    <div className="font-semibold text-green-700">📅 Site</div>
                    <div className="text-gray-600">{rec.site || 'N/A'} (ID: {rec.site_id})</div>
                </div>
            );
        }
        return <span className="text-gray-400 text-sm">Non assignée</span>;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Administrateur" />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">📊 Gestion des Réclamations</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Toutes les Réclamations</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {reclamations.length} réclamation(s) au total
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-600">Chargement...</div>
                    ) : reclamations.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-600">Aucune réclamation pour le moment</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Titre
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Date de création
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Assignation
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Statut
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reclamations.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{rec.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-2">{getTypeIcon(rec.type_reclamation)}</span>
                                                    <span className="text-sm font-medium">
                                                        {rec.type_reclamation === 'NOTE' ? 'Note' : 'Absence'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">
                                                    {rec.titre}
                                                </div>
                                                <div className="text-xs text-gray-500 max-w-xs truncate">
                                                    {rec.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {rec.user}
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
                                                {getAssignmentInfo(rec)}
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
        </div>
    );
};

export default AdminDashboard;
