import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useDocumentContext } from '@/context/DocumentContext';

// Définitions des catégories disponibles (doivent correspondre aux noms dans la BDD)
const CATEGORIES = [
    "Documents archivés",
    "Documents supportés", 
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
    const [messageVisible, setMessageVisible] = useState<boolean>(true);
    
    // État pour gérer la catégorie choisie par l'utilisateur
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    
    // Hook pour notifier les changements de documents
    const { notifyDocumentChange } = useDocumentContext(); 

    // Définition de l'URL du serveur API — utilise le port 5001 pour Flask
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

    // Efface le message automatiquement après 4 secondes pour les messages de succès
    useEffect(() => {
        if (uploadMessage.startsWith('✅')) {
            const timer = setTimeout(() => {
                setMessageVisible(false);
                // Efface complètement le message après l'animation de fade
                const fadeTimer = setTimeout(() => {
                    setUploadMessage('');
                    setMessageVisible(true);
                }, 500);
                return () => clearTimeout(fadeTimer);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [uploadMessage]);

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
                
                // Notifier que des documents ont changé
                notifyDocumentChange();
                
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
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-blue-900/50 dark:to-slate-800 rounded-xl p-4 sm:p-8 shadow-lg dark:shadow-2xl border border-indigo-100 dark:border-blue-800/40 space-y-4 w-full max-w-full overflow-hidden">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-blue-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">Télécharger un document</span>
            </h2>
            
            <div className="flex flex-col space-y-4 min-w-0 w-full max-w-full">
                <div 
                    className="border-2 border-dashed border-indigo-300 dark:border-blue-400/80 rounded-lg p-4 sm:p-10 text-center hover:border-indigo-400 dark:hover:border-blue-300 transition-all duration-300 cursor-pointer w-full bg-gray-50 dark:bg-gradient-to-br dark:from-blue-800/50 dark:via-blue-700/35 dark:to-blue-800/50 dark:hover:from-blue-800/60 dark:hover:via-blue-700/45 dark:hover:to-blue-800/60 relative overflow-hidden group backdrop-blur-sm"
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-stone-500/0 dark:via-stone-400/15 dark:to-stone-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input 
                        type="file" 
                        id="fileInput" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="application/pdf, .doc, .docx, image/jpeg, image/png"
                    />
                    <div className="relative z-10">
                        <Upload className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-indigo-500 dark:text-blue-300 mb-2 group-hover:text-indigo-600 dark:group-hover:text-blue-400 transition-colors" />
                        <p className="text-sm sm:text-base text-indigo-700 dark:text-indigo-50 break-words">
                            Cliquez pour parcourir vos fichiers et déposez votre document
                        </p>
                        <br/>
                        <span className="text-xs sm:text-sm text-indigo-600 dark:text-stone-200">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-blue-100 whitespace-nowrap flex-shrink-0">Ranger dans :</label>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="p-2 border border-gray-300 dark:border-blue-700/60 rounded-md shadow-sm text-xs sm:text-sm w-full min-w-0 max-w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-blue-100 dark:hover:border-blue-500/60 transition-colors"
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
                        className={`px-4 py-2 rounded-md font-semibold text-white transition-all duration-300 text-sm flex-shrink-0 whitespace-nowrap ${
                            (isUploading || !selectedFile) 
                                ? 'bg-gray-400 dark:bg-slate-700 cursor-not-allowed opacity-60' 
                                : 'bg-indigo-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 hover:bg-indigo-700 dark:hover:from-blue-500 dark:hover:to-blue-600 shadow-md dark:shadow-lg dark:shadow-blue-900/40'
                        }`}
                    >
                        {isUploading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {/* Affichage du message de statut */}
            {uploadMessage && (
                <div className={`mt-3 p-3 rounded-md text-xs sm:text-sm break-words transition-opacity duration-500 ${messageVisible ? 'opacity-100' : 'opacity-0'} ${
                    uploadMessage.startsWith('✅') 
                        ? 'bg-green-100 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-300 border border-green-300 dark:border-emerald-700/50' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700/50'
                }`}>
                    {uploadMessage}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;