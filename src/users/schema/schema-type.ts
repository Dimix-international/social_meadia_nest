export type UserSchemaType = {
  id: string;
  login: string;
  email: string;
  password: string;
  activationCode: string;
  isActivated: boolean;
  countSendEmailsActivated: number;
  createdAt: Date;
  updatedAt: Date;
};
