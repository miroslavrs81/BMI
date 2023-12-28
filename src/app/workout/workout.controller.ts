import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

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
  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/verify')
  async verifyInvitation(
    @Body() verifyTokenDto: VerifyTokenDto,
    @GetUser() user: User,
  ): Promise<{ message: string; workout: Workout }> {
    return await this.workoutService.verifyInvitation(verifyTokenDto, user);
  }

  @ApiBearerAuth()
  @Get('/check/email')
  async checkDoesEmailExists(
    @Query('email') email: string,
  ): Promise<{ userExists: boolean }> {
    return await this.workoutService.checkDoesEmailExists(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createWorkspace(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @GetUser() user: User,
  ): Promise<Workout> {
    return await this.workoutService.createWorkout(
      createWorkoutDto,
      user,
    );
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'withDeleted', description: 'Can be true or false' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllWorkouts(
    @GetUser() user: User,
    @Query('withDeleted') withDeleted: string,
  ): Promise<{ workouts: Workout[]; count: number }> {
    return await this.workoutService.findAllWorkouts(user, withDeleted);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateWorkout(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkoutDto: CreateWorkoutDto,
    @GetUser() user: User,
  ) {
    return await this.workoutService.updateWorkout(
      +id,
      updateWorkoutDto,
      user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Delete('/:id')
  async removeWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.workoutService.removeWorkout(+id, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/restore')
  async restoreWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.workoutService.restoreWorkout(+id, user);
  }
}
