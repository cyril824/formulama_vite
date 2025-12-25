import { useState, useEffect, useCallback } from "react";
// Importez les icônes nécessaires pour la navigation
import { Menu, FileText, CheckCircle2, XCircle, Archive, LifeBuoy, Home, HelpCircle, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// CORRECTION D'IMPORTATION : Chemins explicites pour la résolution
import DocumentUpload from "../components/DocumentUpload.tsx";
import DocumentViewer from "../components/DocumentViewer.tsx"; // Import du visualiseur
import NavigationMenu from "@/components/NavigationMenu";
import SignaturePad from "@/components/SignaturePad"; 

// Importez les hooks nécessaires pour le routage et la navigation
import { useSearchParams, Link, useNavigate } from "react-router-dom"; 

// CORRECTION D'IMPORTATION : Chemin explicite pour la résolution
import DocumentsPage from "./Documents.tsx";
import Profile from "./Profile.tsx";
import SettingsPage from "./Settings.tsx"; 

// --- DÉFINITIONS STATIQUES ---
const CATEGORIES = [
  { name: "Documents archivés", icon: Archive, url: "Documents archivés" },
  { name: "Documents supportés", icon: LifeBuoy, url: "Documents supportés" },
];

// --- INTERFACE MISE À JOUR POUR CORRESPONDRE À LA DB SQLITE ---
interface Document {
  id: number; // L'ID de la DB est un nombre
  nom_fichier: string; // Nom du fichier
  chemin_local: string;
  categorie: string; // Utilisé pour afficher si c'est "archivé" ou autre
  date_ajout: string; // La date au format chaîne (ex: "2025-11-27 10:30:00")
  is_signed?: boolean | number; // Peut être true/false ou 0/1 de SQLite
}

// CORRECTION CRITIQUE : Utilisation stricte de localhost pour éviter les blocages inter-IP
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// --- COMPOSANT : Contenu de la Page d'Accueil DYNAMIQUE ---
const HomeContent = ({ refreshKey, onDocumentClick }: { refreshKey: number, onDocumentClick: (doc: Document) => void }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  // Fonction pour charger les documents récents
  const fetchRecentDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Appel au nouvel endpoint que nous avons créé dans app_server.py
      const response = await fetch(`${API_BASE_URL}/api/documents/recents`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error("Erreur de chargement des documents récents:", err);
      setError("Impossible de charger les documents récents. Vérifiez le serveur API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Exécute la fonction de chargement au montage et lorsque refreshKey change
  useEffect(() => {
    fetchRecentDocuments();
  }, [fetchRecentDocuments, refreshKey]);

  // Fonction utilitaire pour le formatage de la date (simple)
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Formatage simple pour l'affichage (ex: "15 Nov 2025")
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString.split(' ')[0] || 'Date inconnue'; // Retourne juste la partie date en cas d'erreur
    }
  };

  // Logique pour simuler l'état "Signé" ou "Non Signé"
  // Par défaut, tous les documents sont "Non signé" quand ils sont ajoutés
  const isSigned = (doc: Document) => doc.is_signed === true || doc.is_signed === 1; 
  
  const handleSignDocument = async () => {
    if (!selectedDoc) return;
    setShowContextMenu(false);
    setShowSignaturePad(true);
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
      fetchRecentDocuments();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la signature du document');
    }
  };

  const handleViewDocument = () => {
    if (selectedDoc) {
      onDocumentClick(selectedDoc);
      setShowContextMenu(false);
      setSelectedDoc(null);
    }
  };
  
  // Affichage de l'état de chargement
  if (isLoading) {
    return <div className="p-8 text-center text-primary/70">Chargement des documents récents...</div>;
  }
  
  // Affichage des erreurs
  if (error) {
    return <div className="p-8 text-center text-destructive">🛑 Erreur: {error}</div>;
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Aperçu et Documents en Cours</h2>
        <span className="text-sm text-muted-foreground">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </span>
      </div>
      
      <div className="grid gap-3">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-indigo-500/30 rounded-lg bg-gradient-to-br from-indigo-950/30 to-slate-900/20">
            Aucun document trouvé. Déposez-en un pour commencer !
          </div>
        ) : (
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
                className="bg-card dark:bg-gradient-to-r dark:from-slate-800 dark:via-indigo-900/20 dark:to-slate-800 rounded-xl p-4 shadow-[var(--shadow-soft)] dark:shadow-lg dark:shadow-indigo-900/20 hover:shadow-[var(--shadow-medium)] dark:hover:shadow-indigo-900/30 transition-all duration-300 animate-in slide-in-from-bottom cursor-pointer w-full max-w-full overflow-hidden border border-transparent dark:border-indigo-500/20 dark:hover:border-indigo-500/40 hover:dark:bg-gradient-to-r hover:dark:from-slate-800/80 hover:dark:via-indigo-900/30 hover:dark:to-slate-800/80"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-gradient-to-br dark:from-indigo-600/30 dark:to-indigo-800/40 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary dark:text-indigo-400" />
                  </div>

                  <div className="flex-1 min-w-0 w-full max-w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 w-full max-w-full">
                      <div className="flex-1 min-w-0 w-full max-w-full">
                        <h3 className="font-medium text-foreground dark:text-indigo-100 break-words text-xs sm:text-base whitespace-normal">
                          {doc.nom_fichier}
                        </h3>
                        {/* Affiche la catégorie si ce n'est pas la catégorie par défaut (pour distinguer les Archivés) */}
                        {doc.categorie !== 'Documents en Cours' && (
                            <p className="text-xs text-secondary-foreground/70 dark:text-indigo-300/60 mt-0.5 truncate">
                                Classé dans : {doc.categorie}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground dark:text-indigo-300/50 mt-0.5">
                          {formatDisplayDate(doc.date_ajout)}
                        </p>
                      </div>

                      {/* Badge pour l'état "Signé" / "Non Signé" */}
                      <Badge
                        variant={signedStatus ? "default" : "destructive"}
                        className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs h-fit w-fit ${
                          signedStatus
                            ? "bg-success hover:bg-success/90 dark:bg-emerald-600/80 dark:hover:bg-emerald-600"
                            : "bg-destructive hover:bg-destructive/90 dark:bg-red-600/60 dark:hover:bg-red-600/70"
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
              </div>
            );
          })
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
    </div>
  );
};


// --- COMPOSANT DE NAVIGATION LATÉRALE DYNAMIQUE ---
const SidebarContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  
  // Lit le paramètre 'view' de l'URL ou utilise 'home' par défaut
  const currentView = searchParams.get('view') || 'home'; 

  // Gère la déconnexion
  const handleLogout = () => {
    navigate('/'); 
  };


  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Formulama</h2>
        <p className="text-sm text-muted-foreground">Menu de navigation</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        
        {/* Lien d'Accueil */}
        <SheetClose asChild>
            <Link 
                to="/dashboard?view=home" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    currentView === 'home'
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-foreground hover:bg-primary/10"
                }`}
            >
                <Home className="w-5 h-5" />
                Accueil
            </Link>
        </SheetClose>


        <h3 className="text-xs font-semibold uppercase text-muted-foreground mt-4 pt-4 border-t border-border">Gestion des Documents</h3>

        {/* Liens pour les catégories dynamiques (Documents) */}
        {CATEGORIES.map((item) => (
          <SheetClose asChild key={item.name}>
            <Link
                // Met à jour le paramètre 'view' avec la catégorie
                to={`/dashboard?view=${item.url}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentView === item.url
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:bg-primary/10"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          </SheetClose>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Link to="/aide" className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-primary/10 transition-colors">
            <HelpCircle className="w-5 h-5" />
            Aide
        </Link>
      </div>
    </div>
  );
};


// --- COMPOSANT PRINCIPAL DASHBOARD ---
const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentView = searchParams.get('view') || 'home'; 

  // NOUVEAU : État pour le document actuellement visualisé (pour la modale)
  const [viewingDocument, setViewingDocument] = useState<{ fileName: string; fileUrl: string; documentId: number } | null>(null);

  // L'état qui force le rafraîchissement global après un upload/suppression
  const [globalRefreshKey, setGlobalRefreshKey] = useState(0); 
  
  // Fonction de rappel pour l'upload (incrémente la clé)
  const handleDocumentUploaded = () => {
      setGlobalRefreshKey(prevKey => prevKey + 1); 
  };

  // NOUVEAU : Fonction pour ouvrir le visualiseur
  const handleViewDocument = (doc: Document) => {
    // Utiliser localhost:5001 pour forcer la communication inter-port locale
    const fileUrl = `${API_BASE_URL}/api/documents/ouvrir/${doc.nom_fichier}`;
    setViewingDocument({ fileName: doc.nom_fichier, fileUrl, documentId: doc.id });
  };

  // NOUVEAU : Fonction pour fermer le visualiseur
  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  // Fonctions pour le menu profil
  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleViewSettings = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const isDocumentCategory = CATEGORIES.some(cat => cat.url === currentView);

  const currentCategoryName = isDocumentCategory ? currentView : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent overflow-hidden flex flex-col">
      
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-[var(--shadow-soft)]">
        <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent /> 
            </SheetContent>
          </Sheet>

          <h1 className="text-lg sm:text-xl font-bold text-foreground">Formulama</h1>
          
          {/* Menu déroulant de profil en haut à droite */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground" title="Profil">
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={handleViewProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleViewSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>


      <main className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">
        
        {/* Upload Section (Toujours visible en haut) */}
        {currentView === 'home' && (
      <div className="animate-in fade-in duration-500">
        {/* L'upload déclenche le rafraîchissement de la liste en incrémentant globalRefreshKey */}
        <DocumentUpload onUploadSuccess={handleDocumentUploaded} />
      </div>
)}
        {/* --- CONTENU DYNAMIQUE (Accueil vs Documents) --- */}
        <div className="space-y-4 pt-4">
            {currentView === 'home' ? (
                // 1. Affiche le contenu DYNAMIQUE de l'Accueil (liste de signature)
                <HomeContent 
                  refreshKey={globalRefreshKey} // Passe la clé pour forcer le rafraîchissement
                  onDocumentClick={handleViewDocument} // Passe la fonction d'ouverture
                />
            ) : isDocumentCategory ? (
                // 2. Affiche la page des documents dynamiques
                <DocumentsPage 
                    currentCategory={currentCategoryName} 
                    refreshKey={globalRefreshKey} // Clé pour le rafraîchissement après upload/delete
                    onDocumentClick={handleViewDocument} // Passe la fonction d'ouverture
                />
            ) : (
                // 3. Cas par défaut 
                <div>Sélectionnez une option valide dans le menu.</div>
            )}
        </div>
        
      </main>

      {/* NOUVEAU : Modale de visualisation conditionnelle */}
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

export default Dashboard;