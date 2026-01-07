import express from "express";
const router = express.Router();
import * as visitorsController from "../controllers/visitorsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

router.use(authMiddleware);

// ===== MULTIPLE VISITOR OPERATIONS =====
/**
 * @swagger
 * /visitors:
 *   get:
 *     tags:
 *       - Visitors
 *     summary: Get all visitors
 *     responses:
 *       200:
 *         description: List of visitors
 */
router.get(
  "/",
  authorizePermissions("admin", "manager", "guard", "host"),
  visitorsController.getAllVisitors
);

/**
 * @swagger
 * /visitors/history:
 *   get:
 *     tags:
 *       - Visitors
 *     summary: Get visitors history
 *     responses:
 *       200:
 *         description: Visitors history
 */
router.get(
  "/history",
  authorizePermissions("admin", "manager", "guard", "host"),
  visitorsController.getVisitorsHistory
);

/**
 * @swagger
 * /visitors:
 *   post:
 *     tags:
 *       - Visitors
 *     summary: Create a visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Visitor created
 */
router.post(
  "/",
  authorizePermissions("admin", "manager", "guard", "host"),
  visitorsController.createVisitor
);

/**
 * @swagger
 * /visitors/analytics/daily-count:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get daily visitors count
 *     responses:
 *       200:
 *         description: Daily visitors count
 */
router.get(
  "/analytics/daily-count",
  authorizePermissions("admin", "manager"),
  visitorsController.getDailyVisitorsCount
);

/**
 * @swagger
 * /visitors/analytics/peak-hours:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get peak visitor hours
 *     responses:
 *       200:
 *         description: Peak visitor hours
 */
router.get(
  "/analytics/peak-hours",
  authorizePermissions("admin", "manager"),
  visitorsController.getPeakVisitorHours
);

/**
 * @swagger
 * /visitors/analytics/frequent-visitors:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get frequent visitors
 *     responses:
 *       200:
 *         description: Frequent visitors
 */
router.get(
  "/analytics/frequent-visitors",
  authorizePermissions("admin", "manager"),
  visitorsController.getFrequentVisitors
);

// ===== SINGLE VISITOR OPERATIONS =====
/**
 * @swagger
 * /visitors/{id}:
 *   get:
 *     tags:
 *       - Visitors
 *     summary: Get a visitor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor details
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager", "guard", "host"),
  visitorsController.getOneVisitor
);

/**
 * @swagger
 * /visitors/{id}:
 *   patch:
 *     tags:
 *       - Visitors
 *     summary: Update a visitor
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
 *         description: Visitor updated
 */
router.patch(
  "/:id",
  authorizePermissions("admin", "manager"),
  visitorsController.updateVisitor
);

/**
 * @swagger
 * /visitors/{id}/arrived:
 *   patch:
 *     tags:
 *       - Visitors
 *     summary: Mark visitor as arrived
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor marked as arrived
 */
router.patch(
  "/:id",
  authorizePermissions("admin", "manager", "guard"),
  visitorsController.markVisitorArrived
);

/**
 * @swagger
 * /visitors/{id}/departed:
 *   patch:
 *     tags:
 *       - Visitors
 *     summary: Mark visitor as departed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor marked as departed
 */
router.patch(
  "/:id",
  authorizePermissions("admin", "manager", "guard"),
  visitorsController.markVisitorDeparted
);

/**
 * @swagger
 * /visitors/{id}:
 *   delete:
 *     tags:
 *       - Visitors
 *     summary: Delete a visitor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor deleted
 */
router.delete(
  "/:id",
  authorizePermissions("admin"),
  visitorsController.deleteVisitor
);

export default router;
