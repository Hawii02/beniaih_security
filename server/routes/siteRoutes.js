import express from 'express'
const router = express.Router()
import * as sitesController from '../controllers/sitesController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

router.use(authMiddleware)

// ===== SITE SETUP AND MANAGEMENT =====
router.get('/', authorizePermissions('admin','manager'), sitesController.getAllSites)
router.get('/:id', authorizePermissions('admin','manager'), sitesController.getOneSite)
router.post('/', authorizePermissions('admin'), sitesController.createSite)
router.patch('/:id', authorizePermissions('admin'), sitesController.updateSite)
router.delete('/:id', authorizePermissions('admin'), sitesController.deleteSite)

// ===== GATE MANAGEMENT =====
router.get('/gates', authorizePermissions('admin','manager'), sitesController.getAllGates)
router.get('/gates/:id', authorizePermissions('admin','manager'), sitesController.getOneGateForSite)
router.get('/:id/gates', authorizePermissions('admin','manager'), sitesController.getAllGatesForSite)
router.post('/gates', authorizePermissions('admin'), sitesController.createGate)
router.patch('/gates/:id', authorizePermissions('admin'), sitesController.updateGate)
router.delete('/gates/:id', authorizePermissions('admin'), sitesController.deleteGate)

// ===== GUARD ASSIGNMENT TO GATES =====
router.post('/gates/:id/guards', authorizePermissions('admin'), sitesController.assignGuardsToGate)
router.delete('/gates/:id/guards/:guardId', authorizePermissions('admin'), sitesController.removeGuardFromGate)
router.get('/gates/:id/guards', authorizePermissions('admin'), sitesController.getAllGuardsForGate)

// ===== USER ASSIGNMENT TO SITES =====
router.post('/:id/users', authorizePermissions('admin'), sitesController.assignUserToSite)
router.delete('/:id/users/:userId', authorizePermissions('admin'), sitesController.removeUserFromSite)
router.get('/:id/users', authorizePermissions('admin','manager'), sitesController.getAllUsersForSite)

// ===== ANALYTICS AND MONITORING =====
router.get('/:id/visitors/live-count', authorizePermissions('admin','manager'), sitesController.getLiveVisitorCount)
router.get('/:id/analytics/daily-count', authorizePermissions('admin','manager'), sitesController.getSiteDailyVisitorCount)
router.get('/:id/analytics/peak-hours', authorizePermissions('admin','manager'), sitesController.getSitePeakHours)

// ===== EXPORT LOGS =====
router.get('/:id/logs/export', authorizePermissions('admin','manager'), sitesController.exportSiteLogs)
export default router