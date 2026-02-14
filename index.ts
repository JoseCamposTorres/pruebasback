import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
 console.log(`Servidor funcionando en el puerto ${PORT}`);
});
