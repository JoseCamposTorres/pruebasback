import { Router } from "express";
import { getAll, search, listCategories } from "../controllers/productClientController";
import { validateApiKey } from "../middlewares/apiKeyMiddleware";
const router = Router();

/**
 * @openapi
 * /api/v1/products-client:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", validateApiKey, getAll);

/**
 * @openapi
 * /api/v1/products-client/search:
 *   get:
 *     tags:
 *       - Products
 *     summary: Buscar productos
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados encontrados
 */
router.get("/search", validateApiKey, search);

/**
 * @openapi
 * /api/v1/products-client/categories:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar categorías únicas
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/categories", validateApiKey, listCategories);

export default router;