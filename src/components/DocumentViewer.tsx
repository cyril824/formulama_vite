import React, { useMemo } from 'react';
import { X } from 'lucide-react';

interface DocumentViewerProps {
    // Le nom du document à afficher (pour le titre)
    fileName: string; 
    // L'URL de consultation du document (API Flask)
    fileUrl: string; 
    // Fonction de rappel pour fermer la modale
    onClose: () => void; 
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileName, fileUrl, onClose }) => {
    
    // Utilisation de useMemo pour encoder l'URL une seule fois
    const encodedUrl = useMemo(() => {
        // CORRECTION : Nous faisons confiance à l'URL envoyée par le front-end
        // mais nous ajoutons un paramètre anti-cache pour forcer le rechargement
        return `${fileUrl}?_t=${Date.now()}`;
    }, [fileUrl]);

    // Définir la classe MIME type pour une meilleure gestion de l'affichage
    const isImage = /\.(jpe?g|png|gif)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);
    
    let renderElement;

    if (isImage) {
        // Pour les images, utiliser une balise <img>
        renderElement = (
            <img 
                src={encodedUrl} 
                alt={`Aperçu de ${fileName}`} 
                // stopPropagation to prevent accidental closing when clicking the image
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full object-contain"
                // Ajout d'une alerte d'erreur simple pour le débogage
                onError={() => console.error(`Erreur de chargement de l'image pour l'URL: ${encodedUrl}`)}
            />
        );
    } else if (isPdf) {
        // Pour les PDF, utiliser un iframe — avec fallback pour ouvrir dans une nouvelle fenêtre
        // si le navigateur ne supporte pas l'affichage inline (ex: Safari)
        const handleOpenPdfNewWindow = () => {
            window.open(encodedUrl, '_blank');
            onClose(); // Ferme la modale
        };

        renderElement = (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                <iframe
                    key={encodedUrl}
                    src={encodedUrl}
                    title={`Visualiseur de document : ${fileName}`}
                    className="w-full h-full border-none rounded-md"
                    onClick={(e) => e.stopPropagation()}
                />
                {/* Fallback button pour ouvrir dans nouvelle fenêtre */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md border border-yellow-200 dark:border-yellow-700">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">Aperçu PDF limité sur ce navigateur ?</p>
                    <button
                        onClick={handleOpenPdfNewWindow}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 whitespace-nowrap transition-colors flex-shrink-0"
                    >
                        Ouvrir dans une nouvelle fenêtre
                    </button>
                </div>
            </div>
        );
    } else {
         // Pour les autres types (DOCX, etc.), proposer le téléchargement
        renderElement = (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                    Ce type de fichier ({fileName.split('.').pop()}) ne peut pas être affiché directement.
                </p>
                <a 
                    href={encodedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Télécharger {fileName}
                </a>
            </div>
        );
    }

    return (
        // Conteneur principal plein écran et semi-transparent
        <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm"
            // Permet de fermer si on clique sur l'arrière-plan
            onClick={onClose}
        >
            
            {/* Conteneur de la modale */}
            <div 
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col transition-transform duration-300 animate-in zoom-in"
                onClick={(e) => e.stopPropagation()}
                style={{ animationDuration: '300ms' }}
            >
                
                {/* En-tête avec titre et bouton Fermer */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        Visualisation : {fileName}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="Fermer la visualisation"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Corps du visualiseur */}
                <div className="flex-1 p-2 overflow-auto flex items-center justify-center">
                    {renderElement}
                </div>

            </div>
        </div>
    );
};

export default DocumentViewer;