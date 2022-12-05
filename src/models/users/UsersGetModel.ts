export type UsersGetModel = {
  pageNumber: string;
  pageSize: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchLoginTerm: string;
  searchEmailTerm: string;
};
