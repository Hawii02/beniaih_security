import express from "express";
const router = express.Router();
import * as guardsController from "../controllers/guardsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

// Apply authentication middleware to all guard routes
router.use(authMiddleware);

/**
 * @swagger
 * /guards:
 *   post:
 *     tags:
 *       - Guards
 *     summary: Create a guard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Guard created
 */
router.post(
  "/",
  authorizePermissions("admin", "manager"),
  guardsController.createGuard
);
/**
 * @swagger
 * /guards:
 *   get:
 *     tags:
 *       - Guards
 *     summary: Get all guards
 *     responses:
 *       200:
 *         description: List of guards
 */
router.get(
  "/",
  authorizePermissions("admin", "manager"),
  guardsController.getAllGuards
);
/**
 * @swagger
 * /guards/{id}:
 *   get:
 *     tags:
 *       - Guards
 *     summary: Get a guard by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard details
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager"),
  guardsController.getOneGuard
);
/**
 * @swagger
 * /guards/{id}:
 *   patch:
 *     tags:
 *       - Guards
 *     summary: Update a guard
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
 *         description: Guard updated
 */
router.patch(
  "/:id",
  authorizePermissions("admin", "manager"),
  guardsController.updateGuard
);
/**
 * @swagger
 * /guards/{id}:
 *   delete:
 *     tags:
 *       - Guards
 *     summary: Delete a guard
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard deleted
 */
router.delete(
  "/:id",
  authorizePermissions("admin"),
  guardsController.deleteGuard
);

/**
 * @swagger
 * /guards/{id}/status:
 *   patch:
 *     tags:
 *       - Guards
 *     summary: Update guard status
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
 *         description: Guard status updated
 */
router.patch(
  "/:id/status",
  authorizePermissions("admin", "manager"),
  guardsController.updateGuardStatus
);

/**
 * @swagger
 * /guards/{id}/assignments:
 *   get:
 *     tags:
 *       - Guards
 *     summary: Get guard assignments history
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard assignments history
 */
router.get(
  "/:id/assignments",
  authorizePermissions("admin", "manager"),
  guardsController.getGuardHistory
);

/**
 * @swagger
 * /guards/{id}/assignments/{assignmentId}/terminate:
 *   patch:
 *     tags:
 *       - Guards
 *     summary: Terminate guard assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard assignment terminated
 */
router.patch(
  "/:id/assignments/:assignmentId/terminate",
  authorizePermissions("admin", "manager"),
  guardsController.terminateGuardAssignment
);

/**
 * @swagger
 * /guards/{id}/history:
 *   get:
 *     tags:
 *       - Guards
 *     summary: Get guard history
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard history
 */
router.get(
  "/:id/history",
  authorizePermissions("admin", "manager"),
  guardsController.getGuardHistory
);

/**
 * @swagger
 * /guards/{id}/logs:
 *   get:
 *     tags:
 *       - Guards
 *     summary: Export guard logs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard logs exported
 */
router.get(
  "/:id/logs",
  authorizePermissions("admin", "manager"),
  guardsController.exportGuardLogs
);

export default router;
