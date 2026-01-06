import express from 'express'
const router = express.Router()
import * as usersController from '../controllers/usersController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

// ===== MULTIPLE USER OPERATIONS =====
router.get('/',usersController.getAllUsers)
router.post('/', authMiddleware, authorizePermissions('users.write'), usersController.createUser)

// ===== SINGLE USER OPERATIONS =====
router.get('/user', usersController.getOneUser)
router.patch('/user', authMiddleware, authorizePermissions('users.update'), usersController.updateUser)
router.delete('/user', authMiddleware, authorizePermissions('users.delete'), usersController.deleteUser)

export default router    