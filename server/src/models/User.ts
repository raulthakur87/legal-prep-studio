import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  experience: string;
  background: string;
  targetExams: string[];
  aiProvider: 'claude' | 'openai';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    experience: {
      type: String,
      default: '8-10 years'
    },
    background: {
      type: String,
      enum: ['law-graduate', 'practicing-lawyer', 'judge', 'law-student'],
      default: 'practicing-lawyer'
    },
    targetExams: [
      {
        type: String,
        enum: [
          'Scale AI',
          'Outlier AI',
          'Mark',
          'Tiering',
          'Higher Judiciary',
          'Civil Service',
          'General Practice'
        ]
      }
    ],
    aiProvider: {
      type: String,
      enum: ['claude', 'openai'],
      default: 'claude'
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
