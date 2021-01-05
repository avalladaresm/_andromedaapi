import {Service} from "@tsed/common";
import { Conflict, NotFound } from '@tsed/exceptions';
import {TypeORMService} from "@tsed/typeorm";
import {Connection, DeleteResult, InsertResult, UpdateResult} from "typeorm";
import {Users, UsersDataToUpdate} from "../entity/UsersEntity";

@Service()
export class UsersService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }
  
  async doesUserExists(userId: number | string): Promise<boolean> {
    let count = 0;
    if (typeof userId === 'number')
      count = await this.connection.manager.count(Users, {where:{id: userId}})
    else if (typeof userId === 'string') {
      count = await this.connection.manager.count(Users, {where:{userName: userId}})      
    }
    return count === 0 ? false : true
  }
  
  async getAllUsers(): Promise<Users[]> {
    const users = await this.connection.manager.find(Users);
    return users
  }

  async getUserById(id: number): Promise<Users> {
    const exists = await this.doesUserExists(id);
    if (!exists) {
      throw new NotFound("User not found.");
    }

    try {
      const user = await this.connection.manager.findOneOrFail(Users, id)
      return user
    }
    catch (e) {
      throw new NotFound("User not found.");
    }
  }

  async getUserByUsername(username: string): Promise<Users> {
    const exists = await this.doesUserExists(username);
    if (!exists) {
      throw new NotFound("User not found.");
    }

    try {
      const user = await this.connection.manager.findOneOrFail(Users, {where:{userName: username}})
      return user
    }
    catch (e) {
      throw new NotFound("User not found.");
    }
  }

  async deleteUserById(id: number): Promise<DeleteResult> {
    const exists = await this.doesUserExists(id);
    if (!exists) {
      throw new NotFound("User not found.");
    }

    try {
      const result = await this.connection.manager.delete(Users, id)
      return result
    }
    catch(e) {
      throw new Conflict('User cannot be deleted.')
    }
  }

  async updateUserById(id: number, data: UsersDataToUpdate): Promise<UpdateResult> {
    const exists = await this.doesUserExists(id);
    if (!exists) {
      throw new NotFound("User not found.");
    }
    
    try {
      const result = await this.connection.manager.update('Users', id, data)
      return result
    }
    catch(e) {
      throw new Conflict('User cannot be updated.')
    }
  }

  async createUser(data: Users): Promise<InsertResult> {
    data.setPassword(data.password)
    const res = await this.connection.manager.insert(Users, data)
    return res
  }
}
