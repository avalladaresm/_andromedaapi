import {BodyParams, Controller, Get, HeaderParams, Post} from '@tsed/common';
import { AuthService } from '../services/AuthService';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@BodyParams('username') username: string, @BodyParams('password') password: string) {
    const d = await this.authService.signin(username, password)
    return d
  }

  @Get()
  getToken(@HeaderParams("x-access-token") token: string): string {
    console.log("token", token);

    return token;
  }
}