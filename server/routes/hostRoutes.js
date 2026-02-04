import express from "express";
const router = express.Router();
import * as hostsController from "../controllers/hostsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

// Apply authentication middleware to all host routes
router.use(authMiddleware);

// ===== HOST MANAGEMENT ROUTES =====

/**
 * @swagger
 * /hosts:
 *   get:
 *     tags:
 *       - Hosts
 *     summary: List all hosts
 *     responses:
 *       200:
 *         description: List of hosts
 */
router.get(
  "/",
  authorizePermissions("admin", "manager", 'guard'),
  hostsController.getAllHosts
);

/**
 * @swagger
 * /hosts:
 *   post:
 *     tags:
 *       - Hosts
 *     summary: Create a new host
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               idNumber:
 *                 type: number
 *               phoneNumber:
 *                 type: number
 *               email:
 *                 type: string
 *               unit:
 *                 type: string
 *               site:
 *                 type: string
 *     responses:
 *       201:
 *         description: Host created successfully
 */
router.post(
  "/",
  authorizePermissions("admin", "manager"),
  hostsController.createHost
);



/**
 * @swagger
 * /hosts/{id}:
 *   get:
 *     tags:
 *       - Hosts
 *     summary: Get details of a specific host
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Host details
 *       404:
 *         description: Host not found
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager", 'guard'),
  hostsController.getOneHost
);

/**
 * @swagger
 * /hosts/{id}:
 *   patch:
 *     tags:
 *       - Hosts
 *     summary: Update a host's information or site assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Host updated successfully
 *       404:
 *         description: Host not found
 */
router.patch(
  "/:id",
  authorizePermissions("admin", "manager"),
  hostsController.updateHost
);

/**
 * @swagger
 * /hosts/{id}:
 *   delete:
 *     tags:
 *       - Hosts
 *     summary: Remove a host
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Host deleted successfully
 *       404:
 *         description: Host not found
 */
router.delete(
  "/:id",
  authorizePermissions("admin", "manager"),
  hostsController.deleteHost
);

export default router;