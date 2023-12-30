import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { UserWorkout } from 'src/entities/user-workout.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, UserWorkout])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
