import {Service} from "@tsed/common";
import { NotFound } from '@tsed/exceptions';
import {TypeORMService} from "@tsed/typeorm";
import {Connection, getConnection, UpdateResult} from "typeorm";
import { Users } from '../entity/UsersEntity';
import { UserSettings, UserSettingsToUpdate } from '../entity/UserSettingsEntity';

@Service()
export class UserSettingsService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async doesUserExists(userId: number): Promise<boolean> {
    const count = await this.connection.manager.count(Users, {where:{id: userId}})
    return count === 0 ? false : true
  }

  async getUserSettingsByUserId(userId: number): Promise<UserSettings> {
    const exists = await this.doesUserExists(userId);
    if (!exists) {
      throw new NotFound("User settings not found.");
    }
    
    const userSettings: UserSettings = await this.connection.manager.findOneOrFail(UserSettings, {where:{user:userId}})
    return userSettings
  }

  async updateUserSettingsByUserId(userId: number, data: UserSettingsToUpdate): Promise<UpdateResult> {
    const exists = await this.doesUserExists(userId);
    if (!exists) {
      throw new NotFound("User settings not found.");
    }

    const userSettings = await getConnection()
      .createQueryBuilder()
      .update('UserSettings')
      .set(data)
      .where('userId = :userId', {userId: userId})
      .execute()
    return userSettings
  }
}
