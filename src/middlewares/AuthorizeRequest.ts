import { IMiddleware, Middleware, Next, Req } from '@tsed/common';
import { BadRequest, Forbidden, Unauthorized } from '@tsed/exceptions';
var jwt = require('jsonwebtoken');

@Middleware()
export class AuthorizeRequest implements IMiddleware {
  use(@Req() req: Req, @Next() next: Next) {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) throw new Unauthorized('You are not authorized to view the contents of this page!')

    jwt.verify(accessToken, process.env.MY_SUPER_SECRET, (err: any) => {
      if (err && err.name === 'TokenExpiredError') throw new Forbidden('Your session is no longer valid!')
      if (err && err.name === 'JsonWebTokenError') throw new BadRequest('There is an error with your session data!')
      next()
    })
  }
}