import { BodyParams, Controller, Get, PathParams, Post, UseBefore } from '@tsed/common';
import { AuthorizeRequest } from '../middlewares/AuthorizeRequest';
import { CreateBusinessAccount, CreatePersonAccount, PersonAccountResult } from '../models/Account';
import { AccountRole } from '../models/AccountRole';
import { AccountService } from '../services/AccountService';

@Controller('/account')
export class AccountController {
  constructor(private accountService: AccountService) { }

  @Get('/:username/account-role')
  async getAccountRole(@PathParams('username') username: string): Promise<AccountRole> {
    try {
      return await this.accountService.getAccountRole(username)
    }
    catch (e) {
      throw e
    }
  }

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
  @UseBefore(AuthorizeRequest)
  async getAllPersonAccounts(): Promise<PersonAccountResult[]> {
    try {
      const accounts: PersonAccountResult[] = await this.accountService.getAllPersonAccounts()
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

  @Post('/createBusinessAccount')
  async createBusinessAccount(@BodyParams('data') data: CreateBusinessAccount) {
    const d = await this.accountService.createBusinessAccount(data)
    return d
  }

  @Post('/createPersonAccount')
  async createPersonAccount(@BodyParams('data') data: CreatePersonAccount) {
    const d = await this.accountService.createPersonAccount(data)
    return d
  }
}