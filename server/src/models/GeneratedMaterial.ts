import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneratedMaterial extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  topic: string;
  mode: 'study-notes' | 'worksheet' | 'interview-qa' | 'bare-act-summary' | 'case-analysis' | 'comparative-analysis';
  depthLevel: 'beginner' | 'practitioner' | 'expert' | 'judicial';
  content: string;
  metadata: {
    bareActSections?: string[];
    relatedCases?: string[];
    practicalInsights?: string[];
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedMaterialSchema = new Schema<IGeneratedMaterial>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    subject: {
      type: String,
      required: true,
      enum: [
        'IPC', 'CrPC', 'IEA', 'ICA', 'NI', 'Tort', 'Contract',
        'Constitutional Law', 'Administrative Law', 'Labor Law',
        'Family Law', 'Property Law', 'Succession', 'Cyber Law',
        'Environmental Law', 'Patent & IP', 'Tax Law', 'Corporate Law',
        'BNS', 'BNSS', 'BSA'
      ]
    },
    topic: {
      type: String,
      required: true,
      index: true
    },
    mode: {
      type: String,
      required: true,
      enum: ['study-notes', 'worksheet', 'interview-qa', 'bare-act-summary', 'case-analysis', 'comparative-analysis']
    },
    depthLevel: {
      type: String,
      default: 'practitioner',
      enum: ['beginner', 'practitioner', 'expert', 'judicial']
    },
    content: {
      type: String,
      required: true
    },
    metadata: {
      bareActSections: [String],
      relatedCases: [String],
      practicalInsights: [String],
      keywords: [String]
    }
  },
  {
    timestamps: true,
    collection: 'generated_materials'
  }
);

GeneratedMaterialSchema.index({ userId: 1, createdAt: -1 });
GeneratedMaterialSchema.index({ subject: 1, topic: 1 });

export const GeneratedMaterial = mongoose.model<IGeneratedMaterial>(
  'GeneratedMaterial',
  GeneratedMaterialSchema
);
