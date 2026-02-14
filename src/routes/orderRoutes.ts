import { Router } from "express";
import {
  createOrder,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  customizeTemplate,
  uploadPhotos,
} from "../controllers/orderController";
import {
  sendVerificationCode,
  verifyEmailCode,
} from "../controllers/emailVerificationController";
import { upload } from "../middlewares/uploadMiddleware";
import { validateApiKey } from "../middlewares/apiKeyMiddleware";
import { verifyToken } from "../middlewares/authJwt";

const router = Router();

// Verificación de email
router.post("/verify-email/send", validateApiKey, sendVerificationCode);
router.post("/verify-email/confirm", validateApiKey, verifyEmailCode);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Crear un nuevo pedido
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - phone_number
 *               - email
 *               - file
 *               - items
 *               - total_amount
 *             properties:
 *               customer_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               items:
 *                 type: string
 *                 description: JSON string de los items del carrito
 *               total_amount:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */
router.post("/", validateApiKey, upload.single("file"), createOrder);

// Subida de fotos para carrusel de plantillas
router.post("/upload-photos", validateApiKey, upload.array("photos", 10), uploadPhotos);

/**
 * @openapi
 * /api/v1/orders/track/{code}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Consultar pedido por codigo de seguimiento
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Codigo de seguimiento (ej. LS-ABC123)
 *     responses:
 *       200:
 *         description: Datos del pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/track/:code", validateApiKey, trackOrder);

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Listar todos los pedidos (Admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", verifyToken, getAllOrders);

/**
 * @openapi
 * /api/v1/orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Actualizar estado de un pedido (Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, pago_verificado, listo, anulado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.put("/:id/status", verifyToken, updateOrderStatus);

/**
 * @openapi
 * /api/v1/orders/track/{code}/customize:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Personalizar plantilla del pedido (cliente)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - template_data
 *             properties:
 *               template_data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Personalización guardada
 */
router.put("/track/:code/customize", validateApiKey, customizeTemplate);

export default router;
