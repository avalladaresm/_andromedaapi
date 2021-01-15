import { BodyParams, Context, Controller, Get, HeaderParams, PathParams, PlatformResponse, Post, QueryParams } from '@tsed/common';
import { AccountLoginData, AccountSignupData } from '../models/Account';
import { VerifiedAccount } from '../models/VerifiedAccount';
import { AuthService } from '../services/AuthService';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/login')
  async login(@BodyParams('data') data: AccountLoginData) {
    const d = await this.authService.signin(data)
    return d
  }

  @Get('/verify')
  async verify(
    @QueryParams('id') id: number,
    @QueryParams('accessToken') accessToken: string,
    @Context() ctx: Context
  ): Promise<PlatformResponse | VerifiedAccount | string> {
    try {
      const r: VerifiedAccount = await this.authService.verify(id, accessToken)
      // show success template html in broswer
      if (ctx.response.statusCode === 200)
        return ctx.response.redirect(302, 'http://localhost:8000/auth/login')
      else return r
    }
    catch (e) {
      // show error template html in broswer
      throw e
    }
  }

  @Get('/:username/account-role')
  async getAccountRole(@PathParams('username') username: string): Promise<string> {
    try {
      return await this.authService.getAccountRole(username)
    }
    catch (e) {
      throw e
    }
  }

  @Post('/signup')
  async signup(@BodyParams('data') data: AccountSignupData) {
    const d = await this.authService.signup(data)
    return d
  }


  @Get()
  getToken(@HeaderParams("x-access-token") token: string): string {
    console.log("token", token);

    return token;
  }
}



/* {
  "data": {
    "username": "user10",
    "password": "mypw",
    "email": "user10@gmail.com",
    "name": "name10",
    "surname": "surname10",
    "accountTypeId": 1
  }
} */