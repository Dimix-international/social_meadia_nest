import { v4 as uuidv4 } from 'uuid';

export class Comment {
  id: string;
  createdAt: Date;

  constructor(
    public content: string,
    public userId: string,
    public userLogin: string,
    public postId: string,
  ) {
    this.id = uuidv4();
    this.createdAt = new Date();
  }
}
