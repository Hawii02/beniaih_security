import express from 'express'
const router = express.Router()
import * as guardsController from '../controllers/guardsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

// Apply authentication middleware to all guard routes
router.use(authMiddleware)

// ===== GUARD MANAGEMENT ROUTES =====
router.post('/', authorizePermissions('admin', 'manager'), guardsController.createGuard)
router.get('/', authorizePermissions('admin', 'manager'), guardsController.getAllGuards)
router.get('/:id', authorizePermissions('admin', 'manager'), guardsController.getOneGuard)
router.put('/:id', authorizePermissions('admin', 'manager'), guardsController.updateGuard)
router.delete('/:id', authorizePermissions('admin'), guardsController.deleteGuard)

// ===== STATUS MANAGEMENT ROUTES =====
router.put('/:id/status', authorizePermissions('admin', 'manager'), guardsController.updateGuardStatus)

// ===== GATES MANAGEMENT ROUTES =====
router.get('/:id/assignments', authorizePermissions('admin', 'manager'), guardsController.getGuardHistory)
// router.post('/:id/assignments', authorizePermissions('admin', 'manager'), guardsController.assignGuardToSite)
router.put('/:id/assignments/:assignmentId/terminate', authorizePermissions('admin', 'manager'), guardsController.terminateGuardAssignment)

// ===== HISTORY MANAGEMENT ROUTES =====
router.get('/:id/history', authorizePermissions('admin', 'manager'), guardsController.getGuardHistory)

// ===== LOGS MANAGEMENT ROUTES =====
router.get('/:id/logs', authorizePermissions('admin', 'manager'), guardsController.exportGuardLogs)




export default router