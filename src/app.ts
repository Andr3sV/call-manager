import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import batchCallingRoutes from './routes/batch-calling.routes';

const app: Application = express();

// Middlewares de seguridad y parseo
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'call-manager',
  });
});

// Rutas de la API
app.use('/api/batch-calling', batchCallingRoutes);

// Ruta 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
  });
});

export default app;

