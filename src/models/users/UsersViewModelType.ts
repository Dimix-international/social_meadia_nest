export type UsersViewModelType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewModelType[];
};

export type UserViewModelType = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};
