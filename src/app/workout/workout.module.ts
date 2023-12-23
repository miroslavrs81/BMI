import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkout } from 'src/entities/user-workout.entity';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { WorkoutController } from './workout.controller';
import { WorkoutProcess } from './workout.process';
import { WorkoutService } from './workout.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, User, UserToken, UserWorkout]),
    BullModule.registerQueue({
      limiter: { max: 5, duration: 5000 },
      name: 'workout',
    }),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutProcess],
})
export class WorkoutModule {}
