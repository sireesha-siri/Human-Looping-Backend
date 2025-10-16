// ============================================
// FILE: server/routes/workflows.js
// Workflow API routes
// ============================================
import express from 'express';
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflowStatus,
  deleteWorkflow
} from '../controllers/workflowController.js';
import { validateWorkflow } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateWorkflow, createWorkflow);
router.get('/', getWorkflows);
router.get('/:id', getWorkflowById);
router.patch('/:id/status', updateWorkflowStatus);
router.delete('/:id', deleteWorkflow);

export default router;