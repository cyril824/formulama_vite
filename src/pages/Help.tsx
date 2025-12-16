import { ArrowLeft, Lightbulb, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HelpPage = () => {
    return (
        // Conteneur principal avec arrière-plan doux pour l'aide
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
            <div className="container max-w-4xl mx-auto px-4">
                
                {/* Bouton de retour */}
                <Link 
                    to="/dashboard?view=home" 
                    className="flex items-center gap-2 text-primary hover:text-primary-dark mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>

                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                    Centre d'Aide Formulama
                </h1>

                {/* Section 1 : Pourquoi nous avons créé l'application */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <Lightbulb className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            1. Notre Mission : Simplifier la Gestion Documentaire
                        </h2>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        Formulama est né d'un constat simple : la gestion des documents personnels (contrats, impôts, assurances, etc.) est souvent fragmentée et source de stress. Notre objectif principal est de vous offrir un point centralisé, sécurisé et intuitif pour remplir automatiquement vos documents administratifs, les organiser et les suivre.
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Que ce soit pour vérifier rapidement la date d'un document ou pour retrouver un fichier archivé en un clic, Formulama vous redonne le contrôle sur votre administration personnelle.
                    </p>
                </section>

                {/* Section 2 : Comment elle fonctionne */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <Zap className="w-8 h-8 text-blue-500 flex-shrink-0" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            2. Comment Formulama fonctionne ?
                        </h2>
                    </div>
                    
                    <div className="space-y-6 text-gray-600 dark:text-gray-400">
                        {/* Étape 1: Téléchargement */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                                1
                            </div>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Ajout & Stockage Sécurisé :</strong> Vous téléchargez vos documents (PDF, DOCX, PNG) via la zone de dépôt sur la page d'accueil. Chaque fichier est enregistré avec une date d'ajout précise dans notre base de données SQLite.
                            </p>
                        </div>

                        {/* Étape 2: Classement */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                                2
                            </div>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Catégorisation :</strong> Lors de l'enregistrement, vous pouvez classer le document dans une catégorie spécifique (comme "Documents archivés" ou "Base de données perso") via le menu déroulant.
                            </p>
                        </div>
                        
                        {/* Étape 3: Aperçu Dynamique (La nouveauté que vous venez d'ajouter !) */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                                3
                            </div>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Aperçu en Temps Réel :</strong> La section "Aperçu et Documents en Cours" sur la page d'accueil affiche les 4 derniers documents que vous avez ajoutés, quelle que soit leur catégorie. Cela garantit que vos fichiers les plus récents sont toujours à portée de main.
                            </p>
                        </div>

                        {/* Étape 4: Navigation */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                                4
                            </div>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Navigation :</strong> Utilisez le menu latéral pour filtrer et visualiser l'ensemble de vos documents par catégorie (ex: "Documents archivés") ou pour revenir à l'Accueil.
                            </p>
                        </div>
                    </div>
                </section>
                
                <footer className="text-center mt-10 text-sm text-gray-500 dark:text-gray-600">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Notre équipe Formulama vous remercie de votre confiance.
                </footer>
            </div>
        </div>
    );
};

export default HelpPage;