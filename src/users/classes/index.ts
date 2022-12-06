import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  createdAt: Date;
  activationCode: string;
  isActivated: boolean;
  countSendEmailsActivated: number;

  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.activationCode = uuidv4();
    this.isActivated = false;
    this.countSendEmailsActivated = 0;
  }
}
