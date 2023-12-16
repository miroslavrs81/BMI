import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags()
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
