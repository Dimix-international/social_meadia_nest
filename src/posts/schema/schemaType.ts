import mongoose from 'mongoose';
import { PostSchemaType } from './post-schema';

export const PostSchema = new mongoose.Schema<PostSchemaType>(
  {
    id: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PostModel = mongoose.model<PostSchemaType>('posts', PostSchema);
