import express from 'express'
const router = express.Router()
import * as usersController from '../controllers/usersController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

router.use(authMiddleware)

// ===== MULTIPLE USER OPERATIONS =====
router.get('/', authorizePermissions('admin','manager'), usersController.getAllUsers)
router.post('/', authorizePermissions('admin','manager'), usersController.createUser)
// ===== SINGLE USER OPERATIONS =====
router.get('/user', authorizePermissions('admin','manager', 'guard','host'), usersController.getOneUser)
router.patch('/user', authorizePermissions('admin','manager'), usersController.updateUser)
router.delete('/user', authorizePermissions('admin'), usersController.deleteUser)
export default router    