import { Controller, Get, UseBefore } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { AuthorizeRequest } from '../middlewares/AuthorizeRequest';
import { AuthLogResult } from '../models/AuthLog';
import { AuthLogService } from '../services/AuthLogService';

@Controller('/authlog')
@UseBefore(AuthorizeRequest)
export class AuthLogController {
  constructor(private authLogService: AuthLogService) { }

  @Get('/getAllAuthLogs')
  @ContentType('application/json')
  async getAllAuthLogs(): Promise<AuthLogResult[]> {
    try {
      const authLogs: AuthLogResult[] = await this.authLogService.getAllAuthLogs()
      return authLogs
    }
    catch (e) {
      throw e
    }
  }

}