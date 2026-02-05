import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import AdminService from '../../services/admin.service';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        role_id: '',
        filiere_id: '',
        site_id: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersRes, rolesRes, filieresRes, sitesRes] = await Promise.all([
                AdminService.getAllUsers(),
                AdminService.getRoles(),
                AdminService.getFilieres(),
                AdminService.getSites()
            ]);

            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            setFilieres(filieresRes.data);
            setSites(sitesRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement données", error);
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        const roleId = roles.find(r => r.nom === user.role)?.id || '';
        const filiereId = filieres.find(f => f.nom === user.filiere)?.id || '';
        const siteId = sites.find(s => s.nom === user.site)?.id || '';

        setFormData({
            nom: user.nom,
            email: user.email,
            password: '',
            role_id: roleId,
            filiere_id: filiereId,
            site_id: siteId
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({
            nom: '',
            email: '',
            password: '',
            role_id: '',
            filiere_id: '',
            site_id: ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                role_id: parseInt(formData.role_id),
                filiere_id: formData.filiere_id ? parseInt(formData.filiere_id) : null,
                site_id: formData.site_id ? parseInt(formData.site_id) : null
            };

            if (editingUser) {
                await AdminService.updateUser(editingUser.id, payload);
            } else {
                await AdminService.createUser(payload);
            }

            setShowModal(false);
            loadData();
        } catch (error) {
            alert("Erreur lors de la sauvegarde");
            console.error(error);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        try {
            await AdminService.deleteUser(userId);
            loadData();
        } catch (error) {
            alert("Erreur lors de la suppression");
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Administrateur" />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">👥 Gestion des Utilisateurs</h1>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        ➕ Nouvel Utilisateur
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-600">Chargement...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Nom
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Filière
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Site
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            #{user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {user.nom}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {user.role || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.filiere || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.site || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-600 hover:text-blue-800 mr-3 font-semibold"
                                            >
                                                ✏️ Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold"
                                            >
                                                🗑️ Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Mot de passe {editingUser && '(laisser vide pour ne pas changer)'}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Rôle</label>
                                    <select
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.role_id}
                                        onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Filière (optionnel)</label>
                                    <select
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.filiere_id}
                                        onChange={(e) => setFormData({ ...formData, filiere_id: e.target.value })}
                                    >
                                        <option value="">Aucune</option>
                                        {filieres.map(filiere => (
                                            <option key={filiere.id} value={filiere.id}>{filiere.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">Site (optionnel)</label>
                                    <select
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.site_id}
                                        onChange={(e) => setFormData({ ...formData, site_id: e.target.value })}
                                    >
                                        <option value="">Aucun</option>
                                        {sites.map(site => (
                                            <option key={site.id} value={site.id}>{site.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                                    >
                                        💾 Enregistrer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
