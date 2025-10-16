// ============================================
// Workflow business logic
// ============================================
import Workflow from '../models/Workflow.js';
import Approval from '../models/Approval.js';

// Create new workflow
export const createWorkflow = async (req, res) => {
  try {
    const workflow = new Workflow(req.body);
    await workflow.save();

    // Automatically create approval request
    workflow.status = 'pending_approval';
    await workflow.save();

    const approval = new Approval({
      workflowId: workflow._id,
      status: 'pending'
    });
    await approval.save();

    res.status(201).json({
      success: true,
      message: 'Workflow created and pending approval',
      data: { workflow, approval }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all workflows
export const getWorkflows = async (req, res) => {
  try {
    const { status, type, riskLevel } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (riskLevel) filter.riskLevel = riskLevel;

    const workflows = await Workflow.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: workflows.length,
      data: workflows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get workflow by ID
export const getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }
    
    res.json({
      success: true,
      data: workflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update workflow status
export const updateWorkflowStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    res.json({
      success: true,
      message: 'Workflow status updated',
      data: workflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete workflow (optional - for cleanup)
export const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    // Also delete related approvals
    await Approval.deleteMany({ workflowId: req.params.id });

    res.json({
      success: true,
      message: 'Workflow deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};