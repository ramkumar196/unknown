import { IsString } from 'class-validator';
import { IsEmail } from '../../../node_modules/class-validator/index';

class VerifyResetUrlDto {
  @IsString()
  public token: string;
  @IsEmail()
  public email: string;
}

export default VerifyResetUrlDto;