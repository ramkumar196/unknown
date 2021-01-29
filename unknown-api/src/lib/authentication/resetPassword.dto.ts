import { IsString } from 'class-validator';
import { IsEmail } from '../../../node_modules/class-validator/index';

class ResetPasswordDto {
  @IsEmail()
  public email: string;
}

export default ResetPasswordDto;