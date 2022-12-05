export type CommentsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModelType[];
};

export type CommentViewModelType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};
