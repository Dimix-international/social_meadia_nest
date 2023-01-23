import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

// and document
// @Schema({ versionKey: false })
// class aD {
//   @Prop({ type: String, required: true })
//   login: string;
// }
//
// const schemaFromAd = SchemaFactory.createForClass(aD);
//
// @Schema({ versionKey: false, timestamps: true })
// class u {
//   @Prop({ type: String, required: true })
//   id: string;
//   @Prop({ type: schemaFromAd })
//   accountData: aD;
// }
// and result schema for U

@Schema({ versionKey: false, timestamps: true })
export class Post {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Date, required: true, default: Date })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
