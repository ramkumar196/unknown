import { IsString } from 'class-validator';

class ChangePasswordDto {
  @IsString()
  public password: string;
  @IsString()
  public confirmPassword: string;
  @IsString()
  public token: string;
}

export default ChangePasswordDto;