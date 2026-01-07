import express from "express";
const router = express.Router();
import * as sitesController from "../controllers/sitesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

router.use(authMiddleware);

/**
 * @swagger
 * /sites:
 *   get:
 *     tags:
 *       - Sites
 *     summary: Get all sites
 *     responses:
 *       200:
 *         description: List of sites
 */
router.get(
  "/",
  authorizePermissions("admin", "manager"),
  sitesController.getAllSites
);
/**
 * @swagger
 * /sites/{id}:
 *   get:
 *     tags:
 *       - Sites
 *     summary: Get a site by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site details
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager"),
  sitesController.getOneSite
);
/**
 * @swagger
 * /sites:
 *   post:
 *     tags:
 *       - Sites
 *     summary: Create a site
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Site created
 */
router.post("/", authorizePermissions("admin"), sitesController.createSite);
/**
 * @swagger
 * /sites/{id}:
 *   patch:
 *     tags:
 *       - Sites
 *     summary: Update a site
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
 *         description: Site updated
 */
router.patch("/:id", authorizePermissions("admin"), sitesController.updateSite);
/**
 * @swagger
 * /sites/{id}:
 *   delete:
 *     tags:
 *       - Sites
 *     summary: Delete a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site deleted
 */
router.delete(
  "/:id",
  authorizePermissions("admin"),
  sitesController.deleteSite
);

/**
 * @swagger
 * /sites/gates:
 *   get:
 *     tags:
 *       - Gates
 *     summary: Get all gates
 *     responses:
 *       200:
 *         description: List of gates
 */
router.get(
  "/gates",
  authorizePermissions("admin", "manager"),
  sitesController.getAllGates
);

/**
 * @swagger
 * /sites/gates/{id}:
 *   get:
 *     tags:
 *       - Gates
 *     summary: Get a gate by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gate details
 */
router.get(
  "/gates/:id",
  authorizePermissions("admin", "manager"),
  sitesController.getOneGateForSite
);

/**
 * @swagger
 * /sites/{id}/gates:
 *   get:
 *     tags:
 *       - Gates
 *     summary: Get all gates for a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of gates for site
 */
router.get(
  "/:id/gates",
  authorizePermissions("admin", "manager"),
  sitesController.getAllGatesForSite
);

/**
 * @swagger
 * /sites/gates:
 *   post:
 *     tags:
 *       - Gates
 *     summary: Create a gate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Gate created
 */
router.post(
  "/gates",
  authorizePermissions("admin"),
  sitesController.createGate
);

/**
 * @swagger
 * /sites/gates/{id}:
 *   patch:
 *     tags:
 *       - Gates
 *     summary: Update a gate
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
 *         description: Gate updated
 */
router.patch(
  "/gates/:id",
  authorizePermissions("admin"),
  sitesController.updateGate
);

/**
 * @swagger
 * /sites/gates/{id}:
 *   delete:
 *     tags:
 *       - Gates
 *     summary: Delete a gate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gate deleted
 */
router.delete(
  "/gates/:id",
  authorizePermissions("admin"),
  sitesController.deleteGate
);

/**
 * @swagger
 * /sites/gates/{id}/guards:
 *   post:
 *     tags:
 *       - Guard Assignments
 *     summary: Assign guards to a gate
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
 *       201:
 *         description: Guards assigned
 */
router.post(
  "/gates/:id/guards",
  authorizePermissions("admin"),
  sitesController.assignGuardsToGate
);

/**
 * @swagger
 * /sites/gates/{id}/guards/{guardId}:
 *   delete:
 *     tags:
 *       - Guard Assignments
 *     summary: Remove guard from gate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: guardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guard removed from gate
 */
router.delete(
  "/gates/:id/guards/:guardId",
  authorizePermissions("admin"),
  sitesController.removeGuardFromGate
);

/**
 * @swagger
 * /sites/gates/{id}/guards:
 *   get:
 *     tags:
 *       - Guard Assignments
 *     summary: Get all guards for a gate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of guards for gate
 */
router.get(
  "/gates/:id/guards",
  authorizePermissions("admin"),
  sitesController.getAllGuardsForGate
);

/**
 * @swagger
 * /sites/{id}/users:
 *   post:
 *     tags:
 *       - User Assignments
 *     summary: Assign user to site
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
 *       201:
 *         description: User assigned
 */
router.post(
  "/:id/users",
  authorizePermissions("admin"),
  sitesController.assignUserToSite
);

/**
 * @swagger
 * /sites/{id}/users/{userId}:
 *   delete:
 *     tags:
 *       - User Assignments
 *     summary: Remove user from site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed from site
 */
router.delete(
  "/:id/users/:userId",
  authorizePermissions("admin"),
  sitesController.removeUserFromSite
);

/**
 * @swagger
 * /sites/{id}/users:
 *   get:
 *     tags:
 *       - User Assignments
 *     summary: Get all users for a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users for site
 */
router.get(
  "/:id/users",
  authorizePermissions("admin", "manager"),
  sitesController.getAllUsersForSite
);

/**
 * @swagger
 * /sites/{id}/visitors/live-count:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get live visitor count for a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live visitor count
 */
router.get(
  "/:id/visitors/live-count",
  authorizePermissions("admin", "manager"),
  sitesController.getLiveVisitorCount
);

/**
 * @swagger
 * /sites/{id}/analytics/daily-count:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get daily visitor count for a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily visitor count
 */
router.get(
  "/:id/analytics/daily-count",
  authorizePermissions("admin", "manager"),
  sitesController.getSiteDailyVisitorCount
);

/**
 * @swagger
 * /sites/{id}/analytics/peak-hours:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get peak hours for a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Peak hours
 */
router.get(
  "/:id/analytics/peak-hours",
  authorizePermissions("admin", "manager"),
  sitesController.getSitePeakHours
);

/**
 * @swagger
 * /sites/{id}/logs/export:
 *   get:
 *     tags:
 *       - Logs
 *     summary: Export site logs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site logs exported
 */
router.get(
  "/:id/logs/export",
  authorizePermissions("admin", "manager"),
  sitesController.exportSiteLogs
);
export default router;
