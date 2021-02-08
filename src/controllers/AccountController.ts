import { BodyParams, Controller, Get, PathParams, Post, UseBefore } from '@tsed/common';
import { AuthorizeRequest } from '../middlewares/AuthorizeRequest';
import { BusinessAccountResult, CreateBusinessAccount, CreatePersonAccount, PersonAccountResult } from '../models/Account';
import { AccountRoleResult } from '../models/AccountRole';
import { AccountService } from '../services/AccountService';

@Controller('/account')
@UseBefore(AuthorizeRequest)
export class AccountController {
  constructor(private accountService: AccountService) { }

  @Get('/:username/account-role')
  async getAccountRole(@PathParams('username') username: string): Promise<AccountRoleResult> {
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
  async getAllBusinessAccounts(): Promise<BusinessAccountResult[]> {
    try {
      const accounts: BusinessAccountResult[] = await this.accountService.getAllBusinessAccounts()
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