import {BodyParams, Controller, Get, Post} from '@tsed/common';
import { Returns } from '@tsed/schema';
import { Log } from '../entity/LogEntity';
import { LogService } from '../services/LogService';

interface LogData {
    userName: string
    type: string
    date: string
    description: string
    data: string
}

@Controller('/logs')
export class LogController {
  constructor(private logService: LogService) {}

  @Get('/')
  @Returns(200, Array).Of(Log)
  async getLogs(): Promise<Log[]> {
    const logs = await this.logService.getLogs()
    return logs
  }
  
  @Post('/')
  async createLog(@BodyParams('data') data: LogData): Promise<void> {
    await this.logService.createLog(data)
  }

}