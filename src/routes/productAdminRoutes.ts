import { Router } from "express";
import { createProduct, updateProduct, deleteProduct } from "../controllers/productAdminController";
import { verifyToken } from "../middlewares/authJwt";

const router = Router();

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products (Admin)
 *     summary: Crear un nuevo producto
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post("/", verifyToken, createProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     tags:
 *       - Products (Admin)
 *     summary: Actualizar un producto existente
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put("/:id", verifyToken, updateProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Products (Admin)
 *     summary: Eliminar un producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete("/:id", verifyToken, deleteProduct);

export default router;
