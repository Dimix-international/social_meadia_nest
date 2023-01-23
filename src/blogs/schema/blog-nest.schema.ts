import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ versionKey: false, timestamps: true })
export class Blog {
  @Prop({ required: true, type: String, unique: true })
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  websiteUrl: string;

  @Prop({ type: Date, required: true, default: Date })
  createdAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
