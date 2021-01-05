import {Service} from "@tsed/common";
import { NotFound } from '@tsed/exceptions';
import {TypeORMService} from "@tsed/typeorm";
import { response } from "express";
import {Connection} from "typeorm";
import {Users} from "../entity/UsersEntity";
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

@Service()
export class AuthService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }
  
  async doesUserExists(userName: string): Promise<boolean> {
    const count = await this.connection.manager.count(Users, {where:{userName: userName}})
    return count === 0 ? false : true
  }

  async signin(username: string, password: string): Promise<{}> {
    const exists = await this.doesUserExists(username);
    if (!exists) {
      throw new NotFound("User not found.");
    }
    try {
        const user = await this.connection.manager.findOneOrFail(Users, {where:{userName: username}})
        let passwordIsValid = bcrypt.compareSync(
            password,
            user?.password
        )

        if (!passwordIsValid) {
            return response.status(401).send({
                accesstoken: null,
                message: 'Invalid password!',
            })
        }

        var token = jwt.sign({ id: user.id }, process.env.MY_SUPER_SECRET, {
            expiresIn: 86400 // 24 hours
        });
        const cookieValue = username + '|' + token
      return cookieValue
    }
    catch (e) {
      throw new NotFound("User not found.");
    }
  }

  async verifyToken(){}

}
