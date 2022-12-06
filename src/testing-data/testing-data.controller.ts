import { Controller, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { TestingDataRepository } from './testing-data.repository';
import { HTTP_STATUSES } from '../constants/general/general';

@Controller('all-data')
export class TestingDataController {
  constructor(protected testingDataRepository: TestingDataRepository) {}

  @Delete()
  async deleteAllData(@Res() res: Response) {
    await this.testingDataRepository.deleteAllData();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
}
