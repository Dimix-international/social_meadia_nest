import { PostViewModelType } from './PostsViewModelType';

export type PostsGetModel = {
  pageNumber: string;
  pageSize: string;
  sortBy: keyof Omit<PostViewModelType, 'id'>;
  sortDirection: 'asc' | 'desc';
};
