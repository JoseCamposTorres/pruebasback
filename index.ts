import app from './src/app';
import { env } from './src/config/env';

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Servidor funcionando en el puerto ${env.port}`);
});
