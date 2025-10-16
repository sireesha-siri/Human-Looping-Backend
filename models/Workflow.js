// ============================================
// Workflow data model
// ============================================
import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workflow name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Workflow description is required']
  },
  type: {
    type: String,
    enum: ['deployment', 'email_campaign', 'financial_transaction', 'code_review', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['created', 'pending_approval', 'approved', 'rejected', 'completed', 'failed'],
    default: 'created'
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  metadata: {
    type: Map,
    of: String
  },
  createdBy: {
    type: String,
    default: 'AI Agent'
  }
}, {
  timestamps: true
});

// Index for faster queries
workflowSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Workflow', workflowSchema);