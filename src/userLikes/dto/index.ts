import { v4 as uuidv4 } from 'uuid';
import { LIKE_STATUSES } from '../../constants/general/general';

export class Like {
  id: string;
  createdAt: Date;
  documentId: string;
  senderId: string;
  senderLogin: string;
  likeStatus: LIKE_STATUSES;

  constructor(data: CreateLikeType) {
    const { senderId, documentId, likeStatus, senderLogin } = data;
    this.id = uuidv4();
    this.createdAt = new Date();
    this.senderId = senderId;
    this.documentId = documentId;
    this.senderLogin = senderLogin;
    this.likeStatus = likeStatus;
  }
}

type CreateLikeType = {
  documentId: string;
  senderId: string;
  senderLogin: string;
  likeStatus: LIKE_STATUSES;
};
