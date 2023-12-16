import { WorkoutService } from './workout.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@ApiTags('/workout')
@Controller('/workouts')
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
  @Post('/:id/invite')
  async inviteUsers(
    @Param('id') id: string,
    @Body() invitedEmails: { emails: string },
  ): Promise<void> {
    return await this.workoutService.inviteUsers(+id, invitedEmails);
  }

  @Get('/:id/invite')
  async verifyInvite(
    @Param('id') id: string,
    @Query('email') email: string,
    @Query('token') token: string,
  ) {
    return await this.workoutService.verifyInvite(+id, email, token);
  }

  @Get('/check/mail')
  async checkDoesEmailExists(@Query('email') email: string) {
    return await this.workoutService.checkDoesEmailExists(email);
  }
}
