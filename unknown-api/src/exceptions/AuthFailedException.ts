import HttpException from './HttpException';

class AuthFailedException extends HttpException {
  constructor() {
    super(401, 'Authentication Failed');
  }
}

export default AuthFailedException;