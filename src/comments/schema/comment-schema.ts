import mongoose from 'mongoose';
import { CommentSchemaType } from './schema-type';

export const CommentSchema = new mongoose.Schema<CommentSchemaType>(
  {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userLogin: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CommentModel = mongoose.model<CommentSchemaType>(
  'comments',
  CommentSchema,
);
