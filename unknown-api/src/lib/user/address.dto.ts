import { IsString } from 'lib/user/lib/post/lib/authentication/post/user/authentication/class-validator';

class CreateAddressDto {
  @IsString()
  public street: string;
  @IsString()
  public city: string;
  @IsString()
  public country: string;
}

export default CreateAddressDto;
