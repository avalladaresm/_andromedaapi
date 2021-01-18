import { Service } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";

@Service()
export class AccountService {
  private connection: Connection;
  constructor(private typeORMService: TypeORMService) { }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!; // get connection by name
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

  async getAllPersonAccounts(): Promise<any> {
    try {
      const accounts = await this.connection.query('EXECUTE Account_GetAllPersonAccounts')
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
}
