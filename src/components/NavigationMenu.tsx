import { Archive, FileCheck, Database, HelpCircle, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NavigationMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Accueil", path: "/dashboard" },
    { icon: Archive, label: "Documents archivés", path: "/archived" },
    { icon: FileCheck, label: "Documents supportés", path: "/supported" },
    { icon: Database, label: "Base de données perso", path: "/database" },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Formulama</h2>
        <p className="text-sm text-muted-foreground mt-1">Menu de navigation</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
          >
            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <Separator className="my-4" />

        <button
          onClick={() => navigate("/help")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-medium">Aide</span>
        </button>
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default NavigationMenu;
