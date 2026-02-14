# 🐺 LoveSend Backend - WolfCode Technologies

Bienvenido al repositorio central de **LoveSend**, una solución de e-commerce de alto rendimiento para el sector de regalos y flores. Este proyecto ha sido desarrollado bajo los estrictos estándares de **WolfCode Technologies**, aplicando una **Arquitectura en Capas (N-Tier Architecture)** para garantizar escalabilidad, seguridad y una separación clara de responsabilidades.

---

## 🏗️ Arquitectura del Proyecto

Implementamos una variante de **Clean Architecture** para aislar la lógica de negocio de los detalles de implementación.

### Estructura de Directorios
```text
lovesend-backend/
├── src/
│   ├── config/          # Configuración de DB (MySQL) y variables de entorno
│   ├── controllers/     # Orquestadores de peticiones (Manejo de req y res)
│   ├── models/          # Abstracción de datos y consultas SQL puras
│   ├── routes/          # Definición de endpoints y exposición de la API
│   ├── middlewares/     # Capas de seguridad y control de errores
│   ├── services/        # Lógica de negocio y reglas del sistema
│   ├── utils/           # Clases de apoyo (AppError, CatchAsync)
│   └── app.js           # Inicialización de Express
├── .env                 # Secretos y credenciales
├── .gitignore           # Archivos omitidos en Git
├── index.js             # Punto de entrada del servidor
└── package.json         # Dependencias y scripts