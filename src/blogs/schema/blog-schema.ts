import mongoose from 'mongoose';
import { SchemaBlogType } from './schemaType';

export const BlogSchema = new mongoose.Schema<SchemaBlogType>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BlogModel = mongoose.model<SchemaBlogType>('blogs', BlogSchema);
