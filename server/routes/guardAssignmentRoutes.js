import express from 'express'
const router = express.Router()
import * as guardAssignmentsController from '../controllers/guardAssignmentsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'
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
router.use(authMiddleware)

// ===== GUARD ASSIGNMENT MANAGEMENT ROUTES =====
router.post('/:siteId/:guardId/assign', authorizePermissions('admin', 'manager'), guardAssignmentsController.assignGuardToSite)
router.get('/', authorizePermissions('admin', 'manager'), guardAssignmentsController.getAllGuardAssignments)
router.get('/active', authorizePermissions('admin', 'manager'), guardAssignmentsController.getActiveGuardAssignments)
router.get('/:id', authorizePermissions('admin', 'manager'), guardAssignmentsController.getOneGuardAssignment)
router.patch('/:id', authorizePermissions('admin', 'manager'), guardAssignmentsController.updateGuardAssignment)
router.delete('/:id', authorizePermissions('admin', 'manager'), guardAssignmentsController.deleteGuardAssignment)
