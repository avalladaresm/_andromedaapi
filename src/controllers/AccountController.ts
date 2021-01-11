import { Controller, Get, PathParams } from '@tsed/common';
import { AccountService } from '../services/AccountService';

@Controller('/account')
export class AccountController {
  constructor(private accountService: AccountService) { }

}