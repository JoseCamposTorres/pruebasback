import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { env } from './config/env';

import productRoutes from './routes/productClientRoutes';
import authRoutes from './routes/authRoutes';
import productAdminRoutes from './routes/productAdminRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';

import { apiLimiter } from './config/securityConfig';
import db from './config/db';

const app: Application = express();

// =======================
// Seguridad base
// =======================
app.use(helmet({
  contentSecurityPolicy: false, // evita bloqueo de scripts de Swagger
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (env.allowedOrigins.length === 0) {
      const isLocal = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
      return callback(null, isLocal);
    }
    return callback(null, env.allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Swagger UI corregido
// =======================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Love Send API Docs"
}));
// =======================
// Static uploads
// =======================
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// =======================
// API Rate Limit
// =======================
app.use('/api', apiLimiter);

// =======================
// Routes
// =======================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products-client', productRoutes);
app.use('/api/v1/products', productAdminRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/api/v1/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', db: true });
  } catch (err: any) {
    res.status(500).json({ status: 'error', db: false, message: err?.message });
  }
});

export default app;
