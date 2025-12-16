import React, { useState } from 'react';
import { Upload } from 'lucide-react';

// Définitions des catégories disponibles (doivent correspondre aux noms dans la BDD)
const CATEGORIES = [
    "Documents archivés",
    "Documents supportés", 
    "Base de données perso"
];

// Le composant attend la fonction de rappel pour rafraîchir le dashboard après succès
interface DocumentUploadProps {
    onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
    // État pour gérer le fichier sélectionné
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    
    // État pour gérer la catégorie choisie par l'utilisateur
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]); 

    // Définition de l'URL du serveur API — utilise le port 5001 pour Flask
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

    // Gère la sélection du fichier via l'input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            // Seul le premier fichier est sélectionné
            const file = event.target.files[0];
            setSelectedFile(file);
            setUploadMessage(`Fichier sélectionné : ${file.name}.`);
        }
    };

    // Gère l'envoi du fichier et l'enregistrement dans la BDD
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Veuillez sélectionner un fichier d\'abord.');
            return;
        }

        setIsUploading(true);
        setUploadMessage(`Enregistrement de ${selectedFile.name} en cours...`);
        
        // 1. Préparation des données pour l'envoi (inclut le fichier réel)
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('nom', selectedFile.name);
        formData.append('categorie', selectedCategory);
        
        // La simulation du chemin local est gérée par le serveur Python qui sauve le fichier
        // dans le dossier /data et retourne un chemin complet au client.

        try {
            // 🚨 Appel POST à l'API, envoi du FormData
            const response = await fetch(`${API_BASE_URL}/api/documents/ajouter`, {
                method: 'POST',
                // IMPORTANT: Ne pas définir Content-Type. Le navigateur le fait automatiquement
                // avec la bonne boundary pour le FormData.
                body: formData, 
            });

            const result = await response.json();

            if (response.ok) {
                setUploadMessage(`✅ Succès ! ${selectedFile.name} enregistré dans "${selectedCategory}".`);
                setSelectedFile(null); 
                
                // Appelle la fonction passée par le parent (Dashboard) pour forcer le rafraîchissement
                onUploadSuccess(); 
            } else {
                setUploadMessage(`❌ Erreur API: ${result.error || 'Impossible d\'enregistrer.'}`);
            }
        } catch (error) {
            setUploadMessage('❌ Erreur de connexion au serveur Flask. Assurez-vous qu\'il est démarré sur le port 5001.');
            console.error('Erreur POST:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg border border-indigo-100 space-y-4 w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Télécharger un document
            </h2>
            
            <div className="flex flex-col space-y-4">
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-10 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    <input 
                        type="file" 
                        id="fileInput" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="application/pdf, .doc, .docx, image/jpeg, image/png"
                    />
                    <Upload className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm sm:text-base text-gray-600">
                        Cliquez pour parcourir vos fichiers et déposez votre document
                    </p>
                    {/* <p className="text-sm text-gray-400 mt-1">
                        ou cliquez pour parcourir vos fichiers */}
                        <br/>
                        <span className="text-xs sm:text-sm text-gray-400">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</span>
                    {/* </p> */}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Ranger dans :</label>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm w-full sm:w-auto"
                            disabled={isUploading}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button 
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                        className={`px-4 py-2 rounded-md font-semibold text-white transition-colors text-sm w-full sm:w-auto whitespace-nowrap ${
                            (isUploading || !selectedFile) 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isUploading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {/* Affichage du message de statut */}
            {uploadMessage && (
                <div className={`mt-3 p-3 rounded-md text-xs sm:text-sm ${
                    uploadMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {uploadMessage}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;