import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingDataRepository } from './testing-data.repository';
import { HTTP_STATUSES } from '../constants/general/general';

@Controller('all-data')
export class TestingDataController {
  constructor(protected testingDataRepository: TestingDataRepository) {}

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Delete()
  async deleteAllData() {
    await this.testingDataRepository.deleteAllData();
  }
}
