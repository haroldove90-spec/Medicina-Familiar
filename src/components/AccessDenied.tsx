import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  moduleName: string;
  requiredRole?: string;
}

export default function AccessDenied({ moduleName, requiredRole }: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#FC0000] mb-6 shadow-inner">
        <ShieldAlert size={40} />
      </div>
      <h2 className="text-2xl font-bold text-[#282829] mb-2">Acceso Restringido</h2>
      <p className="text-[#64748B] max-w-md mb-8">
        Lo sentimos, no tienes los permisos necesarios para acceder al módulo de <span className="font-bold text-[#282829]">{moduleName}</span>. 
        Esta acción ha sido registrada en la bitácora de seguridad.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2 border-[#E2E8F0]"
        >
          <ArrowLeft size={16} /> Volver
        </Button>
        <Button 
          onClick={() => navigate('/')}
          className="bg-[#047E29] hover:bg-[#036621] text-white"
        >
          Ir al Dashboard
        </Button>
      </div>
      {requiredRole && (
        <p className="mt-8 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
          Nivel de acceso requerido: {requiredRole}
        </p>
      )}
    </div>
  );
}
