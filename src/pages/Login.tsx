import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import formulamaLogo from "@/assets/formulama_logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app, validate credentials
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src={formulamaLogo} 
              alt="Formulama Logo" 
              className="w-32 h-32 object-cover rounded-full drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Formulama</h1>
          <p className="text-muted-foreground">L’administratif simplifié, pour une vie allégée.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-bottom duration-700">
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-medium)] space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nom d'utilisateur
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                placeholder="Entrez votre nom"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                Rester connecté
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.4)] hover:scale-[1.02]"
            >
              Valider
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Pas de compte ? <span className="font-medium underline">Je m'inscris</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
