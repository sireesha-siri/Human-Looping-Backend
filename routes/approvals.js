// ============================================
// Approval API routes (CONTINUED)
// ============================================
import express from 'express';
import {
  getPendingApprovals,
  getAllApprovals,
  getApprovalById,
  approveWorkflow,
  rejectWorkflow
} from '../controllers/approvalController.js';
import { validateApprovalAction } from '../middleware/validation.js';

const router = express.Router();

router.get('/pending', getPendingApprovals);
router.get('/', getAllApprovals);
router.get('/:id', getApprovalById);
router.post('/:id/approve', validateApprovalAction, approveWorkflow);
router.post('/:id/reject', validateApprovalAction, rejectWorkflow);

export default router;