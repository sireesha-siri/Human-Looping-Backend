
// ============================================
// FILE: server/middleware/validation.js
// Request validation middleware
// ============================================
export const validateWorkflow = (req, res, next) => {
  const { name, description, type, riskLevel } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Workflow name is required'
    });
  }

  if (!description || description.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Workflow description is required'
    });
  }

  const validTypes = ['deployment', 'email_campaign', 'financial_transaction', 'code_review', 'other'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid workflow type'
    });
  }

  const validRiskLevels = ['low', 'medium', 'high'];
  if (riskLevel && !validRiskLevels.includes(riskLevel)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid risk level'
    });
  }

  next();
};

export const validateApprovalAction = (req, res, next) => {
  const { feedback, respondedBy } = req.body;

  if (feedback && typeof feedback !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Feedback must be a string'
    });
  }

  if (respondedBy && typeof respondedBy !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Responded by must be a string'
    });
  }

  next();
};