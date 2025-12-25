import React, { useState, useEffect } from 'react';
import { Trash2, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useDocumentContext } from '@/context/DocumentContext';
import { Badge } from '@/components/ui/badge';
import SignaturePad from '@/components/SignaturePad';
import DocumentViewer from '@/components/DocumentViewer';

// CORRECTION CRITIQUE : Utilisation stricte de localhost pour éviter les blocages inter-IP
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// --- INTERFACE MISE À JOUR POUR CORRESPONDRE À LA DB SQLITE ---
interface DocumentItem {
    id: number;
    nom_fichier: string;
    chemin_local: string;
    date_ajout: string;
    categorie?: string;
    is_signed?: boolean | number;
}

// ----------------------------------------------------------------------
// 1. Composant DocumentsPage
// ----------------------------------------------------------------------
interface DocumentsPageProps {
    currentCategory: string; // La catégorie à filtrer (ex: "Documents archivés")
    refreshKey: number;      // Clé pour forcer le rafraîchissement
    onDocumentClick: (doc: DocumentItem) => void; // Fonction pour ouvrir le visualiseur
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ currentCategory, refreshKey, onDocumentClick }) => {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    // États pour le menu contextuel
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<{ fileName: string; fileUrl: string; documentId: number } | null>(null);

    // Hook pour notifier les changements de documents
    const { notifyDocumentChange } = useDocumentContext();

    // URL de l'API Flask (Port 5001) pour la récupération
    const FETCH_API_URL = `${API_BASE_URL}/api/documents/${currentCategory}`;
    // URL de l'API Flask pour la suppression
    const DELETE_API_URL_BASE = `${API_BASE_URL}/api/documents`;

    // Fonction pour forcer le rafraîchissement après une action (suppression ou ajout)
    const [localRefresh, setLocalRefresh] = useState(0);

    const forceRefresh = () => {
        setLocalRefresh(prev => prev + 1);
    };

    // Fonction pour formater la date
    const formatDisplayDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString.split(' ')[0] || 'Date inconnue';
        }
    };

    // Logique pour vérifier si un document est signé
    const isSigned = (doc: DocumentItem) => doc.is_signed === true || doc.is_signed === 1;

    // Handlers pour le menu contextuel
    const handleSignDocument = async () => {
        if (!selectedDoc) return;
        setShowContextMenu(false);
        setShowSignaturePad(true);
    };

    const handleViewDocument = () => {
        if (selectedDoc) {
            setViewingDocument({
                fileName: selectedDoc.nom_fichier,
                fileUrl: `${API_BASE_URL}/api/documents/preview/${selectedDoc.id}`,
                documentId: selectedDoc.id
            });
            setShowContextMenu(false);
            setSelectedDoc(null);
        }
    };

    const handleSignatureComplete = async (signatureData: string) => {
        if (!selectedDoc) return;
        try {
            // Appeler l'API pour marquer le document comme signé et sauvegarder la signature
            const response = await fetch(`${API_BASE_URL}/api/documents/${selectedDoc.id}/sign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ signatureData }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du document');
            }

            console.log('Signature complétée et sauvegardée');
            alert(`Document "${selectedDoc.nom_fichier}" a été signé avec succès!`);
            setShowSignaturePad(false);
            setSelectedDoc(null);
            // Rafraîchir la liste
            forceRefresh();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la signature du document');
        }
    };

    const handleCloseViewer = () => {
        setViewingDocument(null);
    };

    // --- LOGIQUE DE SUPPRESSION ---
    const handleDelete = async (docId: number, docName: string) => {
        // Remplacer window.confirm() par une modale personnalisée dans une version finale.
        // Utilisation de console.log pour respecter les contraintes du Canvas (pas d'alert/confirm)
        if (!window.confirm(`Confirmation de suppression pour ${docName}.`)) {
             console.log("Suppression annulée par l'utilisateur.");
             return;
        }

        setIsDeleting(true);
        try {
            // 🚨 Appel DELETE à l'API sur le port 5001
            const response = await fetch(`${DELETE_API_URL_BASE}/${docId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Document ${docId} supprimé avec succès.`);
                // 1. Mise à jour immédiate du DOM (pour une sensation de rapidité)
                setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
                // 2. Notifier que des documents ont changé
                notifyDocumentChange();
                // 3. Forcer un rafraîchissement complet (en cas d'erreur de cache)
                forceRefresh();
            } else {
                // Tente de lire l'erreur renvoyée par Flask
                const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
                throw new Error(`Échec de la suppression sur le serveur: ${errorData.error}`);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            // Utilisation de console.error pour le débogage
            console.error(`Erreur de suppression: ${err instanceof Error ? err.message : 'Connexion impossible'}`);
        } finally {
            setIsDeleting(false);
        }
    };
    // --- FIN LOGIQUE DE SUPPRESSION ---

    // --- LOGIQUE DE CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                // 🚨 Appel GET à l'API sur le port 5001
                const response = await fetch(FETCH_API_URL);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data: any[] = await response.json();

                // Mappage des tuples Python en objets TypeScript
                const documentsMapped: DocumentItem[] = data.map(item => ({
                    id: item[0],
                    nom_fichier: item[1],
                    chemin_local: item[2],
                    categorie: item[3],
                    date_ajout: item[4],
                    is_signed: item[5] // is_signed peut être 0 ou 1
                }));

                setDocuments(documentsMapped);
                setError(null);
            } catch (err) {
                console.error("Erreur de récupération de l'API:", err);
                setError(`Impossible de charger les documents pour ${currentCategory}. Le serveur Flask est-il démarré ?`);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [currentCategory, refreshKey, localRefresh]); // Déclenchement au changement de catégorie, de clé globale, ou après suppression

    // Rendu d'affichage
    if (loading) return <div className="text-center py-8 text-indigo-600 text-sm sm:text-base">Chargement des documents...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative mt-4 text-xs sm:text-sm">Erreur: {error}</div>;

    return (
        <div className="space-y-4 pt-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="truncate">{currentCategory} ({documents.length} documents)</span>
            </h2>

            <div className="grid gap-3">
                {documents.length > 0 ? (
                    documents.map((doc, index) => {
                        const signedStatus = isSigned(doc);
                        return (
                            <div
                                key={doc.id}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setMenuPosition({
                                        x: rect.right - 200,
                                        y: rect.top + 10
                                    });
                                    setSelectedDoc(doc);
                                    setShowContextMenu(true);
                                }}
                                className="bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:via-indigo-900/20 dark:to-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg dark:shadow-indigo-900/20 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-all duration-300 cursor-pointer w-full max-w-full overflow-hidden border border-transparent dark:border-indigo-500/20 dark:hover:border-indigo-500/40"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-gradient-to-br dark:from-indigo-600/30 dark:to-indigo-800/40 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                    </div>

                                    <div className="flex-1 min-w-0 w-full max-w-full">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 w-full max-w-full">
                                            <div className="flex-1 min-w-0 w-full max-w-full">
                                                <h3 className="font-medium text-gray-900 dark:text-indigo-100 break-words text-xs sm:text-base whitespace-normal">
                                                    {doc.nom_fichier}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-indigo-300/50 mt-0.5">
                                                    {formatDisplayDate(doc.date_ajout)}
                                                </p>
                                            </div>

                                            {/* Badge pour l'état "Signé" / "Non Signé" */}
                                            <Badge
                                                variant={signedStatus ? "default" : "destructive"}
                                                className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs h-fit w-fit ${
                                                    signedStatus
                                                        ? "bg-green-600 hover:bg-green-700 dark:bg-emerald-600/80 dark:hover:bg-emerald-600"
                                                        : "bg-red-600 hover:bg-red-700 dark:bg-red-600/60 dark:hover:bg-red-600/70"
                                                }`}
                                            >
                                                {signedStatus ? (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Signé</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3" />
                                                        <span>Non signé</span>
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton de suppression */}
                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(doc.id, doc.nom_fichier);
                                        }}
                                        disabled={isDeleting}
                                        title={`Supprimer ${doc.nom_fichier}`}
                                        className={`text-red-500 dark:text-red-400 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex-shrink-0 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        Aucun document n'a encore été ajouté dans cette catégorie.
                    </div>
                )}
            </div>

            {/* Menu contextuel - Popup petit */}
            {showContextMenu && selectedDoc && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => {
                            setShowContextMenu(false);
                            setSelectedDoc(null);
                        }}
                    />
                    <div 
                        className="fixed z-50 rounded-2xl shadow-2xl border border-border/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-gradient-to-br from-background via-background to-background/95"
                        style={{
                            left: `${Math.min(menuPosition.x, window.innerWidth - 200)}px`,
                            top: `${Math.min(menuPosition.y, window.innerHeight - 200)}px`,
                            transform: `translate(${menuPosition.x > window.innerWidth - 200 ? '-100%' : '0'}, 0)`,
                            width: 'auto',
                            minWidth: '190px',
                            maxWidth: 'calc(100vw - 30px)'
                        }}
                    >
                        {/* Boutons avec design horizontal/vertical cleaner */}
                        <div className="flex flex-col p-2 sm:p-3 gap-1 sm:gap-2">
                            <button
                                onClick={handleSignDocument}
                                disabled={isSigned(selectedDoc)}
                                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap ${
                                    isSigned(selectedDoc)
                                        ? 'bg-gray-100/50 dark:bg-slate-800/30 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                                }`}
                            >
                                <span>✓</span>
                                <span>Signer</span>
                            </button>
                            <button
                                onClick={handleViewDocument}
                                className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
                            >
                                <span>👁️</span>
                                <span>Voir</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Signature Pad Modal */}
            {showSignaturePad && selectedDoc && (
                <SignaturePad
                    onSign={handleSignatureComplete}
                    onCancel={() => {
                        setShowSignaturePad(false);
                        setSelectedDoc(null);
                    }}
                    documentName={selectedDoc.nom_fichier}
                    documentPath={`${API_BASE_URL}/api/documents/preview/${selectedDoc.id}`}
                    documentType={selectedDoc.nom_fichier.split('.').pop()?.toLowerCase() || 'pdf'}
                />
            )}

            {/* Document Viewer Modal */}
            {viewingDocument && (
                <DocumentViewer
                    fileName={viewingDocument.fileName}
                    fileUrl={viewingDocument.fileUrl}
                    onClose={handleCloseViewer}
                    documentId={viewingDocument.documentId}
                />
            )}
        </div>
    );
};

export default DocumentsPage;