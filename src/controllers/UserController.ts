import { BodyParams, Controller, Delete, Get, Patch, PathParams, Post, Put, QueryParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Returns } from '@tsed/schema';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Users, UsersDataToUpdate } from '../entity/UsersEntity';
import { UsersService } from '../services/UserService';

@Controller('/users')
export class UserController {
  constructor(private usersService: UsersService) { }

  @Get('/')
  @Returns(200, Array).Of(Users)
  async getAllUsers(): Promise<Users[]> {
    const users = await this.usersService.getAllUsers()
    return users
  }

  @Get('/:id')
  @Returns(200, Object).Of(Users).Description('A user')
  @Returns(404, NotFound).Of(Users).Description('User not found')
  async getUserById(@PathParams('id') id: number): Promise<Users> {
    const user = await this.usersService.getUserById(id)
    return user
  }

  @Get('/:userName/details')
  @Returns(200, Object).Of(Users).Description('A user')
  @Returns(404, NotFound).Of(Users).Description('User not found')
  async getUserByUsername(@PathParams('userName') userName: string): Promise<Users> {
    const user = await this.usersService.getUserByUsername(userName)
    return user
  }

  @Delete('/:id')
  async deleteUserById(@PathParams('id') id: number): Promise<DeleteResult> {
    const res = await this.usersService.deleteUserById(id)
    return res
  }

  @Put('/:id')
  async updateUserById(@PathParams('id') id: number, @BodyParams('data') data: UsersDataToUpdate): Promise<UpdateResult> {
    const user = await this.usersService.updateUserById(id, data)
    return user
  }

  @Post('/')
  async createUser(@BodyParams('data') data: Users): Promise<InsertResult> {

    const res = await this.usersService.createUser(data)
    return res
  }

}