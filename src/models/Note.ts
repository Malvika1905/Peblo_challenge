import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  content: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true,
  },
  summary: {
    type: String,
    default: '',
  },
  actionItems: {
    type: [String],
    default: [],
  },
  suggestedTitle: {
    type: String,
    default: '',
  },
  aiUsageCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Index for search
NoteSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
