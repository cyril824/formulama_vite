import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Lock, Eye, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactor: false,
    emailUpdates: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-[var(--shadow-soft)]">
        <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">Paramètres</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 py-4 sm:py-8 max-w-2xl mx-auto">
        {/* Notifications */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Bell className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Notifications</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Recevoir les notifications par email</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.notifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Mode sombre */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Sun className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Mode sombre</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Activer le thème sombre</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.darkMode ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Authentification 2FA */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Lock className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Authentification double facteur</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sécuriser votre compte avec 2FA</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('twoFactor')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.twoFactor ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.twoFactor ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Mises à jour par email */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Eye className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Mises à jour par email</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Recevoir les mises à jour des produits</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('emailUpdates')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.emailUpdates ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailUpdates ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button onClick={() => navigate("/dashboard")} className="w-full sm:flex-1">
            Retour au Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/profile")} className="w-full sm:flex-1">
            Voir le profil
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
