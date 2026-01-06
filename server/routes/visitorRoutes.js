import express from 'express'
const router = express.Router()
import * as visitorsController from '../controllers/visitorsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

// ===== MULTIPLE VISITOR OPERATIONS =====
router.get('/',authMiddleware, authorizePermissions('users.read'), visitorsController.getAllVisitors)
router.get('/history',authMiddleware, authorizePermissions('users.read'), visitorsController.getVisitorsHistory)
router.post('/', authMiddleware, authorizePermissions('users.write'), visitorsController.createVisitor)
router.get('/analytics/daily-count', authMiddleware, authorizePermissions('users.read'), visitorsController.getDailyVisitorsCount)
router.get('/analytics/peak-hours', authMiddleware, authorizePermissions('users.read'), visitorsController.getPeakVisitorHours)
router.get('/analytics/frequent-visitors', authMiddleware, authorizePermissions('users.read'), visitorsController.getFrequentVisitors)

// ===== SINGLE VISITOR OPERATIONS =====
router.get('/:id',authMiddleware, authorizePermissions('users.read'), visitorsController.getOneVisitor)
router.patch('/:id', authMiddleware, authorizePermissions('users.update'), visitorsController.updateVisitor)
router.patch('/:id', authMiddleware, authorizePermissions('users.update'), visitorsController.markVisitorArrived)
router.patch('/:id', authMiddleware, authorizePermissions('users.update'), visitorsController.markVisitorDeparted)
router.delete('/:id', authMiddleware, authorizePermissions('users.delete'), visitorsController.deleteVisitor)

export default router    