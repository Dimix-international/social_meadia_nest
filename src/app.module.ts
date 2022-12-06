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

@Module({
  imports: [],
  controllers: [
    BlogsController,
    PostsController,
    TestingDataController,
    CommentsController,
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
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    TestingDataRepository,
  ],
})
export class AppModule {}
