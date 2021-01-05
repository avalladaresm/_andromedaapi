import { Service } from "@tsed/common";
import { Conflict, InternalServerError, NotFound } from '@tsed/exceptions';
import { TypeORMService } from "@tsed/typeorm";
import { Connection, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { Log } from "../entity/LogEntity";
import { Users } from "../entity/UsersEntity";

interface LogData {
  userName: string
  type: string
  date: string
  description: string
  data: string
}

@Service()
export class LogService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async doesUserExists(userName: string): Promise<boolean> {
    let count = await this.connection.manager.count(Users, { where: { userName: userName } })
    return count === 0 ? false : true
  }

  async getLogs(): Promise<Log[]> {
    const logs = await this.connection.manager.find(Log);
    return logs
  }

  async createLog(data: LogData): Promise<void> {
    const exists = await this.doesUserExists(data.userName);
    if (!exists) {
      throw new NotFound("User not found.");
    }
    try {
      await this.connection.manager.create(Log, data)
    }
    catch (e) {
      throw new InternalServerError("Error creating log.");
    }
  }

}
