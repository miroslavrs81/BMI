import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { WorkoutModule } from 'src/app/workout/workout.module';

@Module({
  imports: [WorkoutModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
