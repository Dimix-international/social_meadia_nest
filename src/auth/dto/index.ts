import { v4 as uuidv4 } from 'uuid';

export class AuthDeviceDTO {
  deviceId: string;
  lastActiveDate: string;

  constructor(public userId: string, public title: string, public ip: string) {
    this.deviceId = uuidv4();
  }

  setDateToken(createdData: string) {
    this.lastActiveDate = createdData;
  }
}
