import { IsString } from 'lib/user/lib/post/lib/authentication/post/user/authentication/class-validator';

class VerifyTokenDto {
  @IsString()
  public token: string;
}

export default VerifyTokenDto;