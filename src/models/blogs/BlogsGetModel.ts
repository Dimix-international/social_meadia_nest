import { BlogViewModel } from './BlogViewModel';

export type BlogsGetModel = {
  searchNameTerm: string | null;
  pageNumber: string;
  pageSize: string;
  sortBy: keyof Omit<BlogViewModel, 'id'>;
  sortDirection: 'asc' | 'desc';
};
