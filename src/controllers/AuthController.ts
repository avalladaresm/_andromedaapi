import { BodyParams, Context, Controller, Get, PlatformResponse, Post, QueryParams } from '@tsed/common';
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

  @Post('/signup')
  async signup(@BodyParams('data') data: AccountSignupData) {
    const d = await this.authService.signup(data)
    return d
  }
}
