import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty()
  @IsNumber()
  workoutId: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  token: string;
}
