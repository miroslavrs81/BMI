import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ValidationCode } from 'src/entities/validation-code.entity';
import { MailVerificationListener } from 'src/events/mail-verification.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ValidationCode]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailVerificationListener],
  exports: [AuthService],
})
export class AuthModule {}
