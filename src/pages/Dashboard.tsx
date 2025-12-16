import { useState, useEffect, useCallback } from "react";
// Importez les icônes nécessaires pour la navigation
import { Menu, FileText, CheckCircle2, XCircle, Archive, LifeBuoy, Database, Home, HelpCircle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// CORRECTION D'IMPORTATION : Chemins explicites pour la résolution
import DocumentUpload from "../components/DocumentUpload.tsx";
import DocumentViewer from "../components/DocumentViewer.tsx"; // Import du visualiseur
import NavigationMenu from "@/components/NavigationMenu"; 

// Importez les hooks nécessaires pour le routage et la navigation
import { useSearchParams, Link, useNavigate } from "react-router-dom"; 

// CORRECTION D'IMPORTATION : Chemin explicite pour la résolution
import DocumentsPage from "./Documents.tsx";
import Profile from "./Profile.tsx";
import Settings from "./Settings.tsx"; 

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
}

// CORRECTION CRITIQUE : Utilisation stricte de localhost pour éviter les blocages inter-IP
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'localhost:5001';

// --- COMPOSANT : Contenu de la Page d'Accueil DYNAMIQUE ---
const HomeContent = ({ refreshKey, onDocumentClick }: { refreshKey: number, onDocumentClick: (doc: Document) => void }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Logique pour simuler l'état "Signé" ou "Pas Signé"
  const isSigned = (doc: Document) => doc.id % 2 === 0; 
  
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
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            Aucun document trouvé. Déposez-en un pour commencer !
          </div>
        ) : (
          documents.map((doc, index) => {
            const signedStatus = isSigned(doc);
            
            return (
              <div
                key={doc.id}
                // Utilise le handler de clic au lieu d'un <a> tag
                onClick={() => onDocumentClick(doc)}
                className="bg-card rounded-xl p-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300 animate-in slide-in-from-bottom cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate text-sm sm:text-base">
                          {doc.nom_fichier}
                        </h3>
                        {/* Affiche la catégorie si ce n'est pas la catégorie par défaut (pour distinguer les Archivés) */}
                        {doc.categorie !== 'Documents en Cours' && (
                            <p className="text-xs text-secondary-foreground/70 mt-0.5 truncate">
                                Classé dans : {doc.categorie}
                            </p>
                        )}
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {formatDisplayDate(doc.date_ajout)}
                        </p>
                      </div>

                      {/* Badge pour l'état "Signé" / "Pas Signé" */}
                      <Badge
                        variant={signedStatus ? "default" : "destructive"}
                        className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs sm:text-sm h-fit ${
                          signedStatus
                            ? "bg-success hover:bg-success/90"
                            : "bg-destructive hover:bg-destructive/90"
                        }`}
                      >
                        {signedStatus ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Signé</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Pas Signé</span>
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
  const [viewingDocument, setViewingDocument] = useState<{ fileName: string; fileUrl: string } | null>(null);

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
    setViewingDocument({ fileName: doc.nom_fichier, fileUrl });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent">
      
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


      <main className="w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
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
        />
      )}
    </div>
  );
};

export default Dashboard;