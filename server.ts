import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database (In-memory for demo)
  const patients = [
    { id: '1', name: 'Juan Pérez', age: 45, gender: 'M', lastVisit: '2024-03-10' },
    { id: '2', name: 'María García', age: 32, gender: 'F', lastVisit: '2024-03-12' },
    { id: '3', name: 'Carlos López', age: 58, gender: 'M', lastVisit: '2024-03-14' },
  ];

  const auditLogs: any[] = [];

  // API Routes
  app.get('/api/patients', (req, res) => {
    const { q } = req.query;
    if (q) {
      const filtered = patients.filter(p => p.name.toLowerCase().includes((q as string).toLowerCase()));
      return res.json(filtered);
    }
    res.json(patients);
  });

  app.post('/api/notes', (req, res) => {
    const note = req.body;
    // Simulate audit log entry
    const log = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user: 'Dr. Harold Ove',
      action: 'CREATE_MEDICAL_NOTE',
      details: `Nota médica creada para paciente ID: ${note.patientId}`,
      entity: 'MedicalNote'
    };
    auditLogs.push(log);
    console.log('Audit Log Created:', log);
    res.status(201).json({ message: 'Nota guardada exitosamente', noteId: 'note_123' });
  });

  app.get('/api/audit-logs', (req, res) => {
    res.json(auditLogs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
