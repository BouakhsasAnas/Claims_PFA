import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement stats', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'EN_ATTENTE': 'bg-yellow-500',
            'EN_COURS': 'bg-blue-500',
            'TRAITEE': 'bg-green-500',
            'REJETEE': 'bg-red-500',
            'TOTAL': 'bg-purple-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'EN_ATTENTE': 'En Attente',
            'EN_COURS': 'En Cours',
            'TRAITEE': 'Traitées',
            'REJETEE': 'Rejetées',
            'TOTAL': 'Total'
        };
        return labels[status] || status;
    };

    const getStatusIcon = (status) => {
        const icons = {
            'EN_ATTENTE': '⏳',
            'EN_COURS': '🔄',
            'TRAITEE': '✅',
            'REJETEE': '❌',
            'TOTAL': '📊'
        };
        return icons[status] || '📋';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Administrateur" />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">📊 Statistiques des Réclamations</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(stats).map(([status, count]) => (
                            <div key={status} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="text-4xl mr-3">{getStatusIcon(status)}</span>
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            {getStatusLabel(status)}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="text-4xl font-bold text-gray-800">{count}</div>
                                    <div className={`${getStatusColor(status)} w-3 h-3 rounded-full`}></div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    {status === 'TOTAL' ? 'réclamations au total' : 'réclamations'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-red-600">Erreur lors du chargement des statistiques</p>
                    </div>
                )}

                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">📈 Résumé</h2>
                    <div className="space-y-2 text-gray-700">
                        <p>• Les réclamations sont automatiquement assignées selon leur type</p>
                        <p>• <strong>NOTE</strong> → Responsable Filière</p>
                        <p>• <strong>ABSENCE</strong> → Responsable Site</p>
                        <p>• Les responsables peuvent modifier le statut des réclamations</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
