import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Workout } from './workout.entity';

@Entity({ name: 'users_workouts' })
export class UserWorkout {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, (workout) => workout.users)
  workout: Workout;

  @ManyToOne(() => User, (user) => user.workouts)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
