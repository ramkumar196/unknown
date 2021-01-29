import { IsString } from 'lib/user/lib/post/lib/authentication/post/user/authentication/class-validator';
import { IsEmail } from '../../../node_modules/class-validator/index';

class ResetPasswordDto {
  @IsEmail()
  public email: string;
}

export default ResetPasswordDto;