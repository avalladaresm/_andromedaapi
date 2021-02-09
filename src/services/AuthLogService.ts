import { Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { AuthLog } from "../models/AuthLog";

@Service()
export class AuthLogService {
  private connection: Connection;
  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async createAuthLog(accountId: number, authTypeId: number, platform: AuthLog): Promise<void> {
    try {
      await this.connection.query('EXECUTE AuthLog_CreateLoginLog @0, @1, @2, @3, @4, @5', [
        platform.ip, accountId, authTypeId, platform.osplatform, platform.browsername, platform.browserversion
      ])
    }
    catch (e) {
      throw e
    }
  }
}
