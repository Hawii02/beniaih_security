import express from "express";
const router = express.Router();
import * as usersController from "../controllers/usersController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

router.use(authMiddleware);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/",
  authorizePermissions("admin", "manager"),
  usersController.getAllUsers
);
/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User created
 */
router.post(
  "/",
  authorizePermissions("admin", "manager"),
  usersController.createUser
);
/**
 * @swagger
 * /users/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a single user
 *     responses:
 *       200:
 *         description: User details
 */
router.get(
  "/user",
  authorizePermissions("admin", "manager", "guard", "host"),
  usersController.getOneUser
);

/**
 * @swagger
 * /users/user:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch(
  "/user",
  authorizePermissions("admin", "manager"),
  usersController.updateUser
);

/**
 * @swagger
 * /users/user:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
  "/user",
  authorizePermissions("admin"),
  usersController.deleteUser
);
export default router;
