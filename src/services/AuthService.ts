import { Service } from '@tsed/common';
import { BadRequest, NotFound, Unauthorized, UnprocessableEntity } from '@tsed/exceptions';
import { TypeORMService } from '@tsed/typeorm';
import { Connection } from 'typeorm';
import { Account } from '../entity/Account';
import { AccountLoginData, AccountSignupData } from '../models/Account';
import { VerifiedAccount } from '../models/VerifiedAccount';
import { format } from 'date-fns'
import { CurrentUserAuthData } from '../models/CurrentUserAuthData';
import { AuthLogService } from './AuthLogService';
import { AuthLog } from '../models/AuthLog';
import { ActivityLogService } from './ActivityLogService';
import { ActivityLogType } from '../models/ActivityLogType';

const sgMail = require('@sendgrid/mail')
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

enum AuthType {
  LOG_IN = 1,
  LOG_OUT = 2
}
@Service()
export class AuthService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService, private authLog: AuthLogService, private activityLog: ActivityLogService) { }

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

  async signin(data: AccountLoginData): Promise<CurrentUserAuthData> {
    try {
      const platform: AuthLog = {
        ip: data.platform.ip,
        osplatform: data.platform.osplatform,
        browsername: data.platform.browsername,
        browserversion: data.platform.browserversion
      }

      const account = await this.connection.manager.findOne(Account, { where: { username: data.username } })
      if (!account) {
        await this.activityLog.createActivityLog({
          username: data.username,
          typeId: ActivityLogType.LOG_IN_FAILED_ACCOUNT_NOT_FOUND,
          description: `Account ${data.username} couldn't complete log in.`,
          data: `Account ${data.username} not found.`,
          ...platform,
          accountExists: 0
        })
        throw new NotFound(`Account ${data.username} not found.`);
      }

      const hashedPassword = bcrypt.compareSync(data.password, account?.password)
      if (!hashedPassword) {
        await this.activityLog.createActivityLog({
          username: data.username,
          typeId: ActivityLogType.LOG_IN_FAILED_PASSWORD_INCORRECT,
          description: `Account ${data.username} couldn't complete log in.`,
          data: 'Invalid password.',
          ...platform,
          accountExists: 1
        })
        throw new Unauthorized('Invalid password.')
      }

      const role = await this.connection.query('EXECUTE Account_GetAccountRole @0', [data.username])
      if (role.length === 0) {
        await this.activityLog.createActivityLog({
          username: data.username,
          typeId: ActivityLogType.LOG_IN_FAILED_ACCOUNT_HAS_NO_ROLE,
          description: `Account ${data.username} couldn't complete log in.`,
          data: 'This account has no role.',
          ...platform,
          accountExists: 1
        })
        throw new Unauthorized('This account has no role. Contact support.')
      }

      var token = jwt.sign({ id: account.id }, process.env.MY_SUPER_SECRET, {
        expiresIn: 86400 // 24 hours
      });

      await this.activityLog.createActivityLog({
        username: data.username, typeId: ActivityLogType.LOG_IN, description: `${data.username} logged in successfully.`, data: '-', ...platform, accountExists: 1
      })
      await this.authLog.createAuthLog(account.id, AuthType.LOG_IN, platform)

      const loginRes: CurrentUserAuthData = { u: data.username, a_t: token, r: role[0].role, aid: account.id }
      return loginRes
    }
    catch (e) {
      throw e
    }
  }

  async signup(data: AccountSignupData): Promise<void> {
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
        expiresIn: 1800 // 30 min
      });

      const decodedToken = jwt.verify(verificationToken, process.env.MY_SUPER_SECRET_VERIFICATION);
      const expDate = new Date(decodedToken.exp * 1000)
      const currentTimezone = format(new Date(), 'xxx') // -08:00, +05:30, +00:00	
      const createVerificationDetails = await this.connection.query(
        'EXECUTE AccountVerification_CreateVerificationDetails @0, @1, @2, @3', [decodedToken.id, verificationToken, expDate, currentTimezone]
      )

      const msg = {
        to: 'alejo.valladares14@gmail.com',
        from: 'javalladaresm24@hotmail.com',
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
      const getVerificationDetails = await this.connection.query('EXECUTE AccountVerification_GetVerificationDetails @0', [id])
      if (getVerificationDetails.length === 0) {
        throw new Unauthorized('Oops. This link already expired!')
      }

      const decoded = jwt.verify(accessToken, process.env.MY_SUPER_SECRET_VERIFICATION);
      const dateNow = new Date().getTime()
      const expiresAt = decoded.exp * 1000
      if (id === decoded.id && accessToken === getVerificationDetails[0].accessToken && dateNow < expiresAt) {
        const hmm = await this.connection.query('EXECUTE Account_VerifyAccount @0', [id])
        return hmm
      }
      else {
        throw new Unauthorized('Oops. This link is no longer valid!')
      }
    }
    catch (e) {
      throw e
    }
  }

  async logout(username: string, authlog: AuthLog): Promise<void> {
    try {
      const platform: AuthLog = {
        ip: authlog.ip,
        osplatform: authlog.osplatform,
        browsername: authlog.browsername,
        browserversion: authlog.browserversion
      }

      const account = await this.connection.manager.findOne(Account, { where: { username: username } })
      if (!account) {
        await this.activityLog.createActivityLog({
          username: username,
          typeId: ActivityLogType.LOG_OUT_FAILED_ACCOUNT_NOT_FOUND,
          description: `Account ${username} couldn't complete log out.`,
          data: `Account ${username} not found.`,
          ...platform,
          accountExists: 0
        })
        throw new NotFound(`Account ${username} not found.`);
      }

      await this.activityLog.createActivityLog({
        username: username,
        typeId: ActivityLogType.LOG_OUT, 
        description: `${username} logged out.`, 
        data: '-', 
        ...platform, 
        accountExists: 1
      })
      await this.authLog.createAuthLog(account.id, AuthType.LOG_OUT, platform)
    }
    catch (e) {
      throw e
    }
  }
}
