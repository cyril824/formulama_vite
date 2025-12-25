import * as React from 'react';
import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface DocumentViewerProps {
    // Le nom du document à afficher (pour le titre)
    fileName: string; 
    // L'URL de consultation du document (API Flask)
    fileUrl: string; 
    // Fonction de rappel pour fermer la modale
    onClose: () => void;
    // ID du document (pour récupérer la signature)
    documentId?: number;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileName, fileUrl, onClose, documentId }) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

    // Définir la classe MIME type pour une meilleure gestion de l'affichage
    const isImage = /\.(jpe?g|png|gif)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);

    // Charger le document en tant que blob
    useEffect(() => {
        const loadDocument = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(fileUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
            } catch (err) {
                console.error('Erreur lors du chargement du document:', err);
                setError('Impossible de charger le document');
            } finally {
                setIsLoading(false);
            }
        };

        loadDocument();

        // Cleanup
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [fileUrl]);

    // Charger la signature si le documentId est fourni
    useEffect(() => {
        if (!documentId) {
            console.log('No documentId provided');
            setSignatureUrl(null);
            return;
        }

        console.log('Loading signature for document ID:', documentId);
        let isMounted = true;

        const loadSignature = async () => {
            try {
                const signaturePath = `${API_BASE_URL}/api/documents/${documentId}/signature`;
                console.log('Fetching signature from:', signaturePath);
                
                const response = await fetch(signaturePath);
                console.log('Signature response status:', response.status);
                
                if (!isMounted) return;
                
                if (response.ok) {
                    const blob = await response.blob();
                    console.log('Signature blob size:', blob.size);
                    const url = URL.createObjectURL(blob);
                    console.log('Signature blob URL created:', url);
                    setSignatureUrl(url);
                } else {
                    console.log('Signature not found (status:', response.status, ')');
                    setSignatureUrl(null);
                }
            } catch (err) {
                console.error('Erreur lors du chargement de la signature:', err);
                if (isMounted) {
                    setSignatureUrl(null);
                }
            }
        };

        loadSignature();

        // Cleanup
        return () => {
            isMounted = false;
        };
    }, [documentId, API_BASE_URL]);
    

    let renderElement;

    if (isLoading) {
        renderElement = (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Chargement du document...</p>
            </div>
        );
    } else if (error) {
        renderElement = (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <a
                    href={fileUrl}
                    download={fileName}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Télécharger le fichier
                </a>
            </div>
        );
    } else if (!blobUrl) {
        renderElement = (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-600 dark:text-gray-400">Le document n'a pas pu être chargé</p>
            </div>
        );
    } else if (isImage) {
        // Pour les images, utiliser une balise <img>
        renderElement = (
            <div className="w-full h-full flex items-center justify-center relative">
                <img 
                    src={blobUrl} 
                    alt={`Aperçu de ${fileName}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-full object-contain rounded-md"
                    onError={() => {
                        console.error(`Erreur de chargement de l'image`);
                        setError('Impossible de charger l\'image');
                    }}
                />
                {/* Afficher la signature par-dessus si elle existe */}
                {signatureUrl && (
                    <img
                        src={signatureUrl}
                        alt="Signature"
                        className="absolute bottom-8 right-8 h-24 opacity-80 drop-shadow-lg z-50"
                        onError={() => console.error('Erreur de chargement de la signature')}
                    />
                )}
            </div>
        );
    } else if (isPdf) {
        // Pour les PDF, utiliser un iframe avec le blob URL
        renderElement = (
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-gray-100 dark:bg-gray-900">
                <iframe
                    src={blobUrl}
                    title={`Visualiseur de document : ${fileName}`}
                    className="w-full h-full border-none"
                    onClick={(e) => e.stopPropagation()}
                    allow="fullscreen"
                />
                {/* Afficher la signature par-dessus le PDF si elle existe */}
                {signatureUrl && (
                    <div className="absolute bottom-8 right-8 z-50">
                        <img
                            src={signatureUrl}
                            alt="Signature"
                            className="h-24 opacity-80 drop-shadow-lg"
                            onError={() => console.error('Erreur de chargement de la signature')}
                        />
                    </div>
                )}
                {/* Fallback button pour télécharger si l'iframe ne fonctionne pas */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 bg-yellow-50 dark:bg-yellow-900/30 p-2 sm:p-3 rounded-md border border-yellow-200 dark:border-yellow-700">
                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">Aperçu PDF limité ?</p>
                    <a
                        href={fileUrl}
                        download={fileName}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-xs sm:text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1 justify-center flex-shrink-0 w-fit"
                    >
                        <Download className="w-3 h-3" />
                        Télécharger
                    </a>
                </div>
            </div>
        );
    } else {
         // Pour les autres types (DOCX, etc.), proposer le téléchargement
        renderElement = (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 w-full gap-4">
                <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300">
                    Ce type de fichier ({fileName.split('.').pop()}) ne peut pas être affiché directement.
                </p>
                <a 
                    href={fileUrl}
                    download={fileName}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Télécharger {fileName}
                </a>
            </div>
        );
    }

    return (
        // Conteneur principal plein écran et semi-transparent
        <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-0 sm:p-4 transition-opacity duration-300 backdrop-blur-sm overflow-hidden"
            onClick={onClose}
        >
            
            {/* Conteneur de la modale */}
            <div 
                className="relative bg-white dark:bg-gray-800 w-full h-full sm:h-[95vh] sm:rounded-lg sm:shadow-2xl sm:max-w-7xl flex flex-col transition-transform duration-300 animate-in zoom-in"
                onClick={(e) => e.stopPropagation()}
                style={{ animationDuration: '300ms' }}
            >
                
                {/* En-tête avec titre et bouton Fermer */}
                <div className="flex justify-between items-center p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 gap-2 bg-white dark:bg-gray-800">
                    <h2 className="text-xs sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {fileName}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                        title="Fermer la visualisation"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
                
                {/* Corps du visualiseur */}
                <div className="flex-1 overflow-hidden w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    {renderElement}
                </div>

            </div>
        </div>
    );
};

export default DocumentViewer;