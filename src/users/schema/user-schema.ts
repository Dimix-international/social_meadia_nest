import mongoose from 'mongoose';
import { UserSchemaType } from './schema-type';

export const UserSchema = new mongoose.Schema<UserSchemaType>(
  {
    id: {
      type: String,
      required: true,
    },
    login: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    activationCode: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
    countSendEmailsActivated: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserSchemaType>('users', UserSchema);
