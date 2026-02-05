import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ReclamationService from '../../services/reclamation.service';

const ResponsableSiteDashboard = () => {
    const [reclamations, setReclamations] = useState([]);

    useEffect(() => {
        loadReclamations();
    }, []);

    const loadReclamations = async () => {
        try {
            const response = await ReclamationService.getAssignedReclamations();
            setReclamations(response.data);
        } catch (error) {
            console.error("Erreur chargement", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await ReclamationService.updateStatus(id, newStatus);
            loadReclamations();
        } catch (error) {
            alert("Erreur mise à jour statut");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Responsable Site" />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Espace Responsable Site</h1>

                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Réclamations Assignées</h2>
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Titre</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reclamations.map((rec) => (
                                <tr key={rec.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rec.titre}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rec.description}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rec.status}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <select
                                            className="border p-1 rounded"
                                            value={rec.status}
                                            onChange={(e) => handleStatusChange(rec.id, e.target.value)}
                                        >
                                            <option value="EN_ATTENTE">En Attente</option>
                                            <option value="EN_COURS">En Cours</option>
                                            <option value="TRAITEE">Traitée</option>
                                            <option value="REJETEE">Rejetée</option>
                                        </select>
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

export default ResponsableSiteDashboard;
