import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password too week! Must contain minimum 6 characters, at least one UPPERCASE letter, one lowercase letter, one number and one special character!',
    },
  )
  password: string;

  @ApiProperty({
    description:
      'This property is used when verifying users invitation to workouts',
  })
  @IsOptional()
  verifiedEmail: string;
}
