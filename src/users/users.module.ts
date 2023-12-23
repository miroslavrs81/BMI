import { Module } from '@nestjs/common';
import { WorkoutModule } from 'src/app/workout/workout.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [WorkoutModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
