import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workout } from './workout.entity';
import { UserWorkout } from './user-workout.entity';
import { Task } from './task.entity';
import { ValidationCode } from './validation-code.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Workout, (workout) => workout.owner)
  ownerWorkouts: Workout[];

  @OneToMany(() => UserWorkout, (userWorkout) => userWorkout.user)
  workouts: UserWorkout[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => ValidationCode, (code) => code.user)
  code: ValidationCode;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: null })
  emailVerifiedAt: Date;
}
