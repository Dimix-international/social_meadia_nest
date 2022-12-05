import { PostViewModelType } from '../posts/PostsViewModelType';

export type BlogsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};

export type PostsForBlogViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModelType[];
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};
