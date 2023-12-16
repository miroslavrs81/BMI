import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/register.dto';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException(returnMessages.EmailInUse);
    }
    const preparedUser = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
    const newUser = await this.userRepository.save(preparedUser);
    if (newUser) {
      delete newUser.password;
      return {
        user: newUser,
      };
    } else {
      throw new BadRequestException(returnMessages.UserNotCreated);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException(returnMessages.EmailPasswordValidation);
    }
    if (user.emailVerifiedAt === null) {
      throw new BadRequestException(returnMessages.EmailNotVerified);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      message: returnMessages.UserSuccessfullyLoggedIn,
      data: user,
      access_token: this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    };
  }
}
