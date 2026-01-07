import express from "express";
const router = express.Router();
import * as guardAssignmentsController from "../controllers/guardAssignmentsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";
/* 
===== Guard Assignment Routes =====
POST /assignments?siteId?guardId - Assign a guard to a site.
GET /assignments - List all guard assignments.
GET /assignments/:id - Get details of a specific guard assignment.
PATCH /assignments/:id - Update a guard assignment.
DELETE /assignments/:id - Remove a guard assignment.
GET /assignments/:guardId - List all assignments for a specific guard.
GET /assignments/:siteId - Get a specific site's assigned guards.
GET /assignments/active - List all currently active guard assignments.
*/

// Apply authentication middleware to all guard assignment routes
router.use(authMiddleware);

// ===== GUARD ASSIGNMENT MANAGEMENT ROUTES =====
/**
 * @swagger
 * /assignments/{siteId}/{guardId}/assign:
 *   post:
 *     tags:
 *       - Guard Assignments
 *     summary: Assign a guard to a site
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: guardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedBy:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Guard assigned successfully
 *       404:
 *         description: Guard or site not found
 */
router.post(
  "/:siteId/:guardId/assign",
  authorizePermissions("admin", "manager"),
  guardAssignmentsController.assignGuardToSite
);
/**
 * @swagger
 * /assignments:
 *   get:
 *     tags:
 *       - Guard Assignments
 *     summary: List all guard assignments
 *     responses:
 *       200:
 *         description: List of guard assignments
 */
router.get(
  "/",
  authorizePermissions("admin", "manager"),
  guardAssignmentsController.getAllGuardAssignments
);
/**
 * @swagger
 * /assignments/active:
 *   get:
 *     tags:
 *       - Guard Assignments
 *     summary: List all currently active guard assignments
 *     responses:
 *       200:
 *         description: List of active guard assignments
 */
router.get(
  "/active",
  authorizePermissions("admin", "manager"),
  guardAssignmentsController.getActiveGuardAssignments
);
/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     tags:
 *       - Guard Assignments
 *     summary: Get details of a specific guard assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard assignment details
 *       404:
 *         description: Assignment not found
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager"),
  guardAssignmentsController.getOneGuardAssignment
);
/**
 * @swagger
 * /assignments/{id}:
 *   patch:
 *     tags:
 *       - Guard Assignments
 *     summary: Update a guard assignment
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
 *         description: Assignment updated successfully
 *       404:
 *         description: Assignment not found
 */
router.patch(
  "/:id",
  authorizePermissions("admin", "manager"),
  guardAssignmentsController.updateGuardAssignment
);
/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     tags:
 *       - Guard Assignments
 *     summary: Remove a guard assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 */
router.delete(
  "/:id",
  authorizePermissions("admin", "manager"),
  guardAssignmentsController.deleteGuardAssignment
);

export default router;
