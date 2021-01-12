import { BodyParams, Context, Controller, Get, HeaderParams, PlatformResponse, Post, QueryParams, Redirect } from '@tsed/common';
import { Account } from '../models/Account';
import { VerifiedAccount } from '../models/VerifiedAccount';
import { AuthService } from '../services/AuthService';
var jwt = require('jsonwebtoken');

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/login')
  async login(@BodyParams('username') username: string, @BodyParams('password') password: string) {
    const d = await this.authService.signin(username, password)
    return d
  }

  @Get('/verify')
  async verify(
    @QueryParams('id') id: number,
    @QueryParams('accessToken') accessToken: string,
    @Context() ctx: Context
  ): Promise<PlatformResponse | VerifiedAccount> {
    const r: VerifiedAccount = await this.authService.verify(id, accessToken)
    if(ctx.response.statusCode === 200)
        return ctx.response.redirect(302, 'http://localhost:8000/auth/login')
    return r
  }

  @Post('/signup')
  async signup(@BodyParams('data') data: Account) {
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