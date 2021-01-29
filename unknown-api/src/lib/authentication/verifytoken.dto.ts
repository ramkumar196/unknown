import { IsString } from 'class-validator';

class VerifyTokenDto {
  @IsString()
  public token: string;
}

export default VerifyTokenDto;