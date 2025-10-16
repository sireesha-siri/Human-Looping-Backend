// ============================================
// Approval data model
// ============================================
import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: String
  },
  feedback: {
    type: String
  },
  actionHistory: [{
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    user: String,
    notes: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
approvalSchema.index({ status: 1, requestedAt: -1 });
approvalSchema.index({ workflowId: 1 });

export default mongoose.model('Approval', approvalSchema);
