import express from 'express'
const router = express.Router()
import * as visitorsController from '../controllers/visitorsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

router.use(authMiddleware)

// ===== MULTIPLE VISITOR OPERATIONS =====
router.get('/', authorizePermissions('admin','manager', 'guard', 'host'), visitorsController.getAllVisitors)
router.get('/history', authorizePermissions('admin','manager', 'guard', 'host'), visitorsController.getVisitorsHistory)
router.post('/', authorizePermissions('admin','manager', 'guard', 'host'), visitorsController.createVisitor)
router.get('/analytics/daily-count', authorizePermissions('admin','manager'), visitorsController.getDailyVisitorsCount)
router.get('/analytics/peak-hours', authorizePermissions('admin','manager'), visitorsController.getPeakVisitorHours)
router.get('/analytics/frequent-visitors', authorizePermissions('admin','manager'), visitorsController.getFrequentVisitors)

// ===== SINGLE VISITOR OPERATIONS =====
router.get('/:id', authorizePermissions('admin','manager', 'guard', 'host'), visitorsController.getOneVisitor)
router.patch('/:id', authorizePermissions('admin','manager'), visitorsController.updateVisitor)
router.patch('/:id', authorizePermissions('admin','manager', 'guard'), visitorsController.markVisitorArrived)
router.patch('/:id', authorizePermissions('admin','manager', 'guard'), visitorsController.markVisitorDeparted)
router.delete('/:id', authorizePermissions('admin'), visitorsController.deleteVisitor)

export default router    