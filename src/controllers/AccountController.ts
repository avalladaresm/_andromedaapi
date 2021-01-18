import { Controller, Get, PathParams } from '@tsed/common';
import { AccountService } from '../services/AccountService';

@Controller('/account')
export class AccountController {
  constructor(private accountService: AccountService) { }

  @Get('/getAllAccounts')
  async verify(): Promise<any> {
    try {
      const accounts = await this.accountService.getAllAccounts()
      return accounts
    }
    catch (e) {
      throw e
    }
  }

  @Get('/getAllPersonAccounts')
  async getAllPersonAccounts(): Promise<any> {
    try {
      const accounts = await this.accountService.getAllPersonAccounts()
      return accounts
    }
    catch (e) {
      throw e
    }
  }

  @Get('/getAllBusinessAccounts')
  async getAllBusinessAccounts(): Promise<any> {
    try {
      const accounts = await this.accountService.getAllBusinessAccounts()
      return accounts
    }
    catch (e) {
      throw e
    }
  }
}