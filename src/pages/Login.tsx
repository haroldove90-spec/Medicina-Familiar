import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Server,
  Database,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { motion } from 'motion/react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      {/* Left Side: Login Form */}
      <div className="flex flex-col justify-center px-8 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <img 
              src="https://appdesignproyectos.com/neo.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-bold text-[#047E29] tracking-tight leading-tight">Dr. Mario</h1>
              <p className="text-[10px] font-bold text-[#CDCC34] uppercase tracking-widest">Mendoza</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-[#282829] tracking-tight">Bienvenido</h2>
            <p className="text-[#64748B]">Ingrese sus credenciales para acceder al sistema del Dr. Mendoza.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#64748B]" size={18} />
                <Input 
                  type="email" 
                  placeholder="mendoza@consultorio.com" 
                  className="pl-10 h-12 border-[#E2E8F0] rounded-xl focus:ring-[#047E29]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Contraseña</Label>
                <a href="#" className="text-[11px] font-bold text-[#047E29] hover:underline">¿Olvidó su contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#64748B]" size={18} />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10 h-12 border-[#E2E8F0] rounded-xl focus:ring-[#047E29]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#64748B] hover:text-[#282829]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-[#E2E8F0] text-[#047E29]" />
              <label htmlFor="remember" className="text-sm text-[#64748B]">Mantener sesión iniciada</label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#047E29] hover:bg-[#036621] text-white rounded-xl font-bold text-base shadow-lg shadow-green-100 transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Acceder al Sistema'}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] text-center">
              Sistema de Gestión Médica Digital • v3.0.0<br/>
              Cumple con NOM-024-SSA3-2012 y COFEPRIS
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Branding/Info */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#047E29] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CDCC34]/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="max-w-lg relative z-10">
          <div className="mb-8 w-16 h-1 bg-white rounded-full"></div>
          <h3 className="text-4xl font-bold mb-6 leading-tight tracking-tight">
            Excelencia Médica con Tecnología de Vanguardia.
          </h3>
          <p className="text-[#EBFBCA] text-lg mb-10 leading-relaxed">
            Gestione sus pacientes con la precisión y calidez que caracterizan al consultorio del Dr. Mario Mendoza.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Seguridad Certificada</h4>
                <p className="text-[#EBFBCA] text-sm">Cifrado de datos sensibles y cumplimiento total con normativas de salud.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Dictado Inteligente</h4>
                <p className="text-[#EBFBCA] text-sm">Optimice su tiempo con nuestra nueva función de voz a texto para notas SOAP.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
