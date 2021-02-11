import { Service } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { ActivityLogResult } from "../models/ActivityLog";

@Service()
export class ActivityLogService {
  private connection: Connection;
  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async getActivityLogs(): Promise<ActivityLogResult[]> {
    try {
      const activityLogs = await this.connection.query('EXECUTE ActivityLog_GetActivityLogs')
      if (activityLogs.length === 0) throw new NotFound('No activity logs found.')
      return activityLogs
    }
    catch (e) {
      throw e
    }
  }
}
