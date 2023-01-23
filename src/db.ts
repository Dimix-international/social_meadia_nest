import { MongoClient } from 'mongodb';
import { settings } from './settings';
import mongoose from 'mongoose';

//settings.MONGO_URI
const client = new MongoClient(
  `${settings.MONGO_URI}/${settings.MONGO_DBName}`,
);
const db = client.db(); //имя db

export const BlogsCollection = db.collection<BlogType>('blogs');
export const PostsCollection = db.collection<PostType>('posts');
export const UsersCollection = db.collection<UserType>('users');
export const AuthCollection = db.collection<AuthType>('auth');
export const CommentsCollection = db.collection<CommentType>('comments');

export async function runDb() {
  try {
    //  await client.connect();
    console.log(settings.MONGO_URI);
    await mongoose.connect(`${settings.MONGO_URI}/${settings.MONGO_DBName}`);
    // await client.db('social-info').command({ ping: 1 });
    console.log('Connected successfully to mongo server!');
  } catch (e) {
    console.log(e);
    // await client.close();
    await mongoose.disconnect();
  }
}

type AuthType = {
  userId: string;
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};

type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};

type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

type UserType = {
  id: string;
  login: string;
  password: string;
  email: string;
  createdAt: Date;
  activationCode: string;
  isActivated: boolean;
  countSendEmailsActivated: number;
};

type CommentType = {
  id: string;
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};
