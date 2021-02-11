import { Controller, Get, UseBefore } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { AuthorizeRequest } from '../middlewares/AuthorizeRequest';
import { ActivityLogResult } from '../models/ActivityLog';
import { ActivityLogService } from '../services/ActivityLogService';

@Controller('/activitylog')
@UseBefore(AuthorizeRequest)
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) { }

  @Get('/getActivityLogs')
  @ContentType('application/json')
  async getActivityLogs(): Promise<ActivityLogResult[]> {
    try {
      const activityLogs: ActivityLogResult[] = await this.activityLogService.getActivityLogs()
      return activityLogs
    }
    catch (e) {
      throw e
    }
  }
}