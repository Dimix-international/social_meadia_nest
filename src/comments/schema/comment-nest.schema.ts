import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, required: true, default: Date })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
