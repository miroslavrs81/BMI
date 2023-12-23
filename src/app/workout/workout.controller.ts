import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { WorkoutService } from './workout.service';

@ApiTags('app-workout')
@Controller('/app/workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @ApiBody({
    description: 'Multiple emails separated by comma',
    schema: {
      type: 'object',
      properties: {
        emails: {
          type: 'string',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/invite')
  async inviteUsers(
    @Param('id') workoutId: string,
    @Body() invitedEmails: { emails: string },
    @GetUser() user: User,
  ): Promise<void> {
    return await this.workoutService.inviteUsers(
      +workoutId,
      invitedEmails,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/verify')
  async verifyInvitation(
    @Body() verifyTokenDto: VerifyTokenDto,
    @GetUser() user: User,
  ): Promise<{ message: string; workout: Workout }> {
    return await this.workoutService.verifyInvitation(verifyTokenDto, user);
  }

  @Get('/check/email')
  async checkDoesEmailExists(
    @Query('email') email: string,
  ): Promise<{ userExists: boolean }> {
    return await this.workoutService.checkDoesEmailExists(email);
  }
}
