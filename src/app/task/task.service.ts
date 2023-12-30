import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { UserWorkout } from 'src/entities/user-workout.entity';
import { User } from 'src/entities/user.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(UserWorkout)
    private userworkoutRepository: Repository<UserWorkout>,
  ) {}

  async getDefaultTaskList(
    workoutId: number,
    user: User,
    isForCurrentUserOnly = '',
  ): Promise<{ tasks: Task[]; count: number }> {
    const qb = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.user', 'user')
      .where('tasks.summary IS NULL')
      .andWhere('tasks.workout = :workoutId', { workoutId });
    if (isForCurrentUserOnly === 'true') {
      qb.andWhere('tasks.user = :userId', { userId: user.id });
    }

    const [tasks, count] = await qb.getManyAndCount();
    return { tasks, count };
  }

  async createTask(user: User, dto: TaskDto): Promise<Task> {
    const workout = await this.userworkoutRepository.findOne({
      where: { user: { id: user.id }, workout: { id: dto.workoutId } },
    });

    if (!workout) {
      throw new BadRequestException(returnMessages.UserDoesNotBelong);
    }

    return await this.taskRepository.save({
      user,
      name: dto.name,
      priority: dto.priority,
      status: dto.status,
      workspace: { id: dto.workoutId },
      deadline: dto.deadline,
    });
  }

  async updateTask(id: number, user: User, dto: TaskDto) {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!task) {
      throw new BadRequestException(returnMessages.TaskNotFound);
    }

    task.name = dto.name;
    task.priority = dto.priority;
    task.status = dto.status;
    task.deadline = dto.deadline;

    return await this.taskRepository.save(task);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!task) {
      throw new BadRequestException(returnMessages.TaskNotFound);
    }
    await this.taskRepository.remove(task);
  }
}
