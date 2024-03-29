import { Service } from "@tsed/common";
import { BadRequest, NotFound, UnprocessableEntity } from "@tsed/exceptions";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { Account } from "../entity/Account";
import { CreateEmployeeAccount, EmployeeAccountResult } from "../models/Account";

const sgMail = require('@sendgrid/mail')
var bcrypt = require('bcrypt');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

@Service()
export class EmployeeService {
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

  async createEmployeeAccount(data: CreateEmployeeAccount): Promise<void> {
    const usernameExists = await this.doesAccountUsernameExists(data.username);
    if (usernameExists) {
      throw new UnprocessableEntity(`User ${data.username} already exists.`);
    }

    const emailExists = await this.doesAccountEmailExists(data.email);
    if (emailExists) {
      throw new UnprocessableEntity(`Email ${data.email} already exists.`);
    }

    const createEmployeeAccountQuery = 'EXECUTE Employee_CreateEmployeeAccount @0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11, @12, @13, @14, @15, @16, @17, @18, @19, @20, @21, @22'

    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      const account = await this.connection.query(createEmployeeAccountQuery,
        [data.username, hashedPassword, data.email, data.emailType, data.name, data.surname, data.gender, data.dob,
        data.position, data.hiredOn, data.contractType, data.salary, data.employerId, data.roleId,
        data.phoneNumber, data.phoneNumberType, data.streetAddress1, data.streetAddress2,
        data.cityId, data.stateId, data.countryId, data.zip, data.coordinates]
      );

      if (account[0].ErrorMessage) throw new BadRequest(account[0].ErrorMessage);

      const msg = {
        to: process.env.RECEIVER_EMAIL,
        from: process.env.SENDER_EMAIL,
        subject: 'Welcome!',
        text: 'Welcome to Tecal!',
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

  async getCurrentEmployerEmployees(employerId: number): Promise<EmployeeAccountResult[]> {
    try {
      const employees = await this.connection.query('EXECUTE Employee_GetEmployeeAccounts @0', [employerId])
      if (employees.length === 0) throw new NotFound('No employees found.')
      return employees
    }
    catch (e) {
      throw e
    }
  }

  async getCurrentEmployerId(employerUsername: string): Promise<number> {
    try {
      const employerAccount = await this.connection.manager.findOne(Account, { where: { username: employerUsername } })
      if (!employerAccount) throw new NotFound(`Account ${employerUsername} not found.`);
      return employerAccount.id
    }
    catch (e) {
      throw e
    }
  }

}
