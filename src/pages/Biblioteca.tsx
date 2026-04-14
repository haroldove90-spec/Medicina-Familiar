import React, { useState, useEffect } from 'react';
import { 
  Library, 
  Plus,
  Search,
  FileText,
  Download,
  Trash2,
  FileUp,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { LibraryFile, storage } from '@/src/lib/storage';
import { toast } from 'sonner';

export default function Biblioteca() {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFiles(storage.getLibraryFiles());
  }, []);

  const handleUpload = () => {
    const newFile: LibraryFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Guía Clínica ${files.length + 1}.pdf`,
      type: 'PDF',
      size: '2.4 MB',
      date: new Date().toLocaleDateString(),
      url: '#'
    };
    storage.saveLibraryFile(newFile);
    setFiles(storage.getLibraryFiles());
    toast.success('Documento guardado en la biblioteca local');
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Biblioteca Médica</h2>
          <p className="text-[#64748B] text-sm">Repositorio de guías, protocolos y consentimientos informados.</p>
        </div>
        <Button onClick={handleUpload} className="bg-[#047E29] hover:bg-[#036621] gap-2">
          <FileUp size={18} /> Subir Documento
        </Button>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-[#64748B]" size={16} />
          <Input 
            placeholder="Buscar documentos..." 
            className="pl-10 h-10 border-[#E2E8F0] rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 px-4 text-xs font-bold border-[#E2E8F0]">Guías Clínicas</Button>
          <Button variant="outline" className="h-10 px-4 text-xs font-bold border-[#E2E8F0]">Consentimientos</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <Card key={file.id} className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white group">
              <div className="h-32 bg-[#F8FAFC] flex items-center justify-center border-b border-[#E2E8F0] relative">
                <FileText size={48} className="text-[#047E29]/20 group-hover:text-[#047E29]/40 transition-colors" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-[#282829] truncate mb-1">{file.name}</h3>
                <div className="flex justify-between items-center text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
                  <span>{file.type} • {file.size}</span>
                  <span>{file.date}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] gap-1 border-[#E2E8F0]">
                    <Download size={12} /> Descargar
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-[#FC0000] border-[#E2E8F0] hover:bg-red-50">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Library size={48} className="mx-auto text-[#E2E8F0] mb-4" />
            <p className="text-[#64748B] text-sm italic">No hay documentos en la biblioteca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
