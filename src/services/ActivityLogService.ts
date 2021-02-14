import { Service } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { ActivityLogCreate, ActivityLogResult } from "../models/ActivityLog";

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

  async createActivityLog(data: ActivityLogCreate): Promise<void> {
    try {
      await this.connection.query('EXECUTE ActivityLog_CreateActivityLog @0, @1, @2, @3, @4, @5, @6, @7, @8', [
        data.username, data.typeId, data.description, data.data, data.ip, data.osplatform, data.browsername, data.browserversion, data.accountExists
      ])
    }
    catch (e) {
      throw e
    }
  }
}
