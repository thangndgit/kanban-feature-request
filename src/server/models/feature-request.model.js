import mongoose from 'mongoose';
import { FEATURE_REQUEST_STATUS, FEATURE_REQUEST_STATUS_LIST } from '../constants/feature-request.js';

// Reusable user info schema
const userInfoSchema = new mongoose.Schema({ userId: String, userName: String, email: String }, { _id: false });

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxlength: 2000 },
    images: [{ type: String, trim: true }],
    author: userInfoSchema,
    isAdmin: { type: Boolean, default: false },
    adminUsername: String, // Only set when isAdmin = true
  },
  { timestamps: true }
);

const featureRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    images: [{ type: String, trim: true }],
    status: { type: String, enum: FEATURE_REQUEST_STATUS_LIST, default: FEATURE_REQUEST_STATUS.PENDING },
    upvotes: { type: Number, default: 0, min: 0 },
    upvotedBy: [userInfoSchema],
    appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
    requester: userInfoSchema,
    comments: [commentSchema],
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    labels: [{ type: String, trim: true }],
    assignedTo: String, // dev name assigned to task
    releaseDate: Date, // deadline for in_progress or release date for done
    // Track if this request was created by admin
    createdByAdmin: { type: Boolean, default: false },
    adminCreator: String, // admin username when created by admin
  },
  { timestamps: true }
);

// Indexes for better performance
featureRequestSchema.index({ appId: 1, status: 1 });
featureRequestSchema.index({ appId: 1, createdAt: -1 });
featureRequestSchema.index({ upvotes: -1 });
featureRequestSchema.index({ 'requester.userId': 1 });

// Virtual for comment count
featureRequestSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Method to add upvote
featureRequestSchema.methods.addUpvote = function (userId, userName, email) {
  const existingVote = this.upvotedBy.find((vote) => vote.userId === userId);
  if (!existingVote) {
    this.upvotedBy.push({ userId, userName, email });
    this.upvotes = this.upvotedBy.length;
  }
  return this;
};

// Method to remove upvote
featureRequestSchema.methods.removeUpvote = function (userId) {
  this.upvotedBy = this.upvotedBy.filter((vote) => vote.userId !== userId);
  this.upvotes = this.upvotedBy.length;
  return this;
};

// Method to add comment
featureRequestSchema.methods.addComment = function (commentData) {
  this.comments.push(commentData);

  // Sort comments: admin comments first, then by creation date
  this.comments.sort((a, b) => {
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return this;
};

export default mongoose.model('FeatureRequest', featureRequestSchema);

