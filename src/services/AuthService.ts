import { Service } from '@tsed/common';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { TypeORMService } from '@tsed/typeorm';
import { response } from 'express';
import { Connection } from 'typeorm';
import { Account } from '../entity/AccountEntity';
import { Users } from '../entity/UsersEntity';
import { Account as IAccount } from '../models/Account';
import { VerifiedAccount } from '../models/VerifiedAccount';
const sgMail = require('@sendgrid/mail')
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

@Service()
export class AuthService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get('default')!; // get connection by name
  }

  async doesAccountUsernameExists(username: string): Promise<boolean> {
    const exists = await this.connection.query('EXECUTE Account_UsernameExists @0', [username])
    return Boolean(Object.values(exists[0])[0])
  }

  async doesAccountEmailExists(email: string): Promise<boolean> {
    const exists = await this.connection.query('EXECUTE Account_EmailExists @0', [email])
    return Boolean(Object.values(exists[0])[0])
  }

  async signin(username: string, password: string): Promise<{}> {
    const exists = await this.doesAccountUsernameExists(username);
    if (!exists) {
      throw new NotFound('User not found.');
    }

    try {
      const user = await this.connection.manager.findOneOrFail(Users, { where: { userName: username } })
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
      throw new NotFound('User not found.');
    }
  }

  async signup(data: IAccount): Promise<void> {
    const usernameExists = await this.doesAccountUsernameExists(data.username);
    if (usernameExists) {
      throw new UnprocessableEntity(`User ${data.username} already exists.`);
    }

    const emailExists = await this.doesAccountEmailExists(data.email);
    if (emailExists) {
      throw new UnprocessableEntity(`Email ${data.email} already exists.`);
    }

    const createBusinessAccountQuery = 'EXECUTE Account_CreateBusinessAccount @0, @1, @2, @3, @4'
    const createPersonAccountQuery = 'EXECUTE Account_CreatePersonAccount @0, @1, @2, @3, @4, @5'

    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      const account =
        data.accountTypeId === 1 ?
          await this.connection.query(
            createPersonAccountQuery, [data.username, hashedPassword, data.email, data.accountTypeId, data.name, data.surname]
          ) :
          await this.connection.query(
            createBusinessAccountQuery, [data.username, hashedPassword, data.email, data.accountTypeId, data.name]
          );
      const inserted = await this.connection.manager.findOne(Account, { where: { username: account[0].username } })

      const verificationToken = jwt.sign({ id: inserted?.id }, process.env.MY_SUPER_SECRET_VERIFICATION, {
        expiresIn: 86400 // 24 hours
      });

      const msg = {
        to: process.env.SENDGRID_RECEIVER,
        from: process.env.SENDGRID_SENDER,
        subject: 'Verify your account',
        text: `Welcome to Tecal! Now, please verify your account by clicking the following link: http://localhost:3000/auth/verify?id=${inserted?.id}&accessToken=` + verificationToken,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error: any) => {
          console.log(error)
        })

      return account[0]
    }
    catch (e) {
      throw new BadRequest('Something happened...');
    }
  }

  async verify(id: number, accessToken: string): Promise<VerifiedAccount> {
    try {
      const decoded = jwt.verify(accessToken, process.env.MY_SUPER_SECRET_VERIFICATION);
      const dateNow = new Date().getTime()
      const expiresAt = decoded.exp * 1000

      return dateNow < expiresAt && this.connection.query('EXECUTE Account_VerifyAccount @0', [id])
    }
    catch (e) {
      throw new BadRequest('Something happened...');
    }
  }
}
