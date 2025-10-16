// ============================================
// Approval business logic
// ============================================
import Approval from '../models/Approval.js';
import Workflow from '../models/Workflow.js';

// Get all pending approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({ status: 'pending' })
      .populate('workflowId')
      .sort({ requestedAt: -1 });
    
    res.json({
      success: true,
      count: approvals.length,
      data: approvals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all approvals (including approved/rejected)
export const getAllApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find()
      .populate('workflowId')
      .sort({ requestedAt: -1 });
    
    res.json({
      success: true,
      count: approvals.length,
      data: approvals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get approval by ID
export const getApprovalById = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id).populate('workflowId');
    
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval not found'
      });
    }
    
    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve workflow
export const approveWorkflow = async (req, res) => {
  try {
    const { feedback, respondedBy } = req.body;
    const approval = await Approval.findById(req.params.id);
    
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval not found'
      });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Approval already processed'
      });
    }

    // Update approval
    approval.status = 'approved';
    approval.respondedAt = new Date();
    approval.respondedBy = respondedBy || 'Human Reviewer';
    approval.feedback = feedback;
    approval.actionHistory.push({
      action: 'approved',
      timestamp: new Date(),
      user: respondedBy || 'Human Reviewer',
      notes: feedback
    });
    await approval.save();

    // Update workflow
    const workflow = await Workflow.findById(approval.workflowId);
    if (workflow) {
      workflow.status = 'approved';
      await workflow.save();
    }

    res.json({
      success: true,
      message: 'Workflow approved successfully',
      data: { approval, workflow }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject workflow
export const rejectWorkflow = async (req, res) => {
  try {
    const { feedback, respondedBy } = req.body;
    const approval = await Approval.findById(req.params.id);
    
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval not found'
      });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Approval already processed'
      });
    }

    // Update approval
    approval.status = 'rejected';
    approval.respondedAt = new Date();
    approval.respondedBy = respondedBy || 'Human Reviewer';
    approval.feedback = feedback;
    approval.actionHistory.push({
      action: 'rejected',
      timestamp: new Date(),
      user: respondedBy || 'Human Reviewer',
      notes: feedback
    });
    await approval.save();

    // Update workflow
    const workflow = await Workflow.findById(approval.workflowId);
    if (workflow) {
      workflow.status = 'rejected';
      await workflow.save();
    }

    res.json({
      success: true,
      message: 'Workflow rejected',
      data: { approval, workflow }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
