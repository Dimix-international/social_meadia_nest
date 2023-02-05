import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LIKE_STATUSES } from '../../constants/general/general';

export type UserLikesDocument = HydratedDocument<UserLikes>;

@Schema({ versionKey: false, timestamps: true })
export class UserLikes {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  documentId: string;

  @Prop({ type: String, required: true })
  senderId: string;

  @Prop({ type: String, required: true })
  senderLogin: string;

  @Prop({ type: String, required: true, default: LIKE_STATUSES.NONE })
  likeStatus: LIKE_STATUSES;

  @Prop({ type: Date, required: true, default: Date })
  createdAt: Date;
}

export const UserLikesSchema = SchemaFactory.createForClass(UserLikes);
