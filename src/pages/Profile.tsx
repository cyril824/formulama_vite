import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Interface pour les données utilisateur
interface UserData {
  // Informations civiles
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  situation: string;
  nombreEnfants: string;
  
  // Pièce d'identité
  typeDocument: string;
  numeroDocument: string;
  dateExpiration: string;
  numeroSecuriteSociale: string;
  
  // Coordonnées
  email: string;
  telephone: string;
  telephoneSecondaire: string;
  
  // Adresse
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  
  // Adresse secondaire (domicile ou travail)
  adresseSecondaire: string;
  codePostalSecondaire: string;
  villeSecondaire: string;
  
  // Permis de conduire
  typePermis: string;
  numeroPermis: string;
  dateValiditePermis: string;
  
  // Professionnels
  profession: string;
  entreprise: string;
  numeroSiret: string;
  poste: string;
  dateEmbauche: string;
  salaire: string;
  typeContrat: string;
  
  // Coordonnées professionnelles
  adresseProfessionnelle: string;
  telephoneProfessionnel: string;
  emailProfessionnel: string;
  
  // Informations bancaires
  iban: string;
  bic: string;
  nomBanque: string;
  
  // Fiscalité
  numeroFiscal: string;
  numeroTVA: string;
  revenuAnnuel: string;
  
  // Santé
  numeroMutuelle: string;
  mutuelle: string;
  groupeSanguin: string;
  allergies: string;
  
  // Assurances
  numeroAssuranceVehicule: string;
  assuranceVehicule: string;
  numeroAssuranceHabitation: string;
  assuranceHabitation: string;
  numeroAssuranceResponsabilite: string;
  
  // Véhicule
  marqueVehicule: string;
  modeleVehicule: string;
  immatriculationVehicule: string;
  
  // Éducation
  diplomeNiveau: string;
  diplomeSpecialite: string;
  etablissementEtudes: string;
  dateObtention: string;
  
  // Contact d'urgence
  nomUrgence: string;
  telephoneUrgence: string;
  relationUrgence: string;
  

}

const Profile = () => {
  const navigate = useNavigate();

  // État des données utilisateur avec valeurs par défaut
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    // Civiles
    civilite: "M",
    nom: "Dupont",
    prenom: "Jean",
    dateNaissance: "1990-01-15",
    lieuNaissance: "Paris",
    nationalite: "Française",
    situation: "Marié(e)",
    nombreEnfants: "2",
    
    // Identité
    typeDocument: "Passeport",
    numeroDocument: "AB123456",
    dateExpiration: "2030-06-30",
    numeroSecuriteSociale: "1 90 01 75 123 456 78",
    
    // Coordonnées
    email: "jean.dupont@example.com",
    telephone: "+33 6 12 34 56 78",
    telephoneSecondaire: "",
    
    // Adresse
    adresse: "123 Rue de la Paix",
    codePostal: "75000",
    ville: "Paris",
    pays: "France",
    
    // Adresse secondaire
    adresseSecondaire: "",
    codePostalSecondaire: "",
    villeSecondaire: "",
    
    // Permis
    typePermis: "B",
    numeroPermis: "123456789012",
    dateValiditePermis: "2030-01-15",
    
    // Professionnels
    profession: "Ingénieur",
    entreprise: "TechCorp",
    numeroSiret: "12345678901234",
    poste: "Ingénieur Senior",
    dateEmbauche: "2015-03-20",
    salaire: "50000",
    typeContrat: "CDI",
    
    // Coordonnées pro
    adresseProfessionnelle: "456 Avenue de la Tech, 75008 Paris",
    telephoneProfessionnel: "+33 1 23 45 67 89",
    emailProfessionnel: "jean.dupont@techcorp.com",
    
    // Bancaires
    iban: "FR1420041010050500013M02606",
    bic: "BNAGFRPP",
    nomBanque: "BNP Paribas",
    
    // Fiscalité
    numeroFiscal: "1 90 01 75 123 456",
    numeroTVA: "FR12345678901",
    revenuAnnuel: "50000",
    
    // Santé
    numeroMutuelle: "12345678",
    mutuelle: "Axa Assurances",
    groupeSanguin: "O+",
    allergies: "Aucune",
    
    // Assurances
    numeroAssuranceVehicule: "VE123456789",
    assuranceVehicule: "MAAF",
    numeroAssuranceHabitation: "HA123456789",
    assuranceHabitation: "Allianz",
    numeroAssuranceResponsabilite: "RC123456789",
    
    // Véhicule
    marqueVehicule: "Peugeot",
    modeleVehicule: "308",
    immatriculationVehicule: "AB-123-CD",
    
    // Éducation
    diplomeNiveau: "Master",
    diplomeSpecialite: "Informatique",
    etablissementEtudes: "Université Paris-Saclay",
    dateObtention: "2012",
    
    // Contact urgence
    nomUrgence: "Marie Dupont",
    telephoneUrgence: "+33 6 98 76 54 32",
    relationUrgence: "Épouse",
    
  });

  const [editedData, setEditedData] = useState<UserData>(userData);

  // Charger les données de sessionStorage au montage
  useEffect(() => {
    const savedData = sessionStorage.getItem("userProfileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      setEditedData(parsedData);
    }
  }, []);

  // Gestion de l'édition du profil
  const handleEditProfile = () => {
    setEditedData(userData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserData(editedData);
    // Sauvegarder dans sessionStorage
    sessionStorage.setItem("userProfileData", JSON.stringify(editedData));
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
                {/* Section Informations Civiles */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Civiles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Civilité</label>
                      <select value={editedData.civilite} onChange={(e) => handleInputChange("civilite", e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                        <option value="M">M.</option>
                        <option value="Mme">Mme</option>
                        <option value="Mlle">Mlle</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Prénom</label>
                      <Input value={editedData.prenom} onChange={(e) => handleInputChange("prenom", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom</label>
                      <Input value={editedData.nom} onChange={(e) => handleInputChange("nom", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de naissance</label>
                      <Input type="date" value={editedData.dateNaissance} onChange={(e) => handleInputChange("dateNaissance", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Lieu de naissance</label>
                      <Input value={editedData.lieuNaissance} onChange={(e) => handleInputChange("lieuNaissance", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nationalité</label>
                      <Input value={editedData.nationalite} onChange={(e) => handleInputChange("nationalite", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Situation familiale</label>
                      <select value={editedData.situation} onChange={(e) => handleInputChange("situation", e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                        <option value="Célibataire">Célibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Pacsé(e)">Pacsé(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Veuf(ve)">Veuf(ve)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nombre d'enfants</label>
                      <Input type="number" value={editedData.nombreEnfants} onChange={(e) => handleInputChange("nombreEnfants", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Section Document d'Identité */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Pièce d'Identité</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de document</label>
                      <select value={editedData.typeDocument} onChange={(e) => handleInputChange("typeDocument", e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                        <option value="Passeport">Passeport</option>
                        <option value="Carte nationale">Carte nationale</option>
                        <option value="Permis de conduire">Permis de conduire</option>
                        <option value="Titre de séjour">Titre de séjour</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro</label>
                      <Input value={editedData.numeroDocument} onChange={(e) => handleInputChange("numeroDocument", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date d'expiration</label>
                      <Input type="date" value={editedData.dateExpiration} onChange={(e) => handleInputChange("dateExpiration", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro de Sécurité Sociale</label>
                      <Input value={editedData.numeroSecuriteSociale} onChange={(e) => handleInputChange("numeroSecuriteSociale", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Section Coordonnées */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Coordonnées</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Email</label>
                      <Input type="email" value={editedData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Téléphone</label>
                      <Input value={editedData.telephone} onChange={(e) => handleInputChange("telephone", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Téléphone secondaire</label>
                    <Input value={editedData.telephoneSecondaire} onChange={(e) => handleInputChange("telephoneSecondaire", e.target.value)} className="text-sm" />
                  </div>
                </div>

                {/* Section Adresse */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Adresse</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Adresse</label>
                      <Input value={editedData.adresse} onChange={(e) => handleInputChange("adresse", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Code Postal</label>
                        <Input value={editedData.codePostal} onChange={(e) => handleInputChange("codePostal", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Ville</label>
                        <Input value={editedData.ville} onChange={(e) => handleInputChange("ville", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Pays</label>
                        <Input value={editedData.pays} onChange={(e) => handleInputChange("pays", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Adresse Secondaire */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Adresse Secondaire</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Adresse</label>
                      <Input value={editedData.adresseSecondaire} onChange={(e) => handleInputChange("adresseSecondaire", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Code Postal</label>
                        <Input value={editedData.codePostalSecondaire} onChange={(e) => handleInputChange("codePostalSecondaire", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Ville</label>
                        <Input value={editedData.villeSecondaire} onChange={(e) => handleInputChange("villeSecondaire", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Permis de Conduire */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Permis de Conduire</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de permis</label>
                      <Input value={editedData.typePermis} onChange={(e) => handleInputChange("typePermis", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro de permis</label>
                      <Input value={editedData.numeroPermis} onChange={(e) => handleInputChange("numeroPermis", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de validité</label>
                    <Input type="date" value={editedData.dateValiditePermis} onChange={(e) => handleInputChange("dateValiditePermis", e.target.value)} className="text-sm" />
                  </div>
                </div>

                {/* Section Professionnels */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Professionnelles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Profession</label>
                      <Input value={editedData.profession} onChange={(e) => handleInputChange("profession", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Entreprise</label>
                      <Input value={editedData.entreprise} onChange={(e) => handleInputChange("entreprise", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro SIRET</label>
                      <Input value={editedData.numeroSiret} onChange={(e) => handleInputChange("numeroSiret", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Poste</label>
                      <Input value={editedData.poste} onChange={(e) => handleInputChange("poste", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date d'embauche</label>
                      <Input type="date" value={editedData.dateEmbauche} onChange={(e) => handleInputChange("dateEmbauche", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Salaire annuel</label>
                      <Input type="number" value={editedData.salaire} onChange={(e) => handleInputChange("salaire", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de contrat</label>
                      <select value={editedData.typeContrat} onChange={(e) => handleInputChange("typeContrat", e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Stage">Stage</option>
                        <option value="Alternance">Alternance</option>
                        <option value="Indépendant">Indépendant</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section Coordonnées Professionnelles */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Coordonnées Professionnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Adresse professionnelle</label>
                      <Input value={editedData.adresseProfessionnelle} onChange={(e) => handleInputChange("adresseProfessionnelle", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Téléphone professionnel</label>
                        <Input value={editedData.telephoneProfessionnel} onChange={(e) => handleInputChange("telephoneProfessionnel", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Email professionnel</label>
                        <Input type="email" value={editedData.emailProfessionnel} onChange={(e) => handleInputChange("emailProfessionnel", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Informations Bancaires */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Bancaires</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">IBAN</label>
                      <Input value={editedData.iban} onChange={(e) => handleInputChange("iban", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">BIC</label>
                      <Input value={editedData.bic} onChange={(e) => handleInputChange("bic", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom de la banque</label>
                    <Input value={editedData.nomBanque} onChange={(e) => handleInputChange("nomBanque", e.target.value)} className="text-sm" />
                  </div>
                </div>

                {/* Section Fiscalité */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Fiscalité</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro fiscal</label>
                      <Input value={editedData.numeroFiscal} onChange={(e) => handleInputChange("numeroFiscal", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro de TVA</label>
                      <Input value={editedData.numeroTVA} onChange={(e) => handleInputChange("numeroTVA", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Revenu annuel</label>
                    <Input type="number" value={editedData.revenuAnnuel} onChange={(e) => handleInputChange("revenuAnnuel", e.target.value)} className="text-sm" />
                  </div>
                </div>

                {/* Section Santé */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Santé</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro de mutuelle</label>
                      <Input value={editedData.numeroMutuelle} onChange={(e) => handleInputChange("numeroMutuelle", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom de la mutuelle</label>
                      <Input value={editedData.mutuelle} onChange={(e) => handleInputChange("mutuelle", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Groupe sanguin</label>
                      <select value={editedData.groupeSanguin} onChange={(e) => handleInputChange("groupeSanguin", e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Allergies</label>
                      <Input value={editedData.allergies} onChange={(e) => handleInputChange("allergies", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Section Assurances */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Assurances</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">N° Assurance Véhicule</label>
                      <Input value={editedData.numeroAssuranceVehicule} onChange={(e) => handleInputChange("numeroAssuranceVehicule", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Assurance Véhicule</label>
                      <Input value={editedData.assuranceVehicule} onChange={(e) => handleInputChange("assuranceVehicule", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">N° Assurance Habitation</label>
                      <Input value={editedData.numeroAssuranceHabitation} onChange={(e) => handleInputChange("numeroAssuranceHabitation", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Assurance Habitation</label>
                      <Input value={editedData.assuranceHabitation} onChange={(e) => handleInputChange("assuranceHabitation", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">N° Assurance Responsabilité Civile</label>
                    <Input value={editedData.numeroAssuranceResponsabilite} onChange={(e) => handleInputChange("numeroAssuranceResponsabilite", e.target.value)} className="text-sm" />
                  </div>
                </div>

                {/* Section Véhicule */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Véhicule</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Marque</label>
                      <Input value={editedData.marqueVehicule} onChange={(e) => handleInputChange("marqueVehicule", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Modèle</label>
                      <Input value={editedData.modeleVehicule} onChange={(e) => handleInputChange("modeleVehicule", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Immatriculation</label>
                    <Input value={editedData.immatriculationVehicule} onChange={(e) => handleInputChange("immatriculationVehicule", e.target.value)} className="text-sm" />
                  </div>
                </div>

                {/* Section Éducation */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Éducation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Niveau de diplôme</label>
                      <Input value={editedData.diplomeNiveau} onChange={(e) => handleInputChange("diplomeNiveau", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Spécialité</label>
                      <Input value={editedData.diplomeSpecialite} onChange={(e) => handleInputChange("diplomeSpecialite", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Établissement d'études</label>
                      <Input value={editedData.etablissementEtudes} onChange={(e) => handleInputChange("etablissementEtudes", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Année d'obtention</label>
                      <Input type="number" value={editedData.dateObtention} onChange={(e) => handleInputChange("dateObtention", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Section Contact d'Urgence */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Contact d'Urgence</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom</label>
                      <Input value={editedData.nomUrgence} onChange={(e) => handleInputChange("nomUrgence", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Téléphone</label>
                      <Input value={editedData.telephoneUrgence} onChange={(e) => handleInputChange("telephoneUrgence", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Relation</label>
                    <Input value={editedData.relationUrgence} onChange={(e) => handleInputChange("relationUrgence", e.target.value)} className="text-sm" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveProfile} className="gap-2 flex-1 sm:flex-none">
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" className="gap-2 flex-1 sm:flex-none">
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Section Informations Civiles */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Civiles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Civilité</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.civilite}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Prénom</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.prenom}</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nom}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date de naissance</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateNaissance}</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Lieu de naissance</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.lieuNaissance}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nationalité</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nationalite}</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Situation familiale</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.situation}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nombre d'enfants</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nombreEnfants}</p></div>
                  </div>
                </div>

                {/* Section Document d'Identité */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Pièce d'Identité</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Type de document</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.typeDocument}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroDocument}</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date d'expiration</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateExpiration}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro de Sécurité Sociale</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroSecuriteSociale}</p></div>
                  </div>
                </div>

                {/* Section Coordonnées */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Coordonnées</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Email</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.email}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Téléphone</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephone}</p></div>
                  </div>
                  {userData.telephoneSecondaire && (
                    <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Téléphone secondaire</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephoneSecondaire}</p></div>
                  )}
                </div>

                {/* Section Adresse */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Adresse</h3>
                  <div className="space-y-3">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.adresse}</p></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Code Postal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.codePostal}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Ville</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.ville}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Pays</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.pays}</p></div>
                    </div>
                  </div>
                </div>

                {/* Section Adresse Secondaire */}
                {(userData.adresseSecondaire || userData.codePostalSecondaire || userData.villeSecondaire) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Adresse Secondaire</h3>
                    <div className="space-y-3">
                      {userData.adresseSecondaire && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.adresseSecondaire}</p></div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {userData.codePostalSecondaire && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Code Postal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.codePostalSecondaire}</p></div>
                        )}
                        {userData.villeSecondaire && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Ville</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.villeSecondaire}</p></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Permis de Conduire */}
                {(userData.typePermis || userData.numeroPermis || userData.dateValiditePermis) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Permis de Conduire</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.typePermis && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Type de permis</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.typePermis}</p></div>
                      )}
                      {userData.numeroPermis && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro de permis</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroPermis}</p></div>
                      )}
                    </div>
                    {userData.dateValiditePermis && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date de validité</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateValiditePermis}</p></div>
                    )}
                  </div>
                )}

                {/* Section Professionnels */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Professionnelles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Profession</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.profession}</p></div>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Entreprise</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.entreprise}</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    {userData.numeroSiret && (
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro SIRET</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroSiret}</p></div>
                    )}
                    {userData.poste && (
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Poste</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.poste}</p></div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
                    {userData.dateEmbauche && (
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date d'embauche</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateEmbauche}</p></div>
                    )}
                    {userData.salaire && (
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Salaire annuel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.salaire}€</p></div>
                    )}
                    {userData.typeContrat && (
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Type de contrat</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.typeContrat}</p></div>
                    )}
                  </div>
                </div>

                {/* Section Coordonnées Professionnelles */}
                {(userData.adresseProfessionnelle || userData.telephoneProfessionnel || userData.emailProfessionnel) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Coordonnées Professionnelles</h3>
                    <div className="space-y-3">
                      {userData.adresseProfessionnelle && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse professionnelle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.adresseProfessionnelle}</p></div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {userData.telephoneProfessionnel && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Téléphone professionnel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephoneProfessionnel}</p></div>
                        )}
                        {userData.emailProfessionnel && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Email professionnel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.emailProfessionnel}</p></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Informations Bancaires */}
                {(userData.iban || userData.bic || userData.nomBanque) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Bancaires</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.iban && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">IBAN</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.iban}</p></div>
                      )}
                      {userData.bic && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">BIC</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.bic}</p></div>
                      )}
                    </div>
                    {userData.nomBanque && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom de la banque</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nomBanque}</p></div>
                    )}
                  </div>
                )}

                {/* Section Fiscalité */}
                {(userData.numeroFiscal || userData.numeroTVA || userData.revenuAnnuel) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Fiscalité</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.numeroFiscal && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro fiscal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroFiscal}</p></div>
                      )}
                      {userData.numeroTVA && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro de TVA</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroTVA}</p></div>
                      )}
                    </div>
                    {userData.revenuAnnuel && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Revenu annuel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.revenuAnnuel}€</p></div>
                    )}
                  </div>
                )}

                {/* Section Santé */}
                {(userData.numeroMutuelle || userData.mutuelle || userData.groupeSanguin || userData.allergies) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Santé</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.numeroMutuelle && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Numéro de mutuelle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroMutuelle}</p></div>
                      )}
                      {userData.mutuelle && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom de la mutuelle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.mutuelle}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.groupeSanguin && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Groupe sanguin</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.groupeSanguin}</p></div>
                      )}
                      {userData.allergies && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Allergies</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.allergies}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section Assurances */}
                {(userData.numeroAssuranceVehicule || userData.assuranceVehicule || userData.numeroAssuranceHabitation || userData.assuranceHabitation || userData.numeroAssuranceResponsabilite) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Assurances</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.numeroAssuranceVehicule && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">N° Assurance Véhicule</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAssuranceVehicule}</p></div>
                      )}
                      {userData.assuranceVehicule && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Assurance Véhicule</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.assuranceVehicule}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.numeroAssuranceHabitation && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">N° Assurance Habitation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAssuranceHabitation}</p></div>
                      )}
                      {userData.assuranceHabitation && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Assurance Habitation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.assuranceHabitation}</p></div>
                      )}
                    </div>
                    {userData.numeroAssuranceResponsabilite && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">N° Assurance Responsabilité Civile</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAssuranceResponsabilite}</p></div>
                    )}
                  </div>
                )}

                {/* Section Véhicule */}
                {(userData.marqueVehicule || userData.modeleVehicule || userData.immatriculationVehicule) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Véhicule</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.marqueVehicule && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Marque</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.marqueVehicule}</p></div>
                      )}
                      {userData.modeleVehicule && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Modèle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.modeleVehicule}</p></div>
                      )}
                    </div>
                    {userData.immatriculationVehicule && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Immatriculation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.immatriculationVehicule}</p></div>
                    )}
                  </div>
                )}

                {/* Section Éducation */}
                {(userData.diplomeNiveau || userData.diplomeSpecialite || userData.etablissementEtudes || userData.dateObtention) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Éducation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.diplomeNiveau && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Niveau de diplôme</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.diplomeNiveau}</p></div>
                      )}
                      {userData.diplomeSpecialite && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Spécialité</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.diplomeSpecialite}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.etablissementEtudes && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Établissement d'études</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.etablissementEtudes}</p></div>
                      )}
                      {userData.dateObtention && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Année d'obtention</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateObtention}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section Contact d'Urgence */}
                {(userData.nomUrgence || userData.telephoneUrgence || userData.relationUrgence) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Contact d'Urgence</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.nomUrgence && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nomUrgence}</p></div>
                      )}
                      {userData.telephoneUrgence && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Téléphone</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephoneUrgence}</p></div>
                      )}
                    </div>
                    {userData.relationUrgence && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Relation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.relationUrgence}</p></div>
                    )}
                  </div>
                )}

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
