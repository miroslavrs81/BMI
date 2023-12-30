import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [WorkoutModule, TaskModule],
})
export class MainModule {}
