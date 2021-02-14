import { IMiddleware, Middleware, Next, Req } from '@tsed/common';
import { BadRequest, Forbidden, Unauthorized } from '@tsed/exceptions';
var jwt = require('jsonwebtoken');

@Middleware()
export class AuthorizeRequest implements IMiddleware {
  use(@Req() req: Req, @Next() next: Next) {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) throw new Unauthorized('You are not authorized to view the contents of this page!')

    jwt.verify(accessToken, process.env.MY_SUPER_SECRET, (err: any) => {
      switch (err && err.name) {
        case 'TokenExpiredError':
          throw new Forbidden('Your session is no longer valid!')
        case 'JsonWebTokenError':
          throw new BadRequest('There is an error with your session data!')
        default:
          next()
      }
    })
  }
}