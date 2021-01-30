import { Service } from "@tsed/common";
import { BadRequest, NotFound, UnprocessableEntity } from "@tsed/exceptions";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { Account } from "../entity/AccountEntity";
import { CreateBusinessAccount, CreatePersonAccount, PersonAccountResult } from "../models/Account";
import { format } from 'date-fns'
const sgMail = require('@sendgrid/mail')
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

@Service()
export class AccountService {
  private connection: Connection;
  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async doesAccountUsernameExists(username: string): Promise<boolean> {
    const exists = await this.connection.query('EXECUTE Account_UsernameExists @0', [username])
    return Boolean(Object.values(exists[0])[0])
  }

  async doesAccountEmailExists(email: string): Promise<boolean> {
    const exists = await this.connection.query('EXECUTE Account_EmailExists @0', [email])
    return Boolean(Object.values(exists[0])[0])
  }

  async getAllAccounts(): Promise<any> {
    try {
      const accounts = await this.connection.query('EXECUTE Account_GetAllAccounts')
      if (accounts.length === 0) throw new NotFound('No accounts found.')
      return accounts
    }
    catch (e) {
      throw e
    }
  }

  async getAllPersonAccounts(): Promise<PersonAccountResult[]> {
    try {
      const accounts: PersonAccountResult[] = await this.connection.query('EXECUTE Account_GetAllPersonAccounts')
      if (accounts.length === 0) throw new NotFound('No accounts found.')
      return accounts
    }
    catch (e) {
      throw e
    }
  }

  async getAllBusinessAccounts(): Promise<any> {
    try {
      const accounts = await this.connection.query('EXECUTE Account_GetAllBusinessAccounts')
      if (accounts.length === 0) throw new NotFound('No accounts found.')
      return accounts
    }
    catch (e) {
      throw e
    }
  }

  async createBusinessAccount(data: CreateBusinessAccount): Promise<void> {
    const usernameExists = await this.doesAccountUsernameExists(data.username);
    if (usernameExists) {
      throw new UnprocessableEntity(`User ${data.username} already exists.`);
    }

    const emailExists = await this.doesAccountEmailExists(data.email);
    if (emailExists) {
      throw new UnprocessableEntity(`Email ${data.email} already exists.`);
    }

    const createBusinessAccountQuery = 'EXECUTE Account_CreateBusinessAccount @0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11, @12'

    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      const account = await this.connection.query(createBusinessAccountQuery,
        [data.username, hashedPassword, data.email, data.accountTypeId, data.name, data.phoneNumber,
        data.streetAddress1, data.streetAddress2, data.cityId, data.stateId, data.countryId, data.zip, data.coordinates]
      );

      if (account[0].ErrorMessage) throw new BadRequest(account[0].ErrorMessage);

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
        to: process.env.RECEIVER_EMAIL,
        from: process.env.SENDER_EMAIL,
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
      throw e;
    }
  }

  async createPersonAccount(data: CreatePersonAccount): Promise<void> {
    const usernameExists = await this.doesAccountUsernameExists(data.username);
    if (usernameExists) {
      throw new UnprocessableEntity(`User ${data.username} already exists.`);
    }

    const emailExists = await this.doesAccountEmailExists(data.email);
    if (emailExists) {
      throw new UnprocessableEntity(`Email ${data.email} already exists.`);
    }

    const createPersonAccountQuery = 'EXECUTE Account_CreatePersonAccount @0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11, @12, @13'

    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      const account = await this.connection.query(createPersonAccountQuery,
        [data.username, hashedPassword, data.email, data.accountTypeId, data.name, data.surname, data.phoneNumber,
        data.streetAddress1, data.streetAddress2, data.cityId, data.stateId, data.countryId, data.zip, data.coordinates]
      );

      if (account[0].ErrorMessage) throw new BadRequest(account[0].ErrorMessage);

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
        to: process.env.RECEIVER_EMAIL,
        from: process.env.SENDER_EMAIL,
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
      throw e;
    }
  }

}
