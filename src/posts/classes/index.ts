import { v4 as uuidv4 } from 'uuid';

export class Post {
  id: string;
  createdAt: Date;

  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
  ) {
    this.id = uuidv4();
    this.createdAt = new Date();
  }
}
