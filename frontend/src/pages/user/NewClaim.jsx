import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ReclamationService from '../../services/reclamation.service';
import UploadService from '../../services/upload.service';

const NewClaim = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [typeReclamation, setTypeReclamation] = useState('NOTE');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => {
            const isValidType = file.type.match(/^(image\/(png|jpg|jpeg|gif)|application\/pdf)$/);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            return isValidType && isValidSize;
        });

        if (validFiles.length !== selectedFiles.length) {
            setError('Certains fichiers ont été ignorés (type ou taille invalide)');
            setTimeout(() => setError(''), 3000);
        }

        setFiles(validFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setUploading(true);

        try {
            // Upload files first
            const uploadedFiles = [];
            for (const file of files) {
                try {
                    const response = await UploadService.uploadFile(file);
                    uploadedFiles.push(response.data.url);
                } catch (err) {
                    console.error('Error uploading file:', err);
                }
            }

            // Create reclamation with uploaded file URLs
            await ReclamationService.createReclamation(titre, description, typeReclamation, uploadedFiles);
            setMessage('Réclamation créée avec succès !');
            setTitre('');
            setDescription('');
            setTypeReclamation('NOTE');
            setFiles([]);

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/user/my-claims';
            }, 2000);
        } catch (error) {
            setError('Erreur lors de la création de la réclamation.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Etudiant" />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">📝 Nouvelle Réclamation</h1>

                <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                    {message && (
                        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded border border-green-300">
                            ✅ {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Type */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-3">
                                Type de réclamation
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    style={{ borderColor: typeReclamation === 'NOTE' ? '#3B82F6' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="NOTE"
                                        checked={typeReclamation === 'NOTE'}
                                        onChange={(e) => setTypeReclamation(e.target.value)}
                                        className="mr-3 w-4 h-4"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800">📚 Problème de Note</div>
                                        <div className="text-sm text-gray-600">
                                            Réclamation concernant les notes
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    style={{ borderColor: typeReclamation === 'ABSENCE' ? '#3B82F6' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="ABSENCE"
                                        checked={typeReclamation === 'ABSENCE'}
                                        onChange={(e) => setTypeReclamation(e.target.value)}
                                        className="mr-3 w-4 h-4"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800">📅 Problème d'Absence</div>
                                        <div className="text-sm text-gray-600">
                                            Réclamation concernant les absences
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Titre */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Titre
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                placeholder="Ex: Erreur dans la note du module X"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Description détaillée
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="6"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Décrivez votre réclamation en détail..."
                                required
                            ></textarea>
                        </div>

                        {/* Pièces jointes */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Pièces jointes (optionnel)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg,.gif"
                                onChange={handleFileChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Formats acceptés: PDF, PNG, JPG, GIF (max 5MB par fichier)
                            </p>
                            {files.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Fichiers sélectionnés ({files.length}):
                                    </p>
                                    <ul className="space-y-1">
                                        {files.map((file, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                <span className="mr-2">📎</span>
                                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {uploading ? '⏳ Envoi en cours...' : '📤 Soumettre la réclamation'}
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.href = '/user/my-claims'}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewClaim;
