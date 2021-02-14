import { BodyParams, Controller, Get, Post, UseBefore } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { AuthorizeRequest } from '../middlewares/AuthorizeRequest';
import { ActivityLogCreate, ActivityLogResult } from '../models/ActivityLog';
import { ActivityLogService } from '../services/ActivityLogService';
import { appendActivityLogDescription } from '../utils';

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

  @Get('/createActivityLog')
  @ContentType('application/json')
  async createActivityLog(@BodyParams('data') data: ActivityLogCreate): Promise<void> {
    try {
      const appendedData = appendActivityLogDescription(data)
      await this.activityLogService.createActivityLog(appendedData)
    }
    catch (e) {
      throw e
    }
  }
}