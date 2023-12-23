import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Summary } from './summary.entity';
import { Task } from './task.entity';
import { UserToken } from './user-token.entity';
import { UserWorkout } from './user-workout.entity';
import { User } from './user.entity';

@Entity({ name: 'workouts' })
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserWorkout, (userWorkout) => userWorkout.workout)
  users: UserWorkout[];

  @ManyToOne(() => User, (user) => user.ownerWorkouts)
  owner: User;

  @OneToMany(() => Task, (task) => task.workout)
  tasks: Task[];

  @OneToMany(() => Summary, (summary) => summary.workout)
  summaries: Summary[];

  @OneToMany(() => UserToken, (userToken) => userToken.workout)
  userTokens: UserToken[];

  @Column({ type: 'varchar' })
  workoutName: string;

  @Column({ type: 'json' })
  settings: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
