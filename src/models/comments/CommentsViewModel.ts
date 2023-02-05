import { LIKE_STATUSES } from '../../constants/general/general';

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
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LIKE_STATUSES;
  };
};
