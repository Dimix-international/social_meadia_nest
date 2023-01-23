import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  activationCode: string;

  @Prop({ type: Boolean, default: false })
  isActivated: boolean;

  @Prop({ type: Number, default: 0 })
  countSendEmailsActivated: number;

  @Prop({ type: Date, required: true, default: Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
