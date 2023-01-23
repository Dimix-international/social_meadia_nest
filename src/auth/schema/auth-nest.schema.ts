import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ versionKey: false })
export class Auth {
  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({ type: String, required: true })
  lastActiveDate: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  deviceId: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
