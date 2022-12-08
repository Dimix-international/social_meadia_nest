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

@Module({
  imports: [],
  controllers: [
    BlogsController,
    PostsController,
    TestingDataController,
    CommentsController,
    UserController,
    AuthRouterController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    UsersRepository,
    UsersQueryRepository,
    UserService,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    TestingDataRepository,
    EmailsService,
    EmailAdapter,
    JwtService,
    AuthService,
    AuthRepository,
    AuthQueryRepository,
  ],
})
export class AppModule {}
