import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LIKE_STATUSES } from '../../constants/general/general';

export type UserLikesDocument = HydratedDocument<UserLikes>;

@Schema({ versionKey: false, timestamps: true })
export class Like {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  documentId: string;

  @Prop({ type: String, default: LIKE_STATUSES.NONE })
  likeStatus: LIKE_STATUSES;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

export type UserLikesType = 'commentsLikes' | 'postsLikes';

@Schema({ versionKey: false, timestamps: true })
export class UserLikes {
  @Prop({ type: String, required: true, unique: true })
  senderId: string;
  @Prop({ type: String, required: true })
  senderLogin: string;
  @Prop({ type: [LikeSchema], default: [] })
  commentsLikes: Like[];
  @Prop({ type: [LikeSchema], default: [] })
  postsLikes: Like[];
}

export const UserLikesSchema = SchemaFactory.createForClass(UserLikes);
