import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkout } from 'src/entities/user-workout.entity';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { UserToken } from 'src/entities/user-token.entity';
import { WorkoutProcess } from './workout.process';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, User, UserToken, UserWorkout]),
    BullModule.registerQueue({
      limiter: { max: 5, duration: 5000 },
      name: 'workspace',
    }),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutProcess],
})
export class WorkoutModule {}
