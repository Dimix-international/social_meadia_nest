import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/blogs.query-repository';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsRepository } from './posts/posts.repository';
import { PostsQueryRepository } from './posts/posts.query-repository';
import { UsersRepository } from './users/users.repository';
import { UsersQueryRepository } from './users/users.query-repository';
import { CommentsRepository } from './comments/comments.repository';
import { CommentsQueryRepository } from './comments/comments.query-repository';
import { CommentsService } from './comments/comments.service';
import { TestingDataController } from './testing-data/testing-data.controller';
import { CommentsController } from './comments/comments.controller';
import { TestingDataRepository } from './testing-data/testing-data.repository';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';
import { EmailsService } from './emails/emails.service';
import { EmailAdapter } from './adapters/email-adapter';
import { JwtService } from './jwt/jwt.service';
import { AuthService } from './auth/auth.service';
import { AuthRouterController } from './auth/auth.controller';
import { AuthRepository } from './auth/auth.repository';
import { AuthQueryRepository } from './auth/auth.query-repository';
import { SecurityControllerController } from './devices/security.controller';
import { SecurityService } from './devices/security.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { settings } from './settings';
import { Post, PostSchema } from './posts/schema/post-nest.schema';
import { Blog, BlogSchema } from './blogs/schema/blog-nest.schema';
import { Auth, AuthSchema } from './auth/schema/auth-nest.schema';
import { Comment, CommentSchema } from './comments/schema/comment-nest.schema';
import { User, UserSchema } from './users/schema/user-nest.schema';

const guards = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
];

const controllers = [
  BlogsController,
  PostsController,
  TestingDataController,
  CommentsController,
  UserController,
  AuthRouterController,
  SecurityControllerController,
];

const services = [
  BlogsService,
  UserService,
  CommentsService,
  EmailsService,
  JwtService,
  AuthService,
  SecurityService,
  PostsService,
];

const repositories = [
  BlogsRepository,
  BlogsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
  UsersRepository,
  UsersQueryRepository,
  CommentsRepository,
  CommentsQueryRepository,
  TestingDataRepository,
  AuthRepository,
  AuthQueryRepository,
];

const adapters = [EmailAdapter];

const models = [
  { name: User.name, schema: UserSchema },
  { name: Post.name, schema: PostSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Auth.name, schema: AuthSchema },
  { name: Comment.name, schema: CommentSchema },
];

@Module({
  imports: [
    MongooseModule.forRoot(settings.MONGO_URI),
    MongooseModule.forFeature(models),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [...controllers],
  providers: [...guards, ...services, ...repositories, ...adapters],
})
export class AppModule {}
