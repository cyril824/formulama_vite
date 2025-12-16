import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Interface pour les données utilisateur
interface UserData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

const Profile = () => {
  const navigate = useNavigate();

  // État des données utilisateur
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "123 Rue de la Paix",
    ville: "Paris",
    codePostal: "75000",
  });

  const [editedData, setEditedData] = useState<UserData>(userData);

  // Gestion de l'édition du profil
  const handleEditProfile = () => {
    setEditedData(userData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent">
      {/* Header avec bouton retour */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-[var(--shadow-soft)]">
        <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">Mon Profil</h1>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Section Informations Personnelles */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Informations Personnelles
              </h2>
              {!isEditingProfile && (
                <Button
                  onClick={handleEditProfile}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                      Prénom
                    </label>
                    <Input
                      value={editedData.prenom}
                      onChange={(e) => handleInputChange("prenom", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                      Nom
                    </label>
                    <Input
                      value={editedData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                    Téléphone
                  </label>
                  <Input
                    value={editedData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                    Adresse
                  </label>
                  <Input
                    value={editedData.adresse}
                    onChange={(e) => handleInputChange("adresse", e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                      Ville
                    </label>
                    <Input
                      value={editedData.ville}
                      onChange={(e) => handleInputChange("ville", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                      Code Postal
                    </label>
                    <Input
                      value={editedData.codePostal}
                      onChange={(e) => handleInputChange("codePostal", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Prénom</p>
                    <p className="font-medium text-foreground text-sm sm:text-base">
                      {userData.prenom}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom</p>
                    <p className="font-medium text-foreground text-sm sm:text-base">
                      {userData.nom}
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground text-sm sm:text-base">
                    {userData.email}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Téléphone</p>
                  <p className="font-medium text-foreground text-sm sm:text-base">
                    {userData.telephone}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse</p>
                  <p className="font-medium text-foreground text-sm sm:text-base">
                    {userData.adresse}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Ville</p>
                    <p className="font-medium text-foreground text-sm sm:text-base">
                      {userData.ville}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Code Postal</p>
                    <p className="font-medium text-foreground text-sm sm:text-base">
                      {userData.codePostal}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Section Statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Documents", value: "42" },
              { label: "Archivés", value: "8" },
              { label: "En cours", value: "34" },
              { label: "Signés", value: "35" },
            ].map((stat, index) => (
              <Card key={index} className="p-3 sm:p-6 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
