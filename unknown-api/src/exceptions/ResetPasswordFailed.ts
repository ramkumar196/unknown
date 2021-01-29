import HttpException from './HttpException';

class ResetPasswordFailedException extends HttpException {
  constructor() {
    super(400, 'Reset Password Failed');
  }
}

export default ResetPasswordFailedException;