import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkout } from 'src/entities/user-workout.entity';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { UserToken } from 'src/entities/user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, User, UserToken, UserWorkout])],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
